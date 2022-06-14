-- CreateTable
CREATE TABLE "macro" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "macro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "macroId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "macro_slug_key" ON "macro"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "documentation_slug_key" ON "documentation"("slug");

-- AddForeignKey
ALTER TABLE "documentation" ADD CONSTRAINT "documentation_macroId_fkey" FOREIGN KEY ("macroId") REFERENCES "macro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
