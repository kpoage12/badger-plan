export type Focus = "systems" | "theory" | "ai_ml" | "software" | "none";
export type Pacing = "light" | "balanced" | "intense";

export type CourseTag =
  | "gateway"
  | "heavy"
  | "prog-heavy"
  | "math-heavy"
  | "project"
  | "hardware"
  | "systems"
  | "theory"
  | "ai_ml"
  | "software";

export type CourseId = string;

export type CsCourse = {
  id: CourseId;
  code: string;
  title: string;
  credits: number;

  prereqs?: CourseId[];
  tags: CourseTag[];
  unlockValue?: number;
};
