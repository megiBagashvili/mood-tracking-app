const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    fullName: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: 'default-avatar.png',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
module.exports = mongoose.model('User', userSchema);