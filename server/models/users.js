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
  notes: {
    type: []
  }
});

export default mongoose.model('users', userSchema);
