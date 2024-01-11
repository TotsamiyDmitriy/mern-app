import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
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
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, 'User not found!'));
      return;
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials! '));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    res.cookie('access_token', token, { httpOnly: true }).status(200).json(validUser);
  } catch (error) {
    next(error);
  }
};
