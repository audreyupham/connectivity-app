-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_contactId_fkey";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
