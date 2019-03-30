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

/*
 * Handle API request to create a user
 *
 * First, verify the integrity of token recieved and match the client id
 * Then, check if user already exists. If exists, return user data.
 * If user doesn't exists, create one and return user's data.
 */
app.post('/create', (req, res) => {
  // Verify integrity of id token and client id
  verifyUser(req.body.id_token)
    .then(user => {
      // Verification successful!

      // Find if user exists in databse
      User.findOne({ uid: user.uid })
        .then(async result => {
          console.log(result);
          // If user doesn't exist, create one. Else, return data
          if (result === null) {
            // User doesn't exist, create one and return the data
            user.username = `${user.name.replace(/ /g, '_')}_${hash(user)}`;
            const folder = {
              name: 'root',
              owner: user.uid,
              timestamp: Date.now(),
              parentFolder: 'root',
              xlist: []
            };
            folder.id = hash(folder);
            folder.path = folder.id;
            const rootFolder = new Folder(folder);
            await rootFolder.save();
            user.root = folder.id;

            const newUser = new User(user);
            newUser.save().then(user0 => res.status(200).json(user0));
          } else {
            // User already exists, just return the data
            res.status(200).json(result);
          }
        })
        .catch((/* err */) => {
          res.status(500).json({ reason: 'Internal error' });
        });
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
