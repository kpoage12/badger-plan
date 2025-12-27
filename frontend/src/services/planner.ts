import type { CsCourse } from "../types/course";
import type { CsPrefs } from "../types/preferences";
import type { GeneratedSchedule } from "../types/schedule";
import { generateSchedule } from "../planner/generateSchedule";

export async function getSchedule(
  catalog: CsCourse[],
  completedIds: string[],
  prefs: CsPrefs
): Promise<GeneratedSchedule> {
  return generateSchedule(catalog, completedIds, prefs);
}