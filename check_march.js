const { PrismaClient } = require('@prisma/client');
const { startOfMonth, endOfMonth } = require('date-fns');

const prisma = new PrismaClient();

async function checkMarch() {
  const user = await prisma.user.findUnique({
    where: { email: 'dossan.7.santos@gmail.com' }
  });

  const marchStart = startOfMonth(new Date(2026, 2, 1));
  const marchEnd = endOfMonth(new Date(2026, 2, 1));

  const items = await prisma.creditCardItem.findMany({
    where: {
      userId: user.id,
      purchaseDate: {
        gte: marchStart,
        lte: marchEnd
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`Total items in March: ${items.length}`);
  items.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.description} | ${item.paidInstallments}/${item.installments} | R$ ${item.installmentValue.toFixed(2)}`);
  });

  await prisma.$disconnect();
}

checkMarch();
