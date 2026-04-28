const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanAndInsert() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    // Delete ALL credit card items for this user (complete cleanup)
    const deleteCount = await prisma.creditCardItem.deleteMany({
      where: { userId: user.id }
    });
    
    console.log(`🗑️  Deletados ${deleteCount.count} itens de cartão de crédito`);

    // Now insert ONLY the 11 items from March
    const newItems = [
      {
        description: 'Ren*J D Despachante',
        category: 'Serviços',
        utility: 'NECESSARIO',
        paidInstallments: 4,
        totalInstallments: 6,
        installmentValue: 1000.47
      },
      {
        description: 'Zp *Ks Bitencourt',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 2,
        totalInstallments: 2,
        installmentValue: 532.42
      },
      {
        description: 'Mistura Urbana - Filia',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 2,
        totalInstallments: 2,
        installmentValue: 79.90
      },
      {
        description: 'Mercadolivre*3produto',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 3,
        totalInstallments: 5,
        installmentValue: 101.96
      },
      {
        description: 'Mercadolivre*3produto',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 3,
        totalInstallments: 3,
        installmentValue: 60.78
      },
      {
        description: 'Zp *Ks Bitencourt',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 3,
        totalInstallments: 3,
        installmentValue: 573.54
      },
      {
        description: 'Mercado*Mercadolivre',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 2,
        totalInstallments: 3,
        installmentValue: 59.30
      },
      {
        description: 'Agro Recanto Xiru',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 2,
        totalInstallments: 2,
        installmentValue: 109.95
      },
      {
        description: 'Mercadolivre*13produt',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 3,
        totalInstallments: 5,
        installmentValue: 284.91
      },
      {
        description: 'Gremio Nautico Gaucho',
        category: 'Compras',
        utility: 'NECESSARIO',
        paidInstallments: 2,
        totalInstallments: 2,
        installmentValue: 290.00
      },
      {
        description: 'Jusbrasil',
        category: 'Serviços',
        utility: 'NECESSARIO',
        paidInstallments: 1,
        totalInstallments: 1,
        installmentValue: 148.90
      }
    ];

    // Set exact date to March 1, 2026
    const marchDate = new Date('2026-03-01T00:00:00Z');

    console.log(`\n➕ Inserindo ${newItems.length} itens de Março...`);

    for (const item of newItems) {
      const totalAmount = item.installmentValue * item.totalInstallments;
      const remainingBalance = item.installmentValue * (item.totalInstallments - item.paidInstallments);

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
          purchaseDate: marchDate,
          userId: user.id
        }
      });
    }

    console.log(`✅ ${newItems.length} itens inseridos com sucesso em MARÇO (01/03/2026)!`);

    // Verification
    const verify = await prisma.creditCardItem.findMany({
      where: { userId: user.id },
      select: {
        description: true,
        purchaseDate: true,
        paidInstallments: true,
        installments: true
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`\n📊 Total de itens no banco: ${verify.length}`);
    console.log(`\n📅 Itens por data:`);
    
    const byDate = {};
    verify.forEach(item => {
      const date = new Date(item.purchaseDate).toLocaleDateString('pt-BR');
      if (!byDate[date]) byDate[date] = [];
      byDate[date].push(item.description);
    });

    Object.entries(byDate).forEach(([date, items]) => {
      console.log(`   ${date}: ${items.length} itens`);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndInsert();
