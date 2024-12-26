/*
  Warnings:

  - You are about to drop the column `pageId` on the `Page` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Page_pageId_key";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "pageId";
