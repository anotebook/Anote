import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String
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
  },
  folder: {
    type: String,
    required: true
  }
});

export default mongoose.model('notes', noteSchema);
