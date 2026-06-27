/*
  Warnings:

  - You are about to drop the column `email` on the `Preorder` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Preorder` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `Preorder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Preorder` table. All the data in the column will be lost.
  - Added the required column `startsAt` to the `Preorder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preorder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "products" INTEGER NOT NULL DEFAULT 1,
    "preorderWhen" TEXT NOT NULL DEFAULT 'regardless-of-stock',
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Preorder" ("createdAt", "id", "name", "status", "updatedAt") SELECT "createdAt", "id", "name", "status", "updatedAt" FROM "Preorder";
DROP TABLE "Preorder";
ALTER TABLE "new_Preorder" RENAME TO "Preorder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
