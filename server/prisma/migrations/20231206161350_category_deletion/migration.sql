-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoriesOnDocuments" (
    "documentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    PRIMARY KEY ("documentId", "categoryId"),
    CONSTRAINT "CategoriesOnDocuments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CategoriesOnDocuments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CategoriesOnDocuments" ("categoryId", "documentId") SELECT "categoryId", "documentId" FROM "CategoriesOnDocuments";
DROP TABLE "CategoriesOnDocuments";
ALTER TABLE "new_CategoriesOnDocuments" RENAME TO "CategoriesOnDocuments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
