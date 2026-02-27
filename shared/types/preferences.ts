import type { Pacing, Focus } from "./course.js";

export type CsPrefs = {
  csCount: 2 | 3 | 4;
  pacing: Pacing;
  focus: Focus;

  maxHeavy: 1 | 2 | 3;
  prioritizeUnlocks: boolean;
  avoidTooManyProg: boolean;
};

export const DEFAULT_CS_PREFS: CsPrefs = {
  csCount: 3,
  pacing: "balanced",
  focus: "none",
  maxHeavy: 2,
  prioritizeUnlocks: true,
  avoidTooManyProg: true,
};
