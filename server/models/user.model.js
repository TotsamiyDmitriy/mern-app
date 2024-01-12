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
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Fprofile-icon-png&psig=AOvVaw0mQtMaP8sb4S5J7Sie3Llw&ust=1705115224596000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCIjPka3v1oMDFQAAAAAdAAAAABAw',
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
