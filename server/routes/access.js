import express from 'express';

import Folder from '../models/folders';
import XList from '../models/xlist';
import Notes from '../models/notes';
import verifyUser from '../VerifyUser';
import User from '../models/users';

// eslint-disable-next-line new-cap
const app = express.Router();

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
    .catch(() => res.status(404).json({ error: 'authentication failed!' }));
};

/*
 * @route     /access/:type/:access/:id
 * @acces     private
 * @descr     get all the users who has specified access to specified folder
 *
 *            'access' = 'read' for getting the read-only accessible use
 *            'access' = 'write' for read-write access
 *
 *            'type' = 'notes' for getting the notes data and
 *            'type' = 'folders' for getting the folder data
 *
 *            'id' = id of the corresponding 'type'
 */
app.get('/:type/:access/:id', auth, (req, res) => {
  if (req.params.access !== 'read' && req.params.access !== 'write')
    return res.status(404).json({ error: 'Invalid end-point' });

  if (req.params.type !== 'notes' && req.params.type !== 'folders')
    return res.status(404).json({ error: 'Invalid end-point' });

  let searchPromise;
  if (req.params.type === 'folders')
    searchPromise = Folder.findOne({ id: req.params.id });
  else searchPromise = Notes.findOne({ id: req.params.id });

  searchPromise
    .then(result => {
      if (!result)
        return res
          .status(400)
          .json({ error: `Requested ${req.params.type} doesn't exists` });

      const type = req.params.access === 'read' ? 0 : 1;
      const response = result.xlist
        .filter(x => x.visibility === type)
        .map(x => x.email);
      return res.send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
  return 0;
});

/*
 * TODO:
 * COSTLY OPERATION. SO, RESTRICT USER FROM CALLING THIS END-POINT FREQUENTLY
 *
 * @route     /access/:type/:access/:action/:id
 * @acces     private
 * @descr     get all the users who has specified access to specified folder
 *
 *            'access' = 'read' for setting the read-only accessible and use
 *            'access' = 'write' for setting the read-write access
 *
 *            'type' = 'notes' for getting the notes data and use
 *            'type' = 'folders' for getting the folder data
 *
 *            'action' = 'add' for adding the mentioned users
 *            'action' = 'remove' for removing the access from mentioned user
 *              ***************************************************************
 *              REMEMBER YOU CAN GIVE WRITE ACCESS TO USERS HAVING READ ACCESS
 *              BUT REMOVING WRITE ACCESS THEN WILL ALSO REMOVE READ ACCESS
 *              ****************************************************************
 *
 *            'id' = id of the corresponding 'type'
 *
 * @bodyparm   email[](array of email to add) => 'mandatory field'
 *             xlist (name of the xlist you want to give access) => 'optional'
 */
app.post('/:type/:access/:id', auth, (req, res) => {
  if (req.params.access !== 'read' && req.params.access !== 'write')
    return res.status(404).json({ error: 'Invalid end-point' });

  if (req.params.type !== 'notes' && req.params.type !== 'folders')
    return res.status(404).json({ error: 'Invalid end-point' });

  if (req.params.action !== 'add' && req.params.action !== 'remove')
    return res.status(404).json({ error: 'Invalid end-point' });

  // check whether the body parameters are sent correctly or not
  if (!req.body.email || !Array.isArray(req.body.email))
    return res.status(400).json({
      email:
        'email field must be an array of emails of user and is a required parameter'
    });

  const usersList = req.body.email;
  const type = req.params.access === 'read' ? 0 : 1;
  const action = req.params.action === 'add' ? 1 : 0;

  let searchPromise;
  if (req.params.type === 'folders')
    searchPromise = Folder.findOne({ id: req.params.id });
  else searchPromise = Notes.findOne({ id: req.params.id });

  let xlistPromise;
  // if xlist is present then check for it's validity
  if (req.body.xlist) {
    xlistPromise = XList.findOne({
      name: req.body.xlist,
      owner: req.user.email
    });
  } else
    xlistPromise = new Promise(resolve => {
      resolve({ members: [] });
    });

  const userPromise = xlistPromise.then(xlist => {
    if (!xlist) {
      res.status(400).json({ xlist: "Mentinoed xlist doesn't exists" });
      return null;
    }

    for (let i = 0; i < xlist.members.length; i += 1)
      usersList.push(xlist.members[i]);

    return User.find({ email: { $in: usersList } });
  });

  Promise.all([xlistPromise, searchPromise, userPromise])
    .then(([xlist, searchResult, users]) => {
      if (!xlist) return null;

      if (!searchResult) {
        res
          .status(400)
          .json({ error: `Mentioned ${req.params.type} doesn't exists` });
        return null;
      }

      if (users.length !== usersList.length) {
        res
          .status(400)
          .json({ members: 'All the members are not registered users!' });
        return null;
      }

      const userListWithPermission = usersList.map(x => {
        return {
          email: x,
          visibility: type
        };
      });

      searchResult.xlist = searchResult.xlist.filter(
        x => !usersList.includes(x.email)
      );
      for (let i = 0; i < userListWithPermission.length && action; i += 1)
        searchResult.xlist.push(userListWithPermission[i]);

      const regex = new RegExp(`^${searchResult.path}`);
      return Folder.updateMany(
        { owner: req.user.id, path: { $regex: regex } },
        { $set: { xlist: userListWithPermission.slice() } }
      );
    })
    .then(result => {
      if (!result) return;
      res.send('Successfully updated!');
    })
    .catch(err => {
      return res.status(500).send(err);
    });
  return 0;
});

/*
 * for shared access
 */

export default app;
