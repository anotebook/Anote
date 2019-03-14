import express from 'express';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import hash from 'object-hash';

// Configure environment variables for server
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Get OAuth client for server verification of the user
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID);

const MongoClient = mongodb.MongoClient;
const mongodbUrl = process.env.REACT_APP_MONGODB_URI;
let anoteDb = null;

// Name of our database
const DB_NAME = 'anote';

// Base url for our api
const baseUrl = '/api/v1';

// Body parser middleware for json and url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
 * Verify user when one tries to connect to the app
 *
 * This is done by-
 * 1. Verifying the integrity of id token
 * 2. Match the client id from the token with our provided client id
 */
const verifyUser = async token => {
  // Verify the integrity of id token recieved
  /* If verification fails, it will throw an error
  which is then handled by the caller */
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID
  });

  // Get the data after verification
  const payload = ticket.getPayload();

  // Verify the client id
  const clientId = payload.aud;
  if (clientId !== process.env.REACT_APP_GOOGLE_SIGNIN_CLIENT_ID) {
    // If client id didn't match, create authentication error
    throw new Error('Authentication error!');
  }

  // By this time, user has been verified!
  // Return the user data
  return {
    uid: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };
};

// Connect to our MongoDb database
MongoClient.connect(mongodbUrl, { useNewUrlParser: true }, (err, db) => {
  if (err) throw err;
  anoteDb = db.db(DB_NAME);
});

app.get('/', (req, res) => {
  res.send(`Hello World${anoteDb}`);
});

/*
 * API requests for user
 */

/*
 * Handle API reuqest to check if a user exists.
 *
 * Query the db for the user. If found, return the user data
 */
app.get(`${baseUrl}/checkUser`, (req, res) => {
  anoteDb.collection('user-list').findOne(req.query, (err, result) => {
    if (err) {
      res.status(500).json({ reason: 'Internal error' });
      return;
    }

    res.json(result);
  });
});

/*
 * Handle API request to create a user
 *
 * First, verify the integrity of token recieved and match the client id
 * Then, check if user already exists. If exists, return user data.
 * If user doesn't exists, create one and return user's data.
 */
app.post(`${baseUrl}/createUser`, (req, res) => {
  // Verify integrity of id token and client id
  verifyUser(req.body.id_token)
    .then(user => {
      // Verification successful!

      // Find id user exists in databse
      anoteDb.collection('user-list').findOne(user, (err, result) => {
        if (err) {
          res.status(500).json({ reason: 'Internal error' });
          return;
        }

        // If user doesn't exist, create one. Else, return data
        if (result === null) {
          // User doesn't exist, create one and return the data
          user.username = `${user.name.replace(/ /g, '_')}_${hash(user)}`;
          anoteDb.collection('user-list').insertOne(user, err0 => {
            if (err0) {
              res.status(500).json({ reason: 'Internal error' });
              return;
            }

            res.status(200).json(user);
          });
        } else {
          // User already exists, just return the data
          res.status(200).json(result);
        }
      });
    })
    .catch(err => {
      // Verification failed
      res.status(400).json({ reason: `Authentication failed!\n${err}` });
    });
});

/*
 * API requests for notes
 */

/*
 * It creates a note when requested.
 * First it authenticates the user, then checks if it exists
 * and then inserts the note.
 */
app.post(`${baseUrl}/create-note`, (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Create note and insert to the database
      const { title, visibility, timestamp } = req.body;
      const note = { title, visibility, timestamp };
      note.owner = user.uid;
      note.id = hash(note);
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
        // If user exists, create the note
        anoteDb.collection('notes').insertOne(note, err0 => {
          if (err0) {
            res.status(500).json({ reason: 'Internal error' });
            return;
          }
          res.status(200).json(note);
        });
      });
    })
    .catch(err => {
      // Verification failed
      res.status(400).json({ reason: `Authentication failed!\n${err}` });
    });
});

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
