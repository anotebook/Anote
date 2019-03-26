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
  timestamp: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  parentFolder: {
    type: String,
    required: true
  },
  /* path is in format "a$b$c$F" where a is root folder Id &  b,c are 
     parents folders Id and F is current Folder Id. */
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

export default mongoose.model('folders', folderSchema);
