import type { CsCourse } from "../types/course";
import type { CsPrefs } from "../types/preferences";
import type { GeneratedSchedule } from "../types/schedule";

function prereqsMet(course: CsCourse, completed: Set<string>) {
  if (!course.prereqs || course.prereqs.length === 0) return true;
  return course.prereqs.every((p) => completed.has(p));
}

function isHeavy(c: CsCourse) {
  return c.tags.includes("heavy");
}

export function generateSchedule(
  catalog: CsCourse[],
  completedIds: string[],
  prefs: CsPrefs
): GeneratedSchedule {
  const completed = new Set(completedIds);

  const eligible = catalog.filter(
    (c) => !completed.has(c.id) && prereqsMet(c, completed)
  );

  const heavyCap = prefs.pacing === "light" ? 1 : prefs.pacing === "balanced" ? 2 : 3;

  const scored = eligible.map((c) => {
    let score = 0;

    if (prefs.focus != "none" && c.tags.includes(prefs.focus)) score += 30;

    if (prefs.prioritizeUnlocks) score += (c.unlockValue ?? 0);

    if (prefs.pacing === "light" && isHeavy(c)) score -= 25;
    if (prefs.avoidTooManyProg && c.tags.includes("prog-heavy")) score -= 10;

    score += c.credits;
    return { course: c, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: CsCourse[] = [];
  let heavyCount = 0;

  for (const { course } of scored) {
    if (selected.length >= prefs.csCount) break;

    if (isHeavy(course) && heavyCount >= heavyCap) continue;

    selected.push(course);
    if (isHeavy(course)) heavyCount++;
  }

  const selectedSet = new Set(selected.map((c) => c.id));
  const alternatives = scored
    .map((x) => x.course)
    .filter((c) => !selectedSet.has(c.id));

  const warnings: string[] = [];
  if (selected.length < prefs.csCount) {
    warnings.push("Not enough eligible CS courses to fill your requested CS count.");
  }
  if (heavyCount >= 2 && prefs.pacing === "light") {
    warnings.push("This looks heavy for a 'light' semester—consider lowering intensity or swapping.");
  }

  const estimatedCredits = selected.reduce((sum, c) => sum + c.credits, 0);

  const warningObjs: { code: "NOT_ENOUGH_ELIGIBLE" | "TOO_HEAVY_FOR_PACING"; message: string }[] = [];
  
  if (selected.length < prefs.csCount) {
    warningObjs.push({
      code: "NOT_ENOUGH_ELIGIBLE",
      message: "Not enough eligible CS courses to fill your requested CS count.",
    });
  }
  
  if (heavyCount >= 2 && prefs.pacing === "light") {
    warningObjs.push({
      code: "TOO_HEAVY_FOR_PACING",
      message: "This looks heavy for a 'light' semester—consider lowering intensity or swapping.",
    });
  }
  
  const selectedScheduled = selected.map((c) => ({
    id: c.id,
    reason:
      (prefs.focus !== "none" && c.tags.includes(prefs.focus) ? "Matches focus area. " : "") +
      (prefs.prioritizeUnlocks && (c.unlockValue ?? 0) > 0 ? "Helps unlock future courses. " : "") +
      (c.tags.includes("heavy") ? "Heavier workload." : "Good fit."),
  }));
  
  return {
    selected: selectedScheduled,
    alternatives: alternatives.map((c) => c.id),
    warnings: warningObjs,
    estimatedCredits,
  };
}
