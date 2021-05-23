const express = require('express');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const items = ['Buy food', 'Cook food', 'Eat food'];
const workItems = [];

mongoose
  .connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Success!, Server is connected to database'))
  .catch(err => console.error(err));

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your todolist!',
});

const item2 = new Item({
  name: 'Hit the + button to add a new todo item.',
});

const item3 = new Item({
  name: 'Click on any todo to mark it as complete.',
});

Item.insertMany([item1, item2, item3], err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Success!, saved default items to DB.');
});

// Home Page
app.get('/', (req, res) => {
  const day = date.getDate();

  res.render('list', { listTitle: day, newListItems: items });
});

app.post('/', (req, res) => {
  const item = req.body;

  if (item.list === 'Work List') {
    workItems.push(item.newItem);
    res.redirect('/work');
    return;
  }

  items.push(item.newItem);
  res.redirect('/');
});

// Work Page
app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

// About Page
app.get('/about', (req, res) => {
  res.render('about');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on Port 3000'));
