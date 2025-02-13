const express = require('express');
const Exercise = require('../models/Exercise');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all exercises for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const exercises = await Exercise.find({ user: req.user }); // Only logged-in user's exercises
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create a new exercise
router.post('/', authMiddleware, async (req, res) => {
  const { name, sets, reps, weight } = req.body;

  try {
    const exercise = new Exercise({
      user: req.user, // Associate with the logged-in user
      name,
      sets,
      reps,
      weight,
    });

    await exercise.save();
    res.status(201).json({ message: 'Exercise added successfully', exercise });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update an exercise
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ _id: req.params.id, user: req.user });

    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    const { name, sets, reps, weight } = req.body;
    exercise.name = name || exercise.name;
    exercise.sets = sets || exercise.sets;
    exercise.reps = reps || exercise.reps;
    exercise.weight = weight || exercise.weight;

    await exercise.save();
    res.json({ message: 'Exercise updated successfully', exercise });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete an exercise
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ _id: req.params.id, user: req.user });

    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

    await Exercise.deleteOne({ _id: req.params.id, user: req.user });
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
