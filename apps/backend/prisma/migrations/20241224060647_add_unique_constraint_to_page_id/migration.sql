/*
  Warnings:

  - A unique constraint covering the columns `[pageId]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Page_pageId_key" ON "Page"("pageId");
