-- CreateTable
CREATE TABLE "UserState" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "completedIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prefs" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserState_clientId_key" ON "UserState"("clientId");
