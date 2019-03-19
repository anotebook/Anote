import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  folders: {
    type: []
  },
  groups: {
    type: []
  },
  notes: {
    type: []
  }
});

export default mongoose.model('folders', folderSchema);
