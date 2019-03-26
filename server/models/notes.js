import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String
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
  parentFolder: {
    type: String,
    required: true
  },
  /* path is in format "a$b$c$N" where a is root folder Id &  b,c are
     parents folders Id and N is notes Id. */
  path: {
    type: String,
    required: true
  },
  xlist: {
    type: [
      {
        email: {
          type: String,
          required: true
        },
        visibility: {
          // 0 for read-only and 1 for read-write
          type: Number,
          required: true
        }
      }
    ],
    required: true
  }
});

export default mongoose.model('notes', noteSchema);
