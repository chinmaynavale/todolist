const express = require('express');
const mongoose = require('mongoose');
const date = require(__dirname + '/date.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose
  .connect('mongodb://localhost:27017/todolistDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Success!, Server is connected to database'))
  .catch(err => console.error(err));

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model('Item', itemsSchema);

const List = mongoose.model('List', listSchema);

const item1 = new Item({
  name: 'Welcome to your todolist!',
});

const item2 = new Item({
  name: 'Hit the + button to add a new todo item.',
});

const item3 = new Item({
  name: 'Click on any todo to mark it as complete.',
});

const defaultItems = [item1, item2, item3];

// Home Page
app.get('/', (req, res) => {
  const day = date.getDate();

  Item.find({}, (err, itemsFound) => {
    if (itemsFound.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('Success!, saved default items to DB.');
          res.redirect('/');
        }
      });
      return;
    }

    res.render('list', { listTitle: day, newListItems: itemsFound });
  });
});

app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName;

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect('/' + customListName);
      } else {
        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post('/', (req, res) => {
  const itemName = req.body.newItem;

  const newTodo = new Item({
    name: itemName,
  });

  newTodo.save();
  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;

  Item.findOneAndRemove({ _id: checkedItemId }, err => {
    if (!err) console.log('deleted!', checkedItemId);
  });

  res.redirect('/');
});

// About Page
app.get('/about', (req, res) => {
  res.render('about');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on Port 3000'));
