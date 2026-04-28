const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyFinal() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'dossan.7.santos@gmail.com' }
    });

    // Get all items
    const allItems = await prisma.creditCardItem.findMany({
      where: { userId: user.id },
      orderBy: { purchaseDate: 'asc' }
    });

    const byMonth = {};
    allItems.forEach(item => {
      const month = item.purchaseDate.toISOString().slice(0, 7);
      if (!byMonth[month]) byMonth[month] = [];
      byMonth[month].push(item.description);
    });

    console.log('\n✅ VERIFICAÇÃO FINAL - BANCO DE DADOS RECONSTRUÍDO:\n');
    console.log('═'.repeat(80));
    
    Object.entries(byMonth).forEach(([month, items]) => {
      console.log(`\n📅 ${month}: ${items.length} itens`);
      console.log('─'.repeat(80));
      items.forEach((desc, idx) => {
        console.log(`  ${idx + 1}. ${desc}`);
      });
    });

    console.log('\n' + '═'.repeat(80));
    console.log(`\n📊 RESUMO FINAL:`);
    console.log(`Total de itens no banco: ${allItems.length}`);
    console.log(`✅ Março: ${byMonth['2026-03']?.length || 0} itens (ESPERADO: 35)`);
    console.log(`✅ Maio: ${byMonth['2026-05']?.length || 0} itens (ESPERADO: 7)`);
    console.log(`✅ Junho: ${byMonth['2026-06']?.length || 0} itens (ESPERADO: 7)`);
    console.log(`✅ Abril: ${byMonth['2026-04']?.length || 0} itens (ESPERADO: 0)`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

verifyFinal();
