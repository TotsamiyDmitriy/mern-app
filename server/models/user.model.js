import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    photoURL: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/mern-estate-80ea6.appspot.com/o/1705229964517Photo_2Mb.jpg?alt=media&token=07b5bd1d-3f9a-471a-88b7-f1b4981034e8',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
