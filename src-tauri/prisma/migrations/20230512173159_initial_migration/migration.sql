-- CreateTable
CREATE TABLE "Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CharacterType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PC" (
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

-- CreateTable
CREATE TABLE "NPC" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "initiative" INTEGER,
    "isActive" BOOLEAN NOT NULL,
    "turnAvailable" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_key" ON "Campaign"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterType_name_key" ON "CharacterType"("name");

-- CreateIndex
CREATE INDEX "PC_CampaignId" ON "PC"("campaignId");

-- CreateIndex
CREATE INDEX "PC_CharacterTypeId" ON "PC"("characterTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "PC_name_campaignId_key" ON "PC"("name", "campaignId");

-- CreateIndex
CREATE INDEX "NPC_CampaignId" ON "NPC"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "NPC_name_campaignId_key" ON "NPC"("name", "campaignId");
