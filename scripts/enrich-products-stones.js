// scripts/enrich-products-stones.js

const fs = require('fs');
const path = require('path');

// Charger le JSON
const jsonPath = path.join(__dirname, '../lib/data/products-ultimate.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📦 ${products.length} produits chargés`);

// Liste des pierres avec leurs mots-clés
const STONES_KEYWORDS = {
  'améthyste': ['améthyste', 'amethyste', 'amethyst'],
  'turquoise': ['turquoise'],
  'corail': ['corail'],
  'lapis-lazuli': ['lapis-lazuli', 'lapis lazuli', 'lapislazuli'],
  'onyx': ['onyx'],
  'jade': ['jade'],
  'grenat': ['grenat'],
  'perle': ['perle'],
  'pierre de lune': ['pierre de lune', 'pierre-de-lune'],
  'quartz': ['quartz'],
  'agate': ['agate'],
  'jaspe': ['jaspe'],
  'obsidienne': ['obsidienne', 'obsidian'],
  'labradorite': ['labradorite'],
  'œil de tigre': ['oeil de tigre', 'œil de tigre', 'oeil-de-tigre'],
  'cristal': ['cristal'],
  'malachite': ['malachite'],
  'howlite': ['howlite'],
  'amazonite': ['amazonite'],
  'aventurine': ['aventurine'],
  'calcédoine': ['calcedoine', 'calcédoine'],
  'citrine': ['citrine'],
  'rhodonite': ['rhodonite'],
  'sodalite': ['sodalite'],
  'topaze': ['topaze'],
  'tourmaline': ['tourmaline'],
};

// Fonction pour normaliser une string
const normalize = (str) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Fonction pour trouver les pierres dans un nom (MOTS ENTIERS)
const findStones = (name) => {
  if (!name) return [];
  
  const normalizedName = normalize(name);
  const foundStones = [];

  for (const [stone, keywords] of Object.entries(STONES_KEYWORDS)) {
    for (const keyword of keywords) {
      const normalizedKeyword = normalize(keyword);
      // Regex pour mot entier (pas sous-chaîne)
      const regex = new RegExp(`\\b${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(normalizedName)) {
        foundStones.push(stone);
        break; // Une seule fois par pierre
      }
    }
  }

  return foundStones;
};

// Enrichir chaque produit
const enrichedProducts = products.map(product => {
  const stones = findStones(product.name || '');
  return {
    ...product,
    stones: stones,
  };
});

// Dédoublonner par slug
const seen = new Set();
const uniqueProducts = enrichedProducts.filter(product => {
  const key = product.slug || product.name;
  if (seen.has(key)) {
    console.log(`🔄 Doublon supprimé: ${key}`);
    return false;
  }
  seen.add(key);
  return true;
});

console.log(`✅ ${uniqueProducts.length} produits uniques (${enrichedProducts.length - uniqueProducts.length} doublons supprimés)`);

// Compter les pierres
const stoneCounts = {};
uniqueProducts.forEach(p => {
  if (p.stones && Array.isArray(p.stones)) {
    p.stones.forEach(s => {
      stoneCounts[s] = (stoneCounts[s] || 0) + 1;
    });
  }
});

console.log('\n📊 Comptage par pierre:');
Object.entries(stoneCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([stone, count]) => {
    console.log(`   ${stone}: ${count}`);
  });

// Sauvegarder
fs.writeFileSync(jsonPath, JSON.stringify(uniqueProducts, null, 2), 'utf8');
console.log(`\n💾 Sauvegardé: ${jsonPath}`);




