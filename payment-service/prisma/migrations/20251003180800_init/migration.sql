-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Completed', 'Blocked');

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "amount" BIGINT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
