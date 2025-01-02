/*
  Warnings:

  - A unique constraint covering the columns `[name,pageId]` on the table `Metric` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "DemographicValues" (
    "id" SERIAL NOT NULL,
    "values" JSONB NOT NULL,
    "end_time" TIMESTAMP(3),
    "metricId" TEXT NOT NULL,

    CONSTRAINT "DemographicValues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemographicValues_metricId_end_time_key" ON "DemographicValues"("metricId", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "Metric_name_pageId_key" ON "Metric"("name", "pageId");

-- AddForeignKey
ALTER TABLE "DemographicValues" ADD CONSTRAINT "DemographicValues_metricId_fkey" FOREIGN KEY ("metricId") REFERENCES "Metric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
