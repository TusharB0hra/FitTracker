const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bodyPart: { type: String },
  sets: { type: Number },
  reps: { type: Number },
  videoUrl: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Workout", workoutSchema);
