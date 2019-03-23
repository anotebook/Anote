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
  folder: {
    type: String,
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
  },
  /* path is in format "a$b$c$F" where a is root folder Id &  b,c are 
     parents folders Id and F is current Folder Id. */
  path: {
    type: String,
    required: true
  },
  /* contain id of user to which this folder is being shared */
  shareduserId: {
    type: String
  }
});

export default mongoose.model('folders', folderSchema);
