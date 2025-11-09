const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to the Mood Tracker API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});