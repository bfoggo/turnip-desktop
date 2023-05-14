/*
  Warnings:

  - You are about to drop the `NPC` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PC` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NPC";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PC";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Character" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "characterTypeId" INTEGER NOT NULL,
    "initiative" INTEGER,
    "isActive" BOOLEAN NOT NULL,
    "turnAvailable" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Character_CampaignId" ON "Character"("campaignId");

-- CreateIndex
CREATE INDEX "Character_CharacterTypeId" ON "Character"("characterTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_campaignId_key" ON "Character"("name", "campaignId");
