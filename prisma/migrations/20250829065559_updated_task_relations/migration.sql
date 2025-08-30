-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "assigneeId" SET DATA TYPE TEXT;
