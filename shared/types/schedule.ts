import type { CourseId } from "./course.js";

export type ScheduleWarning =
  | "NOT_ENOUGH_ELIGIBLE"
  | "TOO_HEAVY_FOR_PACING";

export type ScheduledCourse = {
  id: CourseId;
  reason: string
};

export type GeneratedSchedule = {
  selected: ScheduledCourse[];
  alternatives: CourseId[];
  warnings: { code: ScheduleWarning; message: string }[];
  estimatedCredits: number;
};
