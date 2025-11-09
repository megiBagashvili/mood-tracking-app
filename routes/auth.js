const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      const token = createToken(user._id);

      res.status(201).json({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
        token: token,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = createToken(user._id);

      res.status(200).json({
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
        token: token,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  })
);

module.exports = router;