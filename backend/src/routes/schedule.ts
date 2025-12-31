import { Router, type Request, type Response } from "express";
import crypto from "crypto";

import courses from "../data/data.js";
import { generateSchedule } from "../planner/generateSchedule.js";

import type { CourseId, CsCourse, Pacing, Focus } from "../../../shared/types/course.js";
import type { CsPrefs } from "../../../shared/types/preferences.js";
import type { GeneratedSchedule } from "../../../shared/types/schedule.js";

type ScheduleRequestBody = {
  completedIds?: unknown;
  prefs?: unknown;
  clientId?: unknown;
};

type ErrorPayload = {
  error: {
    code: "BAD_REQUEST" | "SCHEDULE_FAILED";
    message: string;
    details?: unknown | null;
    requestId?: string;
  };
};

type ScheduleResponsePayload = {
  requestId: string;
  inputHash: string;
  catalogVersion: string;
  generatedAt: string;
  computeMs: number;
  schedule: GeneratedSchedule;
};

const router = Router();

function badRequest(
  res: Response<ScheduleResponsePayload | ErrorPayload>,
  message: string,
  details?: unknown
) {
  return res.status(400).json({
    error: { code: "BAD_REQUEST", message, details: details ?? null },
  });
}

function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const record = obj as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys
    .map((k) => JSON.stringify(k) + ":" + stableStringify(record[k]))
    .join(",")}}`;
}


function isCourseId(x: unknown): x is CourseId {
  return typeof x === "string" && x.trim().length > 0;
}

function isPacing(x: unknown): x is Pacing {
  return x === "light" || x === "balanced" || x === "intense";
}

function isFocus(x: unknown): x is Focus {
  return x === "systems" || x === "theory" || x === "ai_ml" || x === "software" || x === "none";
}

function isCsCount(x: unknown): x is CsPrefs["csCount"] {
  return x === 2 || x === 3 || x === 4;
}

function isMaxHeavy(x: unknown): x is CsPrefs["maxHeavy"] {
  return x === 1 || x === 2 || x === 3;
}

function isCsPrefs(x: unknown): x is CsPrefs {
  if (!x || typeof x !== "object" || Array.isArray(x)) return false;
  const o = x as Record<string, unknown>;

  return (
    isCsCount(o.csCount) &&
    isPacing(o.pacing) &&
    isFocus(o.focus) &&
    isMaxHeavy(o.maxHeavy) &&
    typeof o.prioritizeUnlocks === "boolean" &&
    typeof o.avoidTooManyProg === "boolean"
  );
}

router.post(
  "/schedule",
  (
    req: Request<unknown, unknown, ScheduleRequestBody>,
    res: Response<ScheduleResponsePayload | ErrorPayload>
  ) => {
    const headerVal = req.headers["x-request-id"];
    const requestId =
      typeof headerVal === "string" && headerVal.length > 0
        ? headerVal
        : crypto.randomUUID();
    res.setHeader("x-request-id", requestId);

    const t0 = Date.now();
    const { completedIds, prefs, clientId } = req.body ?? {};

    if (!Array.isArray(completedIds)) {
      return badRequest(res, "completedIds must be an array of course IDs");
    }
    if (completedIds.length > 500) {
      return badRequest(res, "completedIds is too large", { max: 500 });
    }
    const normalizedCompleted: CourseId[] = [
      ...new Set(
        completedIds
          .filter(isCourseId)
          .map((id) => id.trim() as CourseId)
          .filter(Boolean)
      ),
    ];

    if (!isCsPrefs(prefs)) {
      return badRequest(res, "prefs must be a valid CsPrefs object", {
        required: [
          "csCount (2|3|4)",
          "pacing (light|balanced|intense)",
          "focus (systems|theory|ai_ml|software|none)",
          "maxHeavy (1|2|3)",
          "prioritizeUnlocks (boolean)",
          "avoidTooManyProg (boolean)",
        ],
      });
    }

    if (
      clientId != null &&
      (typeof clientId !== "string" || clientId.length < 8 || clientId.length > 128)
    ) {
      return badRequest(res, "clientId must be a string (8-128 chars) if provided");
    }

    const typedClientId = typeof clientId === "string" ? clientId : null;

    const catalogVersion = "v1";
    const inputHash = crypto
      .createHash("sha256")
      .update(
        stableStringify({
          clientId: typedClientId,
          completedIds: normalizedCompleted,
          prefs,
          catalogVersion,
        })
      )
      .digest("hex");

    try {
      const schedule = generateSchedule(
        courses as CsCourse[],
        normalizedCompleted,
        prefs
      ) as GeneratedSchedule;

      const ms = Date.now() - t0;

      return res.json({
        requestId,
        inputHash,
        catalogVersion,
        generatedAt: new Date().toISOString(),
        computeMs: ms,
        schedule,
      });
    } catch (err: unknown) {
      const e = err as { message?: string; stack?: string };

      console.error(
        JSON.stringify({
          level: "error",
          msg: "Schedule generation failed",
          requestId,
          inputHash,
          err: { message: e?.message, stack: e?.stack },
        })
      );

      return res.status(500).json({
        error: {
          code: "SCHEDULE_FAILED",
          message: "Failed to generate schedule",
          requestId,
        },
      });
    }
  }
);

export default router;
