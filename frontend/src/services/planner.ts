import type { CsPrefs } from "../../../shared/types/preferences";
import type { GeneratedSchedule } from "../../../shared/types/schedule.js";

export async function getSchedule(
  completedIds: string[],
  prefs: CsPrefs
): Promise<GeneratedSchedule> {
  const API_BASE = import.meta.env.VITE_API_BASE
  const result = await fetch(`${API_BASE}/api/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completedIds, prefs })
  })

  if (!result.ok) {
    const errText = await result.text();  
    throw new Error(errText);
  }
  

  return (await result.json()) as GeneratedSchedule;
}