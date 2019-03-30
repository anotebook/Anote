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
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
};

/*
 * @route   /access/shared/with-me/:type
 * @access  private
 * @descrp  get all the folders and notes shared by current user
 *          parameters :
 *            type = 'read' => to get read-only folders and notes
 *            type = 'write' => to get the read-write folders and notes
 *
 * return   A json object
 *          {
 *            notes: [] => array of notes shared with me
 *            folders: [] => array of folders shared with me
 *          }
 */
app.get('/shared/with-me/:type', auth, (req, res) => {
  if (req.params.type !== 'read' && req.params.type !== 'write')
    return res.status(404).json({ error: 'Invalid end-point' });

  const type = req.params.type === 'read' ? 0 : 1;

  const folderPromise = Folder.find({
    $query: {
      xlist: { $elemMatch: { visibility: type, email: req.user.email } }
    },
    $orderby: { path: 1 }
  });
  const notesPromise = Notes.find({
    $query: {
      xlist: { $elemMatch: { visibility: type, email: req.user.email } }
    },
    $orderby: { path: 1 }
  });

  Promise.all([folderPromise, notesPromise])
    .then(([folders, notes]) => {
      const n = folders.length;
      let result = [];
      let prvString = '';
      for (let i = 0; i < n; i += 1) {
        if (i === 0) {
          prvString = folders[i].path;
          result.push(folders[i]);
          // eslint-disable-next-line no-continue
          continue;
        }
        const currString = folders[i].path;
        if (currString.length <= prvString.length) {
          prvString = currString;
          result.push(folders[i]);
          // eslint-disable-next-line no-continue
          continue;
        }
        let prefix = 1;
        for (let j = 0; j < prvString.length; j += 1) {
          if (prvString[j] !== currString[j]) {
            prefix = 0;
            break;
          }
        }
        if (prefix === 0) {
          result.push(folders[i]);
          prvString = currString;
          // eslint-disable-next-line no-continue
          continue;
        }

        let nestingLevel = 0;
        for (let j = prvString.length; j < currString.length; j += 1)
          if (currString[j] === '$') {
            nestingLevel += 1;
            if (nestingLevel > 1) break;
          }
        if (nestingLevel > 1) result.push(folders[i]);

        prvString = currString;
      }

      // for (let i = 0; i < result.length; i += 1) console.log(result[i]);

      const folderPaths = folders.map(x => x.path);
      // filter the notes result from those which can
      // be accessed through folders
      notes = notes.filter(x => !folderPaths.includes(x.path));

      result = result.map(x => {
        return {
          name: x.name,
          owner: x.owner,
          parentFolder: x.parentFolder,
          timestamp: x.timestamp,
          id: x.id
        };
      });

      notes = notes.map(x => {
        return {
          name: x.title,
          owner: x.owner,
          id: x.id,
          timestamp: x.timestamp
        };
      });

      res.json({
        notes,
        result
      });
    })
    .catch(err => res.status(500).send(err));
  return 0;
});

/*
 * @route     /access/:type/:id
 * @acces     private
 * @descr     get all the users who has specified access to specified folder
 *
 *            'type' = 'notes' for getting the notes data and
 *            'type' = 'folders' for getting the folder data
 *
 *            'id' = id of the corresponding 'type'
 */
app.get('/:type/:id', auth, (req, res) => {
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

      return res.send(result.xlist);
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
 *
 *            'id' = id of the corresponding 'type'
 *
 * @bodyparm   email[](array of email to add) => 'mandatory field'
 *             xlist (name of the xlist you want to give access) => 'optional'
 */
app.post('/:type/:access/:action/:id', auth, (req, res) => {
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

    xlist.members = xlist.members.filter(x => !usersList.includes(x));

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
        x => !(usersList.includes(x.email) || x.email === req.user.email)
      );
      for (let i = 0; i < userListWithPermission.length && action; i += 1)
        if (userListWithPermission[i].email !== req.user.email)
          searchResult.xlist.push(userListWithPermission[i]);

      const regex = new RegExp(`^${searchResult.path}`.replace(/\$/g, '\\$'));
      let foldersUpdatePromise;
      let notesUpdatePromise;

      if (req.params.type === 'folders') {
        foldersUpdatePromise = Folder.updateMany(
          { owner: req.user.uid, path: { $regex: regex } },
          { $set: { xlist: searchResult.xlist.slice() } }
        );
        notesUpdatePromise = Notes.updateMany(
          { owner: req.user.uid, path: { $regex: regex } },
          { $set: { xlist: searchResult.xlist.slice() } }
        );
      } else {
        notesUpdatePromise = Notes.updateOne(
          { owner: req.user.uid, path: { $regex: regex } },
          { $set: { xlist: searchResult.xlist.slice() } }
        );
        foldersUpdatePromise = new Promise(resolve => {
          resolve([]);
        });
      }

      return Promise.all([notesUpdatePromise, foldersUpdatePromise]);
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

export default app;
