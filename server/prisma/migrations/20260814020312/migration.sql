/*
  Warnings:

  - Made the column `text` on table `FollowUp` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FollowUp" ALTER COLUMN "text" SET NOT NULL;
