const express = require('express');

const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const today = new Date();
  const currentDay = today.getDay();
  let day = '';

  switch (currentDay) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;

    default:
      console.log(`Error: Current day is equal to: ${currentDay}`);
      break;
  }

  res.render('list', { kindOfDay: day });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on Port 3000'));
