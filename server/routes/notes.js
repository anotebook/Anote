import hash from 'object-hash';
import express from 'express';

import verifyUser from '../VerifyUser';
import Note from '../models/notes';
import User from '../models/users';

// eslint-disable-next-line new-cap
const app = express.Router();

/*
 * It creates a note when requested.
 * First it authenticates the user, then checks if it exists
 * and then inserts the note.
 */
app.post('/create', (req, res) => {
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
      User.findOne({ uid: user.uid })
        .then(result => {
          if (result === null) {
            res.status(400).json({ reason: 'User does not exist' });
            return;
          }
          // If user exists, create the note
          const newNote = new Note(note);
          newNote
            .save()
            .then(note0 => res.status(200).json(note0))
            .catch(() => res.status(500).json({ reason: 'Internal error' }));
        })
        .catch(() => res.status(500).json({ reason: 'Internal error' }));
    })
    .catch(err => {
      // Verification failed
      res.status(400).json({ reason: `Authentication failed!\n${err}` });
    });
});

/*
 * Returns the notes owned by the requesting user
 */
app.get('/get', (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Check if user exists
      User.findOne(user, (err, result) => {
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
        Note.find({ owner: uid }, (err0, notes) => {
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

export default app;
