const express = require("express");
const router = express.Router();
const {
  getWorkouts,
  addWorkout,
  deleteWorkout
} = require("../controllers/workoutController");

router.get("/", getWorkouts);
router.post("/", addWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;
