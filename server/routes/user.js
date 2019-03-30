import hash from 'object-hash';
import express from 'express';

import verifyUser from '../VerifyUser';
import User from '../models/users';
import Folder from '../models/folders';

// eslint-disable-next-line new-cap
const app = express.Router();

/*
 * Handle API reuqest to check if a user exists.
 *
 * Query the db for the user. If found, return the user data
 */
app.get('/check', (req, res) => {
  User.findOne(req.query)
    .then(result => res.json(result))
    .catch(() => res.status(500).json({ reason: 'Internal error' }));
});

// authenticate the user and set the req.user to it's properties
const auth = (req, res, next) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err =>
      res.status(404).json({ error: `authentication failed!\n${err}` })
    );
};

/*
 * Handle API request to create a user
 *
 * First, verify the integrity of token recieved and match the client id
 * Then, check if user already exists. If exists, return user data.
 * If user doesn't exists, create one and return user's data.
 */
app.post('/create', auth, (req, res) => {
  // Verify integrity of id token and client id
  // Find if user exists in databse
  User.findOne({ uid: req.user.uid })
    .then(result => {
      console.log(result);
      // If user doesn't exist, create one. Else, return data
      if (result !== null) {
        res.status(200).json(result);
        return null;
      }
      // User doesn't exist, create one and return the data
      req.user.username = `${req.user.name.replace(/ /g, '_')}_${hash(
        req.user
      )}`;
      const folder = {
        name: 'root',
        owner: req.user.uid,
        timestamp: Date.now(),
        parentFolder: 'root',
        xlist: []
      };
      folder.id = hash(folder);
      folder.path = folder.id;
      const rootFolder = new Folder(folder);
      // await rootFolder.save();
      return rootFolder.save();
    })
    .then(folder => {
      if (!folder) return null;
      req.user.root = folder.id;
      const newUser = new User(req.user);
      return newUser.save();
    })
    .then(user0 => {
      if (!user0) return;
      res.json(user0);
    })
    .catch(err => {
      console.log(err);
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * It updates the user settings on request.
 * It verifies the user and then update the setting.
 */

app.post('/updateSetting', (req, res) => {
  // Get the auth token of the user which sent the request
  const idToken = req.header('Authorization');
  // Verify the user and then continue further steps
  verifyUser(idToken)
    .then(user => {
      // get required data to update setting
      const { userHandle, fontSize, fontColor } = req.body;
      // make a setting object
      const setting = { fontSize, fontColor };
      return User.findOneAndUpdate(
        { uid: user.uid },
        { $set: { setting, userHandle } }
      );
    })
    .then(setting => res.status(200).json(setting))
    .catch(err => {
      const code = err.code || 500;
      // Verification failed
      res.status(code).json({ reason: err.reason || 'Internal server error' });
    });
});

export default app;
