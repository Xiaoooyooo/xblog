-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("content", "createdAt", "deletedAt", "id", "isDraft", "title", "updatedAt", "userId") SELECT "content", "createdAt", "deletedAt", "id", "isDraft", "title", "updatedAt", "userId" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE UNIQUE INDEX "Document_id_key" ON "Document"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
