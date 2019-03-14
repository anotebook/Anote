const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
  },
  visibility: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  content: {
    type: String
  }
});

module.exports = mongoose.model('notes', noteSchema);
