const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDistribution() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    // Get all credit card items grouped by month
    const items = await prisma.creditCardItem.findMany({
      where: { userId: user.id },
      orderBy: { purchaseDate: 'asc' },
      select: { purchaseDate: true, description: true }
    });

    const groupedByMonth = {};
    items.forEach(item => {
      const month = item.purchaseDate.toISOString().slice(0, 7);
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = [];
      }
      groupedByMonth[month].push(item.description);
    });

    console.log('\n📊 DISTRIBUIÇÃO DE ITENS POR MÊS:\n');
    Object.entries(groupedByMonth).forEach(([month, items]) => {
      console.log(`${month}: ${items.length} itens`);
      console.log('─'.repeat(50));
      items.forEach((desc, idx) => {
        console.log(`  ${idx + 1}. ${desc}`);
      });
      console.log('');
    });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkDistribution();
