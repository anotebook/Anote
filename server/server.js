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

/*
 * Returns the notes owned by the requesting user
 */

app.get(`${baseUrl}/notes`, (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Check if user exists
      anoteDb.collection('user-list').findOne(user, (err, result) => {
        if (err) {
          res.status(500).json({ reason: 'Internal error' });
          return;
        }
        if (result === null) {
          res.status(400).json({ reason: 'User does not exist' });
          return;
        }

        // If user exists, return all the notes owned
        const uid = user.uid;
        anoteDb
          .collection('notes')
          .find({ owner: uid })
          .toArray((err0, notes) => {
            // Conver to array and send
            if (err0) {
              res.status(500).json({ reason: 'Internal error' });
              return;
            }

            // Successfully send the notes
            res.status(200).json(notes);
          });
      });
    })
    .catch(err => {
      // Verification failed
      res.status(400).json({ reason: `Authentication failed!\n${err}` });
    });
});

app.listen(port, () => `Listening on port ${port}`);
