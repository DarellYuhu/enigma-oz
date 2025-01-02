/*
  Warnings:

  - You are about to drop the column `values` on the `DemographicValues` table. All the data in the column will be lost.
  - Added the required column `value` to the `DemographicValues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DemographicValues" DROP COLUMN "values",
ADD COLUMN     "value" JSONB NOT NULL;
