import type { CsPrefs } from "../../../shared/types/preferences";
import type { GeneratedSchedule } from "../../../shared/types/schedule.js";

type ScheduleApiResponse = {
  requestId: string;
  inputHash: string;
  catalogVersion: string;
  generatedAt: string;
  computeMs: number;
  schedule: GeneratedSchedule;
};

export async function getSchedule(
  completedIds: string[],
  prefs: CsPrefs
): Promise<ScheduleApiResponse> {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const result = await fetch(`${API_BASE}/api/schedule`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completedIds, prefs }),
  });

  if (!result.ok) {
    const errText = await result.text();
    throw new Error(errText);
  }

  return (await result.json()) as ScheduleApiResponse;
}
