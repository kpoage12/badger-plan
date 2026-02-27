import courses from "../data/data";
import type { CsCourse } from "../../../shared/types/course";
import type { CsPrefs } from "../../../shared/types/preferences";
import { DEFAULT_CS_PREFS } from "../../../shared/types/preferences";

export const COMPLETED_STORAGE_KEY = "badgerplan.completedCourses";
export const PREFS_STORAGE_KEY = "badgerplan.csPrefs.v1";

export type SessionUser = {
  id: string;
  clientId: string;
  name: string | null;
  email: string | null;
  completedIds: string[];
  prefs: unknown;
  latestSchedule: unknown;
  createdAt: string;
  updatedAt: string;
};

type SessionResponse = {
  user: SessionUser | null;
};

type SignupPayload = {
  name?: string;
  email: string;
  password: string;
};

type SigninPayload = {
  email: string;
  password: string;
};

function isPrefs(value: unknown): value is CsPrefs {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prefs = value as Record<string, unknown>;
  return (
    (prefs.csCount === 2 || prefs.csCount === 3 || prefs.csCount === 4) &&
    (prefs.pacing === "light" ||
      prefs.pacing === "balanced" ||
      prefs.pacing === "intense") &&
    (prefs.focus === "systems" ||
      prefs.focus === "theory" ||
      prefs.focus === "ai_ml" ||
      prefs.focus === "software" ||
      prefs.focus === "none") &&
    (prefs.maxHeavy === 1 || prefs.maxHeavy === 2 || prefs.maxHeavy === 3) &&
    typeof prefs.prioritizeUnlocks === "boolean" &&
    typeof prefs.avoidTooManyProg === "boolean"
  );
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const error = (payload as { error?: { message?: unknown } }).error;
  return typeof error?.message === "string" ? error.message : fallback;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const response = await fetch(`${API_BASE}/api/auth/session`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load session");
  }

  const payload = await readJson<SessionResponse>(response);
  return payload.user;
}

export async function signUp(payload: SignupPayload): Promise<SessionUser> {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const response = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readJson<SessionResponse | { error?: { message?: string } }>(
    response
  );

  if (!response.ok || !("user" in data) || !data.user) {
    throw new Error(getErrorMessage(data, "Failed to sign up"));
  }

  return data.user;
}

export async function signIn(payload: SigninPayload): Promise<SessionUser> {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const response = await fetch(`${API_BASE}/api/auth/signin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readJson<SessionResponse | { error?: { message?: string } }>(
    response
  );

  if (!response.ok || !("user" in data) || !data.user) {
    throw new Error(getErrorMessage(data, "Failed to sign in"));
  }

  return data.user;
}

export async function logOut(): Promise<void> {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const response = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }
}

export function persistUserState(user: SessionUser): void {
  const courseMap = new Map<string, CsCourse>();
  (courses as CsCourse[]).forEach((course) => {
    courseMap.set(course.id, course);
  });

  const completedCourses = user.completedIds
    .map((courseId) => courseMap.get(courseId))
    .filter((course): course is CsCourse => Boolean(course));

  try {
    localStorage.setItem(
      COMPLETED_STORAGE_KEY,
      JSON.stringify(completedCourses)
    );

    localStorage.setItem(
      PREFS_STORAGE_KEY,
      JSON.stringify(isPrefs(user.prefs) ? user.prefs : DEFAULT_CS_PREFS)
    );
  } catch {
    // Ignore localStorage write failures.
  }
}

export function clearPersistedUserState(): void {
  try {
    localStorage.removeItem(COMPLETED_STORAGE_KEY);
    localStorage.removeItem(PREFS_STORAGE_KEY);
  } catch {
    // Ignore localStorage write failures.
  }
}
