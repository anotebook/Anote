import express from 'express';
import hash from 'object-hash';

import verifyUser from '../VerifyUser';
import Folder from '../models/folders';
import User from '../models/users';

// eslint-disable-next-line new-cap
const app = express.Router();

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

      /* If user exists, create the folder and insert to db */

      const { title, visibility } = req.body;
      // If folder is root, get the root folder's id
      let { folder } = req.body;
      if (folder === 'root') folder = user.root;
      // Create folder using data extracted
      const createFolder = {
        name: title,
        visibility,
        folder,
        timestamp: Date.now(),
        owner: user.uid,
        folders: [],
        groups: [],
        notes: []
      };
      // Generate unique id for the folder
      createFolder.id = hash(createFolder);
      // Add the folder's id to the list of its parent's folders' list
      await Folder.findOneAndUpdate(
        { id: folder },
        { $push: { folders: createFolder.id } }
      );
      // Save the folder to the database
      const newFolder = new Folder(createFolder);
      return newFolder.save();
    })
    .then(folder => res.status(200).json(folder))
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * Returns the folders owned by the requesting user inside a folder
 *
 * `id` is the id of the folder
 */
app.get('/get/:id', (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Check if user exists
      return User.findOne({ uid: user.uid });
    })
    .then(user => {
      if (user === null)
        throw Object({ code: 400, reason: 'User does not exist' });

      let folder = req.params.id;
      if (folder === 'root') folder = user.root;
      // If user exists, return the folders field from selected folder
      return Folder.find({ owner: user.uid, folder });
    })
    .then(folders => {
      // Successfully send the folders
      res.status(200).json(folders);
    })
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * Handles the requests to update the folder
 */
app.put('/update', (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // Check if user exists
      return User.findOne({ uid: user.uid });
    })
    .then(user => {
      // If user not found, throw an error
      if (user === null)
        throw Object({ code: 400, reason: 'User does not exist' });

      // Get the id, title and content of the folder to be updated
      const { id, name, visibility } = req.body;
      // Update the folder
      return Folder.findOneAndUpdate({ id }, { $set: { name, visibility } });
    })
    .then(folder => {
      // Send success code
      res.status(200).json(folder);
    })
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/* TODO: add delete api for folder */

export default app;
