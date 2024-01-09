import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPass = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPass });
  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'user created successfuly',
    });
  } catch (error) {
    next(errorHandler(550, error.message));
  }
};
