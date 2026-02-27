ALTER TABLE "UserState"
ADD COLUMN "name" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "passwordHash" TEXT,
ADD COLUMN "sessionTokenHash" TEXT,
ADD COLUMN "latestSchedule" JSONB;

CREATE UNIQUE INDEX "UserState_email_key" ON "UserState"("email");

CREATE UNIQUE INDEX "UserState_sessionTokenHash_key" ON "UserState"("sessionTokenHash");
