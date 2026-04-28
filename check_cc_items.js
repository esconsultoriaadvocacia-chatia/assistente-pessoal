const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCCItems() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    // Count items by month
    const items = await prisma.creditCardItem.findMany({
      where: { userId: user.id },
      select: { purchaseDate: true, description: true, installments: true, installmentValue: true },
      orderBy: { purchaseDate: 'desc' },
      take: 30
    });

    console.log(`Total items: ${items.length}\n`);
    
    const groupedByMonth = {};
    items.forEach(item => {
      const month = item.purchaseDate.toISOString().slice(0, 7);
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = [];
      }
      groupedByMonth[month].push(`${item.description} (${item.installments}x)`);
    });

    Object.entries(groupedByMonth).forEach(([month, items]) => {
      console.log(`${month}: ${items.length} items`);
      items.slice(0, 5).forEach(desc => {
        console.log(`  - ${desc}`);
      });
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkCCItems();
