/*
  Warnings:

  - A unique constraint covering the columns `[name,pageId]` on the table `Metric` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Metric_name_pageId_key" ON "Metric"("name", "pageId");
