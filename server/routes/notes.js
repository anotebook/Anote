import hash from 'object-hash';
import express from 'express';

import verifyUser from '../VerifyUser';
import Note from '../models/notes';
import User from '../models/users';
import Folder from '../models/folders';

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
      // Check if user exists
      return User.findOne({ uid: user.uid });
    })
    .then(async user => {
      if (user === null)
        throw Object({ code: 400, reason: 'User does not exist' });

      /* If user exists, create the note */

      // Create note and insert to the database
      const { title, visibility, timestamp } = req.body;
      // If folder is root, get the root folder's id
      let { folder } = req.body;
      if (folder === 'root') folder = user.root;
      // Create the note using the data extracted
      const note = { title, visibility, folder, timestamp };
      note.owner = user.uid;
      note.id = hash(note);
      // Update the folder with the new note's id
      await Folder.findOneAndUpdate(
        { id: folder },
        { $push: { notes: note.id } }
      );
      // Note created
      const newNote = new Note(note);
      // Save to db and return the result
      return newNote.save();
    })
    .then(note => res.status(200).json(note))
    .catch(err => {
      const code = err.code || 500;
      // Verification failed
      res.status(code).json({ reason: err.reason || 'Internal server error' });
    });
});

/*
 * Returns the notes owned by the requesting user inside a folder
 *
 * 'id` is the id of the folder
 */
app.get('/get/:id', (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Check if user exists
      return User.findOne(user);
    })
    .then(user => {
      if (user === null)
        throw Object({ code: 400, reason: 'User does not exist' });

      let folder = req.params.id;
      if (folder === 'root') folder = user.root;
      // If user exists, return all the notes owned
      return Note.find({ owner: user.uid, folder });
    })
    .then(notes => {
      // Successfully send the notes
      res.status(200).json(notes);
    })
    .catch(err => {
      const code = err.code || 500;
      // Verification failed
      res.status(code).json({ reason: err.reason || 'Internal server error' });
    });
});

/*
 * Returns the note requested to open
 *
 * 'id` is the id of the note
 */
app.get('/view/:id', (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Check if user exists
      return User.findOne(user);
    })
    .then(user => {
      if (user === null)
        throw Object({ code: 400, reason: 'User does not exist' });

      // If user exists, return all the notes owned
      return Note.findOne({ owner: user.uid, id: req.params.id });
    })
    .then(note => {
      // Successfully send the notes
      res.status(200).json(note);
    })
    .catch(err => {
      const code = err.code || 500;
      // Verification failed
      res.status(code).json({ reason: err.reason || 'Internal server error' });
    });
});

export default app;
