const mongoose = require('mongoose');

const arrayLimit = (val) => {
  return val.length <= 3;
};

const moodLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    mood: {
      type: String,
      required: [true, 'Please select a mood'],
      enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'],
    },
    tags: {
      type: [String],
      validate: [
        arrayLimit,
        'You can select a maximum of 3 tags',
      ],
    },
    notes: {
      type: String,
      default: '',
    },
    sleepHours: {
      type: String,
      required: [true, 'Please select your sleep hours'],
      enum: ['1-2', '3-4', '5-6', '7-8', '9+'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MoodLog', moodLogSchema);