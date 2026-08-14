-- DropForeignKey
ALTER TABLE "FollowUp" DROP CONSTRAINT "FollowUp_contactId_fkey";

-- AddForeignKey
ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
