-- CreateTable
CREATE TABLE "public"."FileSession" (
    "id" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FileData" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "FileData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileData_sessionId_idx" ON "public"."FileData"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."FileData" ADD CONSTRAINT "FileData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."FileSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
