import { generateSchedule } from "../planner/generateSchedule";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { CsPrefs } from "../types/preferences";
import courses from "../data/data";
import { DEFAULT_CS_PREFS } from "../types/preferences";
import type { CsCourse } from "../types/course";

function Schedule() {
  const [completed] = useLocalStorage<CsCourse[]>(
    "badgerplan.completedCourses",
    []
  );

  const [prefs] = useLocalStorage<CsPrefs>(
    "badgerplan.csPrefs.v1",
    DEFAULT_CS_PREFS
  );

  return <h1>Schedule</h1>;
}

export default Schedule;
