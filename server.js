const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Mood Tracker API!');
});

app.use('/api/auth', require('./routes/auth'));

app.use('/api/users', require('./routes/user'));

app.use('/api/moods', require('./routes/moods'));

app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});