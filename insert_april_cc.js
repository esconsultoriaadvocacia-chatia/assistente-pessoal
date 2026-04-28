const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertAprilCC() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    // 16 items from the new invoice
    const newItems = [
      { description: 'Amazonmktplc*Belmicrοt', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 178.24 },
      { description: 'Applecombill', category: 'Serviços', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 44.90 },
      { description: 'Mp *Melimais', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 9.90 },
      { description: 'Applecombill', category: 'Serviços', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 19.90 },
      { description: 'Mercado*Mercadolivre', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 146.02 },
      { description: 'Mlp *Kabum-3green', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 794.93 },
      { description: 'Tkt Aereo *G3*Itkpo', category: 'Viagem', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 191.71 },
      { description: 'Skyteam Consolidadora', category: 'Viagem', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 277.67 },
      { description: 'Tkt Aereo *JJ*Dmamkb', category: 'Viagem', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 154.34 },
      { description: 'Ifd*Shalana G. Demique', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 3, installmentValue: 22.90 },
      { description: 'Asaas *Chatcenter', category: 'Serviços', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 179.90 },
      { description: 'Mercadolivre*Mercadol', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 89.90 },
      { description: 'Mercadolivre*Mercadol', category: 'Compras', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 22.99 },
      { description: 'T e', category: 'Serviços', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 286.00 },
      { description: 'Abacus.Ai', category: 'Serviços', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 54.17 },
      { description: 'Ifd*Food Dk', category: 'Alimentação', utility: 'NECESSARIO', paidInstallments: 1, totalInstallments: 1, installmentValue: 103.21 }
    ];

    const aprilDate = new Date('2026-04-01T00:00:00Z');

    console.log(`\n➕ Inserindo ${newItems.length} itens de Abril (Abril + parcelas subsequentes)...\n`);

    let createdCount = 0;

    for (const item of newItems) {
      const totalAmount = item.installmentValue * item.totalInstallments;
      const remainingBalance = item.installmentValue * (item.totalInstallments - item.paidInstallments);

      // Insert for April
      await prisma.creditCardItem.create({
        data: {
          description: item.description,
          category: item.category,
          utility: item.utility,
          totalAmount,
          installments: item.totalInstallments,
          paidInstallments: item.paidInstallments,
          installmentValue: item.installmentValue,
          remainingBalance,
          cardName: 'Principal',
          purchaseDate: aprilDate,
          userId: user.id
        }
      });
      createdCount++;
      console.log(`   ✅ ${createdCount}/${newItems.length} - ${item.description} (1/${item.totalInstallments}) em Abril`);

      // Create additional entries for subsequent months if parcelado (totalInstallments > 1)
      if (item.totalInstallments > 1) {
        for (let parcelIdx = 2; parcelIdx <= item.totalInstallments; parcelIdx++) {
          // Calculate month for this installment (April = 0, May = 1, etc)
          const monthOffset = parcelIdx - 1;
          const nextMonth = new Date(2026, 3 + monthOffset, 1, 0, 0, 0, 0);

          await prisma.creditCardItem.create({
            data: {
              description: item.description,
              category: item.category,
              utility: item.utility,
              totalAmount,
              installments: item.totalInstallments,
              paidInstallments: 0, // Not paid yet in subsequent months
              installmentValue: item.installmentValue,
              remainingBalance: item.installmentValue * item.totalInstallments, // Full amount remaining
              cardName: 'Principal',
              purchaseDate: nextMonth,
              userId: user.id
            }
          });
          console.log(`   ✅ ${createdCount}/${newItems.length} - ${item.description} (${parcelIdx}/${item.totalInstallments}) em ${nextMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`);
        }
      }
    }

    // Verify insertion
    const verifyItems = await prisma.creditCardItem.findMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-04-01'),
          lt: new Date('2026-07-01')
        }
      },
      orderBy: [{ purchaseDate: 'asc' }, { createdAt: 'asc' }]
    });

    console.log(`\n📊 Total de lançamentos em Abril-Junho: ${verifyItems.length}`);

    // Group by month
    const byMonth = {};
    verifyItems.forEach(item => {
      const monthKey = item.purchaseDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      if (!byMonth[monthKey]) byMonth[monthKey] = [];
      byMonth[monthKey].push(item.description);
    });

    Object.entries(byMonth).forEach(([month, items]) => {
      console.log(`\n   ${month}: ${items.length} itens`);
      items.forEach((desc, idx) => {
        console.log(`      ${idx + 1}. ${desc}`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

insertAprilCC();
