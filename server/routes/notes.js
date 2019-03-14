const express = require('express');
const verifyUser = require('../VerifyUser');
const app = express.Router();
import hash from 'object-hash';
const Note = require('../models/notes');
const User = require('../models/users');

/*
 * It creates a note when requested.
 * First it authenticates the user, then checks if it exists
 * and then inserts the note.
 */
app.post(`/create`, (req, res) => {
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
          newNote.save()
            .then(note => res.status(200).json(note))
            .catch(err => res.status(500).json({ reason: 'Internal error' }));
        })
        .catch(err => res.status(500).json({ reason: 'Internal error' }));
    })
    .catch(err => {
      // Verification failed
      res.status(400).json({ reason: `Authentication failed!\n${err}` });
    });
});

module.exports = app;