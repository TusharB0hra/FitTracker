const Workout = require("../models/Workout");

// GET all workouts
const getWorkouts = async (req, res) => {
  const workouts = await Workout.find();
  res.json(workouts);
};

// POST a new workout
const addWorkout = async (req, res) => {
  const { name, bodyPart, sets, reps } = req.body;
  try {
    const newWorkout = new Workout({ name, bodyPart, sets, reps });
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Workout.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getWorkouts,
  addWorkout,
  deleteWorkout
};
