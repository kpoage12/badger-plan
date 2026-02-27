import type { UserState } from "@prisma/client";
import type { Request, Response } from "express";
export declare function hashPassword(password: string): string;
export declare function verifyPassword(password: string, passwordHash: string): boolean;
export declare function createSessionToken(): {
    token: string;
    hash: string;
};
export declare function setSessionCookie(res: Response, token: string): void;
export declare function clearSessionCookie(res: Response): void;
export declare function getSessionUser(req: Pick<Request, "headers">): Promise<UserState | null>;
export declare function toPublicUserState(user: UserState): {
    name: string | null;
    id: string;
    clientId: string;
    email: string | null;
    completedIds: string[];
    prefs: import("@prisma/client/runtime/client").JsonValue;
    latestSchedule: import("@prisma/client/runtime/client").JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
};
//# sourceMappingURL=session.d.ts.map