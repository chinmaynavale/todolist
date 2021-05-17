const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const items = ['Buy food', 'Cook food', 'Eat food'];
const workItems = [];

// Home Page

app.get('/', (req, res) => {
  const today = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  const day = today.toLocaleDateString('en-US', options);

  res.render('list', { listTitle: day, newListItems: items });
});

app.post('/', (req, res) => {
  const item = req.body;

  if (item.list === 'Work List') {
    workItems.push(item.newItem);
    res.redirect('/work');
  } else {
    items.push(item.newItem);
    res.redirect('/');
  }
});

// Work Page

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on Port 3000'));
