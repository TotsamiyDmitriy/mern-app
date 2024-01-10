import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hashedPass = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPass });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'user created successfuly',
    });
  } catch (error) {
    next(errorHandler(error.status, error.message));
  }
};
