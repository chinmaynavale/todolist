const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Server running on Port 3000'));
