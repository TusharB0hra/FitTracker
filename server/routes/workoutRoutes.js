const express = require("express");
const router = express.Router();
// 🛠️ ADD THIS
const multer = require("multer");

// 🧠 Setup Multer Storage (optional: you can customize path or filename)
const storage = multer.memoryStorage(); // or use diskStorage if saving locally
const upload = multer({ storage });
const Workout = require("../models/Workout");
const {
  getWorkouts,
  addWorkout,
  deleteWorkout
} = require("../controllers/workoutController");

router.get("/", getWorkouts);
router.post("/", upload.single("image"), async (req, res) => {
  const newWorkout = new Workout({
    name: req.body.name,
    bodyPart: req.body.bodyPart,
    sets: req.body.sets,
    reps: req.body.reps,
    videoUrl: req.body.videoUrl,
    image: req.file ? req.file.filename : null
  });

  try {
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/:id", deleteWorkout);

module.exports = router;
