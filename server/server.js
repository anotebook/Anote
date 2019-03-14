import express from 'express';
import dotenv from 'dotenv';

// Configure environment variables for server
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const notes = require('./routes/notes');
const users = require('./routes/user');
const mongoose = require('mongoose');

// Base url for our api
const baseUrl = '/api/v1';

// Body parser middleware for json and url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to the database
mongoose
  .connect(process.env.REACT_APP_MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('mongodb connected..'))
  .catch(err => {
    console.log('Error while connecting to mongodb :', err);
  });

// api end-points
app.get('/', (req, res) => {
  res.send(`Hello World!`);
});

app.use(`${baseUrl}/notes`, notes);
app.use(`${baseUrl}/users`, users);

app.listen(port, () => `Listening on port ${port}`);
