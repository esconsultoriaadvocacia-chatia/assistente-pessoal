const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function rebuildMarchItems() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    if (!user) {
      console.error('User not found');
      process.exit(1);
    }

    // 1. Delete all items from March, May, and June
    const deleteMarch = await prisma.creditCardItem.deleteMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-03-01'),
          lt: new Date('2026-04-01')
        }
      }
    });

    const deleteMay = await prisma.creditCardItem.deleteMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-05-01'),
          lt: new Date('2026-06-01')
        }
      }
    });

    const deleteJune = await prisma.creditCardItem.deleteMany({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-06-01'),
          lt: new Date('2026-07-01')
        }
      }
    });

    console.log(`✅ Deleted ${deleteMarch.count} items from March`);
    console.log(`✅ Deleted ${deleteMay.count} items from May`);
    console.log(`✅ Deleted ${deleteJune.count} items from June\n`);

    // 2. Insert the 35 correct items for March
    const marchDate = new Date('2026-03-01T00:00:00Z');
    const mayDate = new Date('2026-05-01T00:00:00Z');
    const juneDate = new Date('2026-06-01T00:00:00Z');

    // All 35 items data
    const items = [
      // Part 1: Original 11 items
      { desc: 'Ren*J D Despachante', cat: 'Serviços', util: 'NECESSARIO', val: 1000.47, paid: 4, total: 6 },
      { desc: 'Zp *Ks Bitencourt', cat: 'Compras', util: 'NECESSARIO', val: 532.42, paid: 2, total: 2 },
      { desc: 'Mistura Urbana - Filia', cat: 'Compras', util: 'NECESSARIO', val: 79.90, paid: 2, total: 2 },
      { desc: 'Mercadolivre*3produto', cat: 'Compras', util: 'NECESSARIO', val: 101.96, paid: 3, total: 5 },
      { desc: 'Mercadolivre*3produto', cat: 'Compras', util: 'NECESSARIO', val: 60.78, paid: 3, total: 3 },
      { desc: 'Zp *Ks Bitencourt', cat: 'Compras', util: 'NECESSARIO', val: 573.54, paid: 3, total: 3 },
      { desc: 'Mercado*Mercadolivre', cat: 'Compras', util: 'NECESSARIO', val: 59.30, paid: 2, total: 3 },
      { desc: 'Agro Recanto Xiru', cat: 'Compras', util: 'NECESSARIO', val: 109.95, paid: 2, total: 2 },
      { desc: 'Mercadolivre*13produt', cat: 'Compras', util: 'NECESSARIO', val: 284.91, paid: 3, total: 5 },
      { desc: 'Gremio Nautico Gaucho', cat: 'Compras', util: 'NECESSARIO', val: 290.00, paid: 2, total: 2 },
      { desc: 'Jusbrasil', cat: 'Serviços', util: 'NECESSARIO', val: 148.90, paid: 1, total: 1 },
      // Part 2: 16 invoice items
      { desc: 'Amazonmktplc*Belmicrοt', cat: 'Compras', util: 'NECESSARIO', val: 178.24, paid: 1, total: 3 },
      { desc: 'Applecombill', cat: 'Serviços', util: 'NECESSARIO', val: 44.90, paid: 1, total: 1 },
      { desc: 'Mp *Melimais', cat: 'Compras', util: 'NECESSARIO', val: 9.90, paid: 1, total: 1 },
      { desc: 'Applecombill', cat: 'Serviços', util: 'NECESSARIO', val: 19.90, paid: 1, total: 1 },
      { desc: 'Mercado*Mercadolivre', cat: 'Compras', util: 'NECESSARIO', val: 146.02, paid: 1, total: 3 },
      { desc: 'Mlp *Kabum-3green', cat: 'Compras', util: 'NECESSARIO', val: 794.93, paid: 1, total: 3 },
      { desc: 'Tkt Aereo *G3*Itkpo', cat: 'Viagem', util: 'NECESSARIO', val: 191.71, paid: 1, total: 3 },
      { desc: 'Skyteam Consolidadora', cat: 'Viagem', util: 'NECESSARIO', val: 277.67, paid: 1, total: 3 },
      { desc: 'Tkt Aereo *JJ*Dmamkb', cat: 'Viagem', util: 'NECESSARIO', val: 154.34, paid: 1, total: 3 },
      { desc: 'Ifd*Shalana G. Demique', cat: 'Compras', util: 'NECESSARIO', val: 22.90, paid: 1, total: 3 },
      { desc: 'Asaas *Chatcenter', cat: 'Serviços', util: 'NECESSARIO', val: 179.90, paid: 1, total: 1 },
      { desc: 'Mercadolivre*Mercadol', cat: 'Compras', util: 'NECESSARIO', val: 89.90, paid: 1, total: 1 },
      { desc: 'Mercadolivre*Mercadol', cat: 'Compras', util: 'NECESSARIO', val: 22.99, paid: 1, total: 1 },
      { desc: 'T e', cat: 'Serviços', util: 'NECESSARIO', val: 286.00, paid: 1, total: 1 },
      { desc: 'Abacus.Ai', cat: 'Serviços', util: 'NECESSARIO', val: 54.17, paid: 1, total: 1 },
      { desc: 'Ifd*Food Dk', cat: 'Alimentação', util: 'NECESSARIO', val: 103.21, paid: 1, total: 1 },
      // Part 3: 6 additional items
      { desc: 'Pg *Zapsign', cat: 'Serviços', util: 'NECESSARIO', val: 69.90, paid: 1, total: 1 },
      { desc: 'Abacus.Ai', cat: 'Serviços', util: 'NECESSARIO', val: 54.22, paid: 1, total: 1 },
      { desc: 'Ifd*Capitao Bar e Rest', cat: 'Alimentação', util: 'NECESSARIO', val: 36.77, paid: 1, total: 1 },
      { desc: 'Abacus.Ai', cat: 'Serviços', util: 'NECESSARIO', val: 108.45, paid: 1, total: 1 },
      { desc: 'Abacus.Ai', cat: 'Serviços', util: 'NECESSARIO', val: 54.22, paid: 1, total: 1 },
      { desc: 'Abacus.Ai', cat: 'Serviços', util: 'NECESSARIO', val: 54.22, paid: 1, total: 1 },
      // Part 4: 2 new items
      { desc: 'Ifood', cat: 'Alimentação', util: 'NECESSARIO', val: 46.87, paid: 1, total: 1 },
      { desc: 'Abacus.Ai', cat: 'Serviços', util: 'NECESSARIO', val: 162.00, paid: 1, total: 1 }
    ];

    console.log('📝 Inserting 35 items into March...\n');

    const createdItems = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const totalAmount = item.val * item.total;
      const remainingBalance = item.val * (item.total - item.paid);

      const created = await prisma.creditCardItem.create({
        data: {
          description: item.desc,
          category: item.cat,
          utility: item.util,
          totalAmount: totalAmount,
          installments: item.total,
          paidInstallments: item.paid,
          installmentValue: item.val,
          remainingBalance: remainingBalance,
          cardName: 'Cartão Principal',
          purchaseDate: marchDate,
          userId: user.id
        }
      });

      createdItems.push(created);
      console.log(`${i + 1}. ${item.desc} - Parcela ${item.paid}/${item.total}`);

      // If item has more than 1 installment, create entries for future months
      if (item.total > 1) {
        // Create entries for May (2nd installment)
        if (item.paid === 1) {
          await prisma.creditCardItem.create({
            data: {
              description: `${item.desc} - Parcela 2/${item.total}`,
              category: item.cat,
              utility: item.util,
              totalAmount: item.val,
              installments: item.total,
              paidInstallments: 1,
              installmentValue: item.val,
              remainingBalance: item.val * (item.total - 2),
              cardName: 'Cartão Principal',
              purchaseDate: mayDate,
              userId: user.id
            }
          });

          // Create entries for June (3rd installment) if total > 2
          if (item.total > 2) {
            await prisma.creditCardItem.create({
              data: {
                description: `${item.desc} - Parcela 3/${item.total}`,
                category: item.cat,
                utility: item.util,
                totalAmount: item.val,
                installments: item.total,
                paidInstallments: 2,
                installmentValue: item.val,
                remainingBalance: item.val * (item.total - 3),
                cardName: 'Cartão Principal',
                purchaseDate: juneDate,
                userId: user.id
              }
            });
          }
        }
      }
    }

    console.log(`\n✅ Successfully inserted 35 items into March!`);

    // Count final distribution
    const marchCount = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-03-01'),
          lt: new Date('2026-04-01')
        }
      }
    });

    const mayCount = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-05-01'),
          lt: new Date('2026-06-01')
        }
      }
    });

    const juneCount = await prisma.creditCardItem.count({
      where: {
        userId: user.id,
        purchaseDate: {
          gte: new Date('2026-06-01'),
          lt: new Date('2026-07-01')
        }
      }
    });

    console.log(`\n📊 FINAL DISTRIBUTION:`);
    console.log(`Março 2026: ${marchCount} itens`);
    console.log(`Maio 2026: ${mayCount} itens`);
    console.log(`Junho 2026: ${juneCount} itens`);
    console.log(`Total: ${marchCount + mayCount + juneCount} itens`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

rebuildMarchItems();
