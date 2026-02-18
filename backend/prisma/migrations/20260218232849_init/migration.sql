-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "prereqs" TEXT[],

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);
