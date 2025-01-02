/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Page` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSecret` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longLivedToken` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortLivedToken` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "accessToken",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "clientSecret" TEXT NOT NULL,
ADD COLUMN     "longLivedToken" TEXT NOT NULL,
ADD COLUMN     "shortLivedToken" TEXT NOT NULL;
