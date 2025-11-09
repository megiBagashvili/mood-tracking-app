const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MoodLog = require('../models/MoodLog');
const asyncHandler = require('express-async-handler');

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { mood, tags, notes, sleepHours } = req.body;
    const userId = req.user.id;

    if (!mood || !sleepHours) {
      res.status(400);
      throw new Error('Please provide both mood and sleep hours');
    }

    const newLog = new MoodLog({
      user: userId,
      mood: mood,
      tags: tags,
      notes: notes,
      sleepHours: sleepHours,
    });
    const savedLog = await newLog.save();

    res.status(201).json(savedLog);
  })
);

router.get(
  '/by-date/:date',
  protect,
  asyncHandler(async (req, res) => {
    const dateParam = req.params.date;

    const startDate = new Date(dateParam);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(dateParam);
    endDate.setUTCHours(23, 59, 59, 999);

    const log = await MoodLog.findOne({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    });

    if (!log) {
      res.status(404);
      throw new Error('No mood log found for this date');
    }

    res.status(200).json(log);
  })
);

module.exports = router;