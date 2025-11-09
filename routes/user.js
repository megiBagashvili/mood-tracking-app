const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(404).json({ msg: 'User not found' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.profileImage = req.body.profileImage || user.profileImage;
      const updatedUser = await user.save();

      res.status(200).json({
        id: updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ msg: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;