const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function moveItemsToMarch() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    // Find all items in April created on 2026-04-03 (the ones we need to move)
    const aprilItems = await prisma.creditCardItem.findMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-04-01'),
          lt: new Date('2026-05-01')
        },
        createdAt: {
          gte: new Date('2026-04-03'),
          lt: new Date('2026-04-04')
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${aprilItems.length} items to move from April to March\n`);

    // Delete all these items
    for (const item of aprilItems) {
      await prisma.creditCardItem.delete({
        where: { id: item.id }
      });
    }

    console.log(`Deleted ${aprilItems.length} items from April\n`);

    // Now insert them in March with the correct date
    const marchDate = new Date('2026-03-01T00:00:00Z');
    let insertedCount = 0;

    for (const item of aprilItems) {
      const newItem = await prisma.creditCardItem.create({
        data: {
          description: item.description,
          category: item.category,
          utility: item.utility,
          totalAmount: item.totalAmount,
          installments: item.installments,
          paidInstallments: item.paidInstallments,
          installmentValue: item.installmentValue,
          remainingBalance: item.remainingBalance,
          cardName: item.cardName,
          purchaseDate: marchDate,
          userId: user.id
        }
      });
      insertedCount++;
      console.log(`${insertedCount}. Inserted: ${newItem.description}`);
    }

    console.log(`\n✅ Successfully moved ${insertedCount} items to March!`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

moveItemsToMarch();
