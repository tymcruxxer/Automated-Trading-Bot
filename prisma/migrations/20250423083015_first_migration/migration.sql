-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_configs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL,
    "currencyPair" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bot_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trade_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currencyPair" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trade_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bot_status" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bot_status_userId_key" ON "bot_status"("userId");

-- AddForeignKey
ALTER TABLE "bot_configs" ADD CONSTRAINT "bot_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_logs" ADD CONSTRAINT "trade_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bot_status" ADD CONSTRAINT "bot_status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
