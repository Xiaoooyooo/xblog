-- AlterTable
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN;

-- CreateTable
CREATE TABLE "UserToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    CONSTRAINT "UserToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_id_key" ON "UserToken"("id");
