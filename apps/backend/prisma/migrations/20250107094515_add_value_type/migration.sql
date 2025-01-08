/*
  Warnings:

  - Added the required column `valueType` to the `Metric` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ValueType" AS ENUM ('LIFETIME', 'DAILY');

-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "valueType" "ValueType" NOT NULL;
