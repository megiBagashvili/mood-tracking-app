const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MoodLog = require('../models/MoodLog');

router.post('/', protect, async (req, res) => {
  try {
    const { mood, tags, notes, sleepHours } = req.body;
    const userId = req.user.id;
    const newLog = new MoodLog({
      user: userId,
      mood: mood,
      tags: tags,
      notes: notes,
      sleepHours: sleepHours,
    });

    const savedLog = await newLog.save();

    res.status(201).json(savedLog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/by-date/:date', protect, async (req, res) => {
  try {
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
      return res.status(404).json({ msg: 'No mood log found for this date' });
    }

    res.status(200).json(log);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;