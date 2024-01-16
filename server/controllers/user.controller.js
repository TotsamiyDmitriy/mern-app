import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

export const test = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You cant update someone else's account"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          photoURL: req.body.photoURL,
        },
      },
      { new: true },
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You cant delete someone else's account"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token').status(200).json({
      success: true,
      message: 'User delete successfully!',
    });
  } catch (error) {
    next(error);
  }
};
