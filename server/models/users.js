const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  pictue: {
    type: String,
  },
  username: {
    type: String,
    required: true
  },
  about: {
    type: String,
  },
  notes: {
    type: []
  }
});

module.exports = mongoose.model('users', userSchema);

/*
  uid: String, req,
  email: String, req,
  name: String, req,
  picture: String, opt,
  username: String, req,
  about: String, opt,
  notes: [], opt
*/