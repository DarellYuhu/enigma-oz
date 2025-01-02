/*
  Warnings:

  - You are about to drop the column `longLivedToken` on the `Page` table. All the data in the column will be lost.
  - Added the required column `appScopedUserId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageLongLivedToken` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userLongLivedToken` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "longLivedToken",
ADD COLUMN     "appScopedUserId" TEXT NOT NULL,
ADD COLUMN     "pageLongLivedToken" TEXT NOT NULL,
ADD COLUMN     "userLongLivedToken" TEXT NOT NULL;
