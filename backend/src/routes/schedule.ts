import { Router } from "express";
import { generateSchedule } from "../planner/generateSchedule.js";
import courses from "../data/data.js"

const router = Router();

router.post("/schedule", async (req, res) => {
  const { completedIds, prefs } = req.body;

  // Basic sanity checks (cheap but effective)
  if (!Array.isArray(completedIds)) {
    return res.status(400).json({ error: "completedIds must be an array" });
  }

  if (!prefs || typeof prefs !== "object") {
    return res.status(400).json({ error: "prefs is required" });
  }

  try {
    const schedule = generateSchedule(courses, completedIds, prefs);
    res.json(schedule);
  } catch (err) {
    console.error("Schedule generation failed:", err);
    res.status(500).json({ error: "Failed to generate schedule" });
  }
});

export default router;
