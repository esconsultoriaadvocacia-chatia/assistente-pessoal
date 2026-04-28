const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAprilItems() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    const items = await prisma.creditCardItem.findMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-04-01'),
          lt: new Date('2026-05-01')
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\nTotal April items: ${items.length}\n`);
    items.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.description}`);
      console.log(`   Category: ${item.category}, Utility: ${item.utility}`);
      console.log(`   Installments: ${item.paidInstallments}/${item.installments}`);
      console.log(`   Value: R$ ${item.installmentValue}`);
      console.log(`   Created: ${item.createdAt.toISOString().slice(0, 10)}`);
      console.log('');
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkAprilItems();
