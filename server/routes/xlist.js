import express from 'express';
import verifyUser from '../VerifyUser';
import User from '../models/users';
import XList from '../models/xlist';
import validateEmail, { name as validateName } from '../validation';

// eslint-disable-next-line new-cap
const router = express.Router();

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
  @route      POST api/xlist/create
  @descrp     create a XList
  @access     protected
  @bodyparm   members(Array of email-id), name(name of the xlist)
*/
const createXlistCallback = (req, res) => {
  // validate the request body parameters
  if (!req.body.name || !validateName(req.body.name))
    return res.status(400).json({
      name:
        "name is required and must starts with a letter and can contains only alphanumeric characters or an underscore '_'"
    });

  let validMemberList = true;

  if (req.body.members) {
    if (!(req.body.members instanceof Array)) validMemberList = false;
    else {
      for (let i = 0; i < req.body.members.length; i += 1)
        if (!validateEmail(req.body.members[i])) validMemberList = false;
    }
  } else validMemberList = false;

  if (!validMemberList)
    return res.status(400).json({ error: 'email list of members is required' });

  const xlistPromise = XList.find({
    owner: req.user.email,
    name: req.body.name
  });
  const membersPromise = User.find({ email: { $in: req.body.members } });

  Promise.all([xlistPromise, membersPromise])
    .then(([xlist, members]) => {
      // if there is already an xlist with same name
      if (xlist.length) {
        res.status(400).json({ name: 'XList of same name already exists' });
        return null;
      }

      // if there is an invalid member in the member list
      if (members.length !== req.body.members.length) {
        res
          .status(400)
          .json({ members: 'All the members are not registered users' });
        return null;
      }

      // if owner is not present in the list then add him
      if (!req.body.members.includes(req.user.email))
        req.body.members.push(req.user.email);

      const newXlist = new XList({
        name: req.body.name,
        owner: req.user.email,
        lastUpdated: Date.now(),
        members: req.body.members
      });
      return newXlist.save();
    })
    .then(result => {
      // If the resonse is already sent to the client
      if (!result) return;
      res.send(result);
    })
    .catch(err => res.status(500).send(err));

  return 0;
};

router.post('/create', auth, createXlistCallback);

/*
  @route    GET /api/xlist/me
  @descrp   get all the Xlist created by me
  @access   protected
*/
router.get('/me', auth, (req, res) => {
  XList.find({ owner: req.user.email }, { _id: 0, owner: 0 })
    .then(xlists => {
      const lightWeightXlists = [];

      for (let itr = 0; itr < xlists.length; itr += 1) {
        const xlist = xlists[itr];
        const cur = {
          lastUpdated: xlist.lastUpdated,
          name: xlist.name,
          members: []
        };
        for (let i = 0; i < Math.min(3, xlist.members.length); i += 1)
          cur.members.push(xlist.members[i]);
        lightWeightXlists.push(cur);
      }

      res.json(lightWeightXlists);
    })
    .catch(err => {
      res.status(500).send('Internal server error. Try again!');
    });
});

/*
  @route    GET /api/xlist/me/:name
  @descrp   get the Xlist specified XList
  @access   protected
*/
router.get('/me/:name', auth, (req, res) => {
  XList.find(
    { name: req.params.name, owner: req.user.email },
    { _id: 0, owner: 0 }
  )
    .then(xlist => {
      if (xlist.length === 0) {
        res
          .status(400)
          .json({ name: `XList: "${req.params.name}" doesn't exists` });
        return;
      }

      res.send(xlist[0]);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/*
  @route    POST /api/xlist/me/:name/edit-name/:newName
  @descrp   rename the xlist
  @access   protected
*/
router.post('/me/:name/edit-name/:newName', auth, (req, res) => {
  // validate the newName and name format before db query
  if (!validateName(req.params.name)) {
    res.status(400).json({ name: 'Invalid xlist name' });
    return;
  }

  if (!validateName(req.params.newName)) {
    res.status(400).json({ name: 'Invalid xlist name' });
    return;
  }

  XList.find({
    owner: req.user.email,
    name: { $in: [req.params.name, req.params.newName] }
  })
    .then(xlists => {
      if (!xlists.length) {
        res.status(400).json({ name: 'No such Xlist exists' });
        return null;
      }

      for (let i = 0; i < xlists.length; i += 1) {
        const xlist = xlists[i];
        if (xlist.name === req.params.newName) {
          res
            .status(400)
            .json({ name: 'Xlist with same name already exists!' });
          return null;
        }
      }

      return XList.findByIdAndUpdate(xlists[0]._id, {
        $set: { name: req.params.newName, lastUpdated: Date.now() }
      });
    })
    .then(result => {
      // check if the request is already handled
      if (!result) return;
      res.json(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/*
  @route    POST /api/xlist/me/:name
  @descrp   add the given member to Xlist
  @access   protected
*/
router.post('/me/:name', auth, (req, res) => {
  // validate the requested email to add
  if (!validateEmail(req.body.email)) {
    res.status(400).json({ email: 'given email is not valid' });
    return;
  }

  // check whether the pattern of the name is correct or not (avoid querying db)
  if (!validateName(req.params.name)) {
    res.status(400).json({ name: 'Invalid xlist name' });
    return;
  }

  // find the XList with given name
  const xlistPromise = XList.find({
    owner: req.user.email,
    name: req.params.name
  });
  const validUserPromise = User.find({ email: req.body.email });

  Promise.all([validUserPromise, xlistPromise])
    .then(([user, result]) => {
      // check whether the given use is registered or not
      if (!user.length)
        return res.status(400).json({ email: 'user not registered' });

      if (result.length === 0) {
        // XList with given name doesn't exist
        res.status(400).json({ name: "XList doesn't exists" });
        return null;
      }
      // XLst with given name exist
      const xlist = result[0];
      // check if the member is already added in this list
      if (xlist.members.includes(req.body.email)) {
        res.status(400).json({ email: 'user already a member in this list' });
        return null;
      }

      xlist.members.push(req.body.email);
      xlist.lastUpdated = Date.now();

      return XList.findOneAndUpdate(
        {
          owner: req.user.email,
          name: req.params.name
        },
        {
          $set: { lastUpdated: Date.now() },
          $push: { members: req.body.email }
        },
        { new: true }
      );
    })
    .then(result => {
      // If the response is already sent to the client
      if (!result) return 0;
      return res.send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/*
  @route    POST /api/xlist/me/remove/:name/
  @descrp   delete the given email from the current XList
  @access   protected
*/
router.post('/me/remove/:name', auth, (req, res) => {
  // validate the params and body parameters values
  if (!validateEmail(req.body.email)) {
    res.status(400).json({ email: 'given email is not valid' });
    return;
  }

  if (!validateName(req.params.name)) {
    res.status(400).json({ name: 'given name is not valid' });
    return;
  }

  // check whether it's an attempt to delete the owner itself
  if (req.body.email === req.user.email) {
    res.status(400).json({ email: "The owner can't be deleted" });
    return;
  }

  // find the current XList
  XList.find({
    owner: req.user.email,
    name: req.params.name
  })
    .then(result => {
      if (result.length === 0) {
        res.status(400).json({ name: "XList doesn't exist" });
        return null;
      }

      const xlist = result[0];
      // check whether the specified email is in member list or not
      if (!xlist.members.includes(req.body.email)) {
        res.status(400).json({ email: 'user is not a memeber of this Xlist' });
        return null;
      }

      // filter out the requested member
      xlist.members = xlist.members.filter(email => email !== req.body.email);

      return XList.findOneAndUpdate(
        {
          owner: req.user.email,
          name: req.params.name
        },
        {
          $set: { members: xlist.members, lastUpdated: Date.now() }
        },
        { new: true }
      );
    })
    .then(result => {
      if (!result) return;
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

/*
  @route    DELETE /api/xlist/me/:name
  @descrp   delete the given named Xlist (if created by user)
  @access   protected
*/
router.delete('/me/:name', auth, (req, res) => {
  // check whether the pattern of the name is correct or not (avoid querying db)
  const nameRegex = /^([a-zA-Z])([a-zA-Z_0-9]){0,255}$/;
  if (!nameRegex.test(req.params.name)) {
    res.status(400).json({ name: 'Invalid xlist name' });
    return;
  }

  XList.findOneAndRemove({ name: req.params.name, owner: req.user.email })
    .then(xlist => {
      if (!xlist) {
        res
          .status(400)
          .json({ name: `XList: "${req.params.name}" doesn't exist` });
        return;
      }

      res.json({ result: 'successfully deleted!' });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

export default router;
