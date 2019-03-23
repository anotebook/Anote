import mongoose from 'mongoose';

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
  picture: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  root: {
    type: Object
  },
  userHandle: { type: String, default: 'Me' },
  setting: {
    fontSize: { type: Number, default: 12 },
    fontColor: { type: String, default: 'black' }
  },
  // store path of shared folders
  sharedFolders: {
    type: []
  },
  // store path of shared notes
  sharedNotes: {
    type: []
  }
});

export default mongoose.model('users', userSchema);
