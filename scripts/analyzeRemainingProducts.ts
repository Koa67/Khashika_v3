import * as fs from 'fs';

async function analyze() {
  // Charger le rapport
  const report = JSON.parse(fs.readFileSync('produits-correction-manuelle.json', 'utf-8'));
  
  console.log('='.repeat(60));
  console.log(`ANALYSE DES ${report.length} PRODUITS RESTANTS`);
  console.log('='.repeat(60));
  
  // Catégoriser par type de nom
  const categories: Record<string, any[]> = {
    bagues: report.filter((p: any) => /bague/i.test(p.name)),
    boucles: report.filter((p: any) => /boucle|oreille/i.test(p.name)),
    colliers: report.filter((p: any) => /collier|pendentif/i.test(p.name)),
    bracelets: report.filter((p: any) => /bracelet/i.test(p.name)),
    chaines: report.filter((p: any) => /chaine|cheville/i.test(p.name)),
    foulards: report.filter((p: any) => /foulard|etole|pashmina|écharpe/i.test(p.name)),
    sacs: report.filter((p: any) => /sac|pochette|trousse/i.test(p.name)),
    portesCles: report.filter((p: any) => /porte-clé|porte clé/i.test(p.name)),
    pierresInfo: report.filter((p: any) => /^(rubis|saphir|emeraude|grenat|onyx|turquoise|jade|amethyste|topaze|perle|corail|citrine|agate|jaspe|moonstone|labradorite|malachite|peridot|quartz|howlite|apatite|pierre de lune|lapis|aventurine|oeil de tigre)/i.test(p.name)),
    pagesCategorie: report.filter((p: any) => /^(bagues|colliers|bracelets|boucles|pendentifs|chaines|accessoires|bijoux|clous)$/i.test(p.name.trim())),
    autres: [],
  };
  
  // Trouver les "autres"
  const categorized = new Set([
    ...categories.bagues,
    ...categories.boucles,
    ...categories.colliers,
    ...categories.bracelets,
    ...categories.chaines,
    ...categories.foulards,
    ...categories.sacs,
    ...categories.portesCles,
    ...categories.pierresInfo,
    ...categories.pagesCategorie,
  ].map((p: any) => p.id));
  
  categories.autres = report.filter((p: any) => !categorized.has(p.id));
  
  console.log('\n📊 RÉPARTITION:\n');
  Object.entries(categories).forEach(([cat, prods]) => {
    console.log(`${cat.toUpperCase()}: ${prods.length}`);
    if (prods.length <= 15 && prods.length > 0) {
      prods.forEach((p: any) => console.log(`  - ${p.name.substring(0, 60)}`));
    }
  });
  
  // Identifier les pages de catégorie/pierres à potentiellement supprimer
  const nonProducts = [...categories.pierresInfo, ...categories.pagesCategorie];
  console.log(`\n⚠️ ${nonProducts.length} entrées sont des pages info/catégorie (pas de vrais produits)`);
  
  // Vrais produits à corriger
  const realProducts = report.filter((p: any) => !nonProducts.find((np: any) => np.id === p.id));
  console.log(`✅ ${realProducts.length} vrais produits à corriger\n`);
  
  // Sauvegarder l'analyse
  fs.writeFileSync('analyse-produits-restants.json', JSON.stringify({
    total: report.length,
    nonProductsCount: nonProducts.length,
    realProductsCount: realProducts.length,
    categories: Object.fromEntries(
      Object.entries(categories).map(([k, v]) => [k, v.length])
    ),
    nonProducts: nonProducts.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })),
    realProducts: realProducts.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })),
  }, null, 2));
  
  console.log('📄 Analyse sauvegardée: analyse-produits-restants.json');
}

analyze().catch(console.error);





