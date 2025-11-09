const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const MoodLog = require('../models/MoodLog');

router.get('/summary', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const allLogs = await MoodLog.find({ user: userId }).sort({ date: -1 });

    if (allLogs.length === 0) {
      return res.status(200).json({
        averages: { avgMood: 'N/A', avgSleep: 'N/A' },
        trends: [],
        latestReflection: null,
      });
    }

    const latestLog = allLogs[0];
    const latestReflection = {
      mood: latestLog.mood,
      notes: latestLog.notes,
      tags: latestLog.tags,
      date: latestLog.date,
      sleepHours: latestLog.sleepHours
    };

    const trends = allLogs
      .slice(0, 30)
      .map((log) => ({
        date: log.date,
        sleepHours: log.sleepHours,
        mood: log.mood,
      }))
      .reverse();

    const recentLogs = allLogs.slice(0, 5);

    const moodToValue = {
      'very-sad': 1,
      sad: 2,
      neutral: 3,
      happy: 4,
      'very-happy': 5,
    };
    const valueToMood = [
      '',
      'very-sad',
      'sad',
      'neutral',
      'happy',
      'very-happy',
    ];

    const sleepToValue = {
      '1-2': 1.5,
      '3-4': 3.5,
      '5-6': 5.5,
      '7-8': 7.5,
      '9+': 9.5,
    };
    const valueToSleep = (val) => {
      if (val <= 1.5) return '1-2';
      if (val <= 3.5) return '3-4';
      if (val <= 5.5) return '5-6';
      if (val <= 7.5) return '7-8';
      return '9+';
    };

    const moodSum = recentLogs.reduce(
      (acc, log) => acc + (moodToValue[log.mood] || 3),
      0
    );
    const avgMoodValue = Math.round(moodSum / recentLogs.length);
    const avgMood = valueToMood[avgMoodValue] || 'neutral';

    const sleepSum = recentLogs.reduce(
      (acc, log) => acc + (sleepToValue[log.sleepHours] || 5.5),
      0
    );
    const avgSleepValue = sleepSum / recentLogs.length;
    const avgSleep = valueToSleep(avgSleepValue);

    res.status(200).json({
      averages: { avgMood, avgSleep },
      trends,
      latestReflection,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;