import hash from 'object-hash';
import express from 'express';

import verifyUser from '../VerifyUser';
import User from '../models/users';

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

      // Find id user exists in databse
      User.findOne({ uid: user.uid })
        .then(result => {
          // If user doesn't exist, create one. Else, return data
          if (result === null) {
            // User doesn't exist, create one and return the data
            user.username = `${user.name.replace(/ /g, '_')}_${hash(user)}`;

            const newUser = new User(user);
            newUser
              .save()
              .then(user0 => res.status(200).json(user0))
              .catch(err => res.status(500).json({ reason: err }));
          } else {
            // User already exists, just return the data
            res.status(200).json(result);
          }
        })
        .catch(() => res.status(500).json({ reason: 'Internal error' }));
    })
    .catch(err => {
      // Verification failed
      res.status(400).json({ reason: `Authentication failed!\n${err}` });
    });
});

export default app;
