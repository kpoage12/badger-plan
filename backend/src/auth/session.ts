import crypto from "crypto";
import type { UserState } from "@prisma/client";
import type { Request, Response } from "express";

import { prisma } from "../db/prisma.js";

const SESSION_COOKIE = "badgerplan_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function readCookie(
  req: Pick<Request, "headers">,
  name: string
): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;

  const cookies = raw.split(";");
  for (const entry of cookies) {
    const [cookieName, ...rest] = entry.trim().split("=");
    if (cookieName !== name) continue;
    const value = rest.join("=");
    return value ? decodeURIComponent(value) : null;
  }

  return null;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const [salt, expected] = passwordHash.split(":");
  if (!salt || !expected) return false;

  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

export function createSessionToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("hex");
  return { token, hash: hashSessionToken(token) };
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getSessionUser(
  req: Pick<Request, "headers">
): Promise<UserState | null> {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return null;

  return prisma.userState.findUnique({
    where: { sessionTokenHash: hashSessionToken(token) },
  });
}

export function toPublicUserState(user: UserState) {
  const {
    passwordHash: _passwordHash,
    sessionTokenHash: _sessionTokenHash,
    ...publicState
  } = user;

  return publicState;
}
