/*
  Warnings:

  - Added the required column `type` to the `Metric` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MetricType" AS ENUM ('STATISTIC', 'DEMOGRAPHIC');

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "type" "MetricType" NOT NULL;
