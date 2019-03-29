import express from 'express';
import hash from 'object-hash';

import verifyUser from '../VerifyUser';
import Note from '../models/notes';
import Folder from '../models/folders';

// eslint-disable-next-line new-cap
const app = express.Router();

/*
 * Authenticate the user.
 * After authentication, it makes the user data from Google available
 * through the `data` field in the request object. [`req.data`]
 */
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
 * @desc: Create a note.
 * @route: POST /notes/create
 * @body-params:
 *  title: Title of the note
 *  folder: The `id` of the folder in which the note should be created
 * @return: A JSON object containing the note created
 */
app.post('/create', auth, (req, res) => {
  // User data from auth
  const user = req.user;
  // Note data from request
  const { title, folder } = req.body;

  // Get the folder in which the note has to be created
  Folder.findOne(
    {
      id: folder,
      $or: [
        { owner: user.uid },
        { xlist: { $elemMatch: { email: req.user.email, visibility: 1 } } }
      ]
    },
    'xlist path owner'
  )
    .then(resultFolder => {
      // If folder doesn't exists, return
      if (resultFolder === null)
        throw Object({
          code: 400,
          reason: "Requested parent folder doesn't exists"
        });

      /* Create the note and save to db */
      const note = {
        title,
        parentFolder: folder,
        timestamp: Date.now(),
        owner: resultFolder.owner
      };
      note.id = hash(note);
      note.xlist = resultFolder.xlist.slice();
      note.path = `${resultFolder.path}$${note.id}`;

      const newNote = new Note(note);
      return newNote.save();
    })
    .then(note => res.status(200).json(note))
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * @desc: Get the notes owned by the requesting user inside a folder
 * @route: GET /notes/get/:id
 * @route-params:
 *  id: id of the folder whose notes has to be fetched
 * @return: An array containing the desired notes
 */
app.get('/get/:id', auth, (req, res) => {
  // TODO: Return folder details depending upon the acess
  Note.find({
    parentFolder: req.params.id,
    $or: [
      { owner: req.user.uid },
      { xlist: { $elemMatch: { email: req.user.email } } }
    ]
  })
    .then(notes => {
      if (notes === null) throw Object({ code: 404, reason: 'Note not found' });
      res.status(200).json(notes);
    })
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * @desc: Get the note requested by it's id
 * @route: GET /notes/view/:id
 * @route-params:
 *  id: id of the note to be fetched
 * @return: The requested note as JSON object
 */
app.get('/view/:id', auth, (req, res) => {
  // TODO: Return folder details depending upon the acess
  Note.findOne(
    {
      id: req.params.id,
      $or: [
        { owner: req.user.uid },
        { xlist: { $elemMatch: { email: req.user.email } } }
      ]
    },
    {
      _id: 0,
      id: 1,
      title: 1,
      timestamp: 1,
      owner: 1,
      content: 1,
      parentFolder: 1,
      path: 1,
      xlist: { $elemMatch: { email: req.user.email } }
    }
  )
    .then(note => {
      if (note === null) throw Object({ code: 404, reason: 'Note not found' });
      /* console.log(note); */
      res.status(200).json(note);
    })
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * @desc: Update note
 * @route: PUT /notes/update
 * @body-params:
 *  id: id of the note to update
 *  title: New title of the note
 *  content: New content of the note
 * @return: Old note which was stored
 */
app.put('/update', auth, (req, res) => {
  // TODO: Update folder details depending upon the acess
  // Get the id, title and content of the new note to update
  const { id, title, content } = req.body;
  Note.findOneAndUpdate(
    {
      id,
      $or: [
        { owner: req.user.uid },
        { xlist: { $elemMatch: { email: req.user.email, visibility: 1 } } }
      ]
    },
    { $set: { title, content } }
  )
    .then(oldNote => res.status(200).json({ prev: oldNote }))
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

/*
 * @desc: Delete the note requested by `id`
 * @route: DELETE /notes/delete/:id
 * @route-params:
 *  id: id of the note to be deleted
 * @return: A JSON object specifying number of notes deleted(should be 1)
 */
app.delete('/delete/:id', auth, (req, res) => {
  Note.deleteOne({
    id: req.params.id,
    $or: [
      { owner: req.user.uid },
      { xlist: { $elemMatch: { email: req.user.email, visibility: 1 } } }
    ]
  })
    .then(({ ok, n }) => {
      // If any error (ok != 1), throw error
      if (ok !== 1)
        throw Object({ code: 500, reason: 'Internal server error' });

      // Successfully deleted, send success response
      res.status(200).json({ reason: `Success! ${n} documents deleted`, n });
    })
    .catch(err => {
      const code = err.code || 500;
      const reason = err.reason || 'Internal server error';
      res.status(code).json({ reason });
    });
});

export default app;
