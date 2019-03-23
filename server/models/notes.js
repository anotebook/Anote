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
  },
  /* path is in format "a$b$c$N" where a is root folder Id &  b,c are 
     parents folders Id and N is notes Id. */
  path: {
    type: String,
    required: true
  },
  /* contain id of user to which this note is being shared */
  shareduserId: {
    type: []
  }
});

export default mongoose.model('notes', noteSchema);
