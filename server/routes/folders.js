import express from 'express';
import hash from 'object-hash';

import verifyUser from '../VerifyUser';
import Folder from '../models/folders';
import Notes from '../models/notes';

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
 * @bodyparm    owner: uid (owner of the current folder)
 */
app.post('/create', auth, (req, res) => {
  const parentFolder = req.body.folder;
  Folder.findOne({
    id: parentFolder
  })
    .then(result => {
      if (!result) {
        res
          .status(400)
          .json({ Folder: "Requested parent folder doesn't exists" });
        return null;
      }
      // TODO: If the below technique for get request works then remove this
      let hasAccess = req.user.uid === result.owner ? 1 : 0;
      for (let i = 0; i < result.xlist.length && hasAccess === 0; i += 1)
        if (
          result.xlist[i].email === req.user.email &&
          result.xlist[i].visibility === 1
        ) {
          hasAccess = 1;
          break;
        }

      if (hasAccess === 0) {
        res.status(400).send("contact the owner you don't have access");
        return null;
      }

      // parentFolder exisits and we have it's reference
      const { title } = req.body;
      // Create folder using data extracted
      const createFolder = {
        name: title,
        parentFolder,
        timestamp: Date.now(),
        owner: req.user.uid
      };
      // Generate unique id for the folder
      createFolder.id = hash(createFolder);
      createFolder.xlist = result.xlist.slice();
      createFolder.path = `${result.path}$${createFolder.id}`;

      const newFolder = new Folder(createFolder);
      return newFolder.save();
    })
    .then(result => {
      /* console.log(result); */
      res.status(200).json(result);
    })
    .catch(err => {
      /* console.log(err); */
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * Returns the folders(or notes) owned by the requesting user
 * inside a folder-id mentioned
 */
app.get('/get/:id', auth, (req, res) => {
  Folder.find({
    parentFolder: req.params.id,
    $or: [
      { owner: req.user.uid },
      { xlist: { $elemMatch: { email: req.user.email } } }
    ]
  })
    .then(folders => {
      if (folders === null)
        throw Object({ code: 400, reason: 'Folder not found' });

      res.send(folders);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/*
 * delete specified folder
 */
app.delete('/delete/:id', auth, (req, res) => {
  let delRegex;

  Folder.findOne({
    id: req.params.id,
    $or: [
      { owner: req.user.uid },
      { xlist: { $elemMatch: { email: req.user.uid, visibility: 1 } } }
    ]
  })
    .then(folder => {
      if (!folder) {
        res.status(400).json({ folder: "Mentioned folder doesn't exists" });
        return null;
      }

      delRegex = new RegExp(`^${folder.path}`.replace(/\$/g, '\\$'));
      return Folder.deleteMany({ path: { $regex: delRegex } });
    })
    .then(deleteRes => {
      // response is already sent to the client
      if (!deleteRes) return null;
      return Notes.deleteMany({ path: delRegex });
    })
    .then(deleteRes => {
      if (!deleteRes) return;
      res.send('Deleted successfully!');
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

export default app;
