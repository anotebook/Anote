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

export default app;
