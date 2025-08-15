-- CreateTable
CREATE TABLE "public"."generetedReadme" (
    "id" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generetedReadme_pkey" PRIMARY KEY ("id")
);
