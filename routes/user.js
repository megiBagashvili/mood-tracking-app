const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

router.put(
  '/profile',
  protect,
  asyncHandler(async (req, res) => {
    const user = req.user;

    user.fullName = req.body.fullName || user.fullName;
    user.profileImage = req.body.profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      profileImage: updatedUser.profileImage,
    });
  })
);

module.exports = router;