import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { Router, type Request, type Response } from "express";

import { prisma } from "../db/prisma.js";
import {
  clearSessionCookie,
  createSessionToken,
  getSessionUser,
  hashPassword,
  setSessionCookie,
  toPublicUserState,
} from "../auth/session.js";

type SignupRequestBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

type StateRequestBody = {
  completedIds?: unknown;
  prefs?: unknown;
  latestSchedule?: unknown;
};

type ErrorPayload = {
  error: {
    code: "BAD_REQUEST" | "UNAUTHORIZED" | "EMAIL_TAKEN";
    message: string;
    details?: unknown | null;
  };
};

const router = Router();

function sendError(
  res: Response,
  status: number,
  code: ErrorPayload["error"]["code"],
  message: string,
  details?: unknown
) {
  return res.status(status).json({
    error: { code, message, details: details ?? null },
  });
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email) return null;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return isValid ? email : null;
}

function normalizeName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.trim();
  if (!name) return null;
  return name.length <= 120 ? name : null;
}

function normalizePassword(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (value.length < 8 || value.length > 128) return null;
  return value;
}

function normalizeCompletedIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const completedIds = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return [...new Set(completedIds)];
}

router.post(
  "/auth/signup",
  async (
    req: Request<unknown, unknown, SignupRequestBody>,
    res: Response
  ) => {
    const email = normalizeEmail(req.body?.email);
    const password = normalizePassword(req.body?.password);
    const name =
      req.body?.name === undefined ? null : normalizeName(req.body?.name);

    if (!email) {
      return sendError(res, 400, "BAD_REQUEST", "A valid email is required");
    }

    if (!password) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "Password must be between 8 and 128 characters"
      );
    }

    if (req.body?.name !== undefined && name === null) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "Name must be 1-120 characters if provided"
      );
    }

    const existingUser = await prisma.userState.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return sendError(
        res,
        409,
        "EMAIL_TAKEN",
        "An account already exists for that email"
      );
    }

    const session = createSessionToken();
    const user = await prisma.userState.create({
      data: {
        clientId: crypto.randomUUID(),
        name,
        email,
        passwordHash: hashPassword(password),
        sessionTokenHash: session.hash,
        completedIds: [],
        prefs: {},
      },
    });

    setSessionCookie(res, session.token);
    return res.status(201).json({ user: toPublicUserState(user) });
  }
);

router.get("/auth/session", async (req, res) => {
  const user = await getSessionUser(req);
  return res.json({ user: user ? toPublicUserState(user) : null });
});

router.post("/auth/logout", async (req, res) => {
  const user = await getSessionUser(req);

  if (user) {
    await prisma.userState.update({
      where: { id: user.id },
      data: { sessionTokenHash: null },
    });
  }

  clearSessionCookie(res);
  return res.status(204).send();
});

router.get("/state", async (req, res) => {
  const user = await getSessionUser(req);
  if (!user) {
    return sendError(res, 401, "UNAUTHORIZED", "Sign in to view saved state");
  }

  return res.json({ user: toPublicUserState(user) });
});

router.put(
  "/state",
  async (
    req: Request<unknown, unknown, StateRequestBody>,
    res: Response
  ) => {
    const user = await getSessionUser(req);
    if (!user) {
      return sendError(res, 401, "UNAUTHORIZED", "Sign in to save your state");
    }

    const data: Prisma.UserStateUpdateInput = {};

    if (req.body?.completedIds !== undefined) {
      const completedIds = normalizeCompletedIds(req.body.completedIds);
      if (completedIds === null) {
        return sendError(
          res,
          400,
          "BAD_REQUEST",
          "completedIds must be an array of course ids"
        );
      }
      data.completedIds = completedIds;
    }

    if (req.body?.prefs !== undefined) {
      if (
        !req.body.prefs ||
        typeof req.body.prefs !== "object" ||
        Array.isArray(req.body.prefs)
      ) {
        return sendError(
          res,
          400,
          "BAD_REQUEST",
          "prefs must be a JSON object"
        );
      }
      data.prefs = req.body.prefs as Prisma.InputJsonObject;
    }

    if (req.body?.latestSchedule !== undefined) {
      if (
        req.body.latestSchedule !== null &&
        (!req.body.latestSchedule ||
          typeof req.body.latestSchedule !== "object" ||
          Array.isArray(req.body.latestSchedule))
      ) {
        return sendError(
          res,
          400,
          "BAD_REQUEST",
          "latestSchedule must be a JSON object or null"
        );
      }
      data.latestSchedule =
        req.body.latestSchedule === null
          ? Prisma.JsonNull
          : (req.body.latestSchedule as Prisma.InputJsonObject);
    }

    const updatedUser = await prisma.userState.update({
      where: { id: user.id },
      data,
    });

    return res.json({ user: toPublicUserState(updatedUser) });
  }
);

export default router;
