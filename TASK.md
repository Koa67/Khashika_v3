cat > TASK.md << 'EOF'
# TASK.md — Corriger Descriptions Corrompues + Enrichir depuis NOM

## 🎯 MISSION
1. Supprimer les descriptions incohérentes (ne correspondent pas au produit)
2. Enrichir les champs `type`, `stones`, `material` depuis le NOM uniquement
3. Corriger les fautes de syntaxe

---

## BRICKMODE HEADER
```
MODE: SCRIPT
ITERATION: 1
LAST VERDICT: N/A (first run)
GOAL: Données propres, filtres fonctionnels
SCOPE: products-ultimate.json
FILES: Script + JSON
CONSTRAINTS: Ne pas créer de faux positifs
ASSUMPTIONS: Nom = fiable, Description = non fiable
TESTS I CAN RUN: node script, pnpm build
DONE WHEN:
  - [ ] Descriptions incohérentes supprimées
  - [ ] Champs enrichis depuis le nom
  - [ ] Filtres fonctionnent correctement
  - [ ] pnpm build OK
```

---

## 🔧 SCRIPT COMPLET

Créer `scripts/fix-and-enrich-products.js`:
```javascript
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../lib/data/products-ultimate.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📦 ${products.length} produits chargés\n`);

// === CONFIGURATION ===

// Types de produits (ordre = priorité)
const PRODUCT_TYPES = {
  'boucles d\'oreilles': ['boucles d\'oreille', 'boucle d\'oreille', 'clous d\'oreille', 'creole', 'créole'],
  'collier': ['collier'],
  'bracelet': ['bracelet'],
  'bague': ['bague', 'anneau'],
  'pendentif': ['pendentif'],
  'chaîne': ['chaine', 'chaîne'],
  'cheville': ['cheville', 'chevilles'],
  'parure': ['parure'],
  'pashmina': ['pashmina'],
  'foulard': ['foulard', 'étole', 'etole'],
  'sac': ['sac', 'pochette'],
};

// Pierres
const STONES = {
  'améthyste': ['améthyste', 'amethyste'],
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
  'obsidienne': ['obsidienne'],
  'labradorite': ['labradorite'],
  'oeil de tigre': ['oeil de tigre', 'œil de tigre', 'oeil-de-tigre'],
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

// Matériaux
const MATERIALS = {
  'argent': ['argent', 'silver'],
  'or': ['or ', ' or', 'doré', 'gold'],
  'laiton': ['laiton', 'brass'],
  'métal': ['metal', 'métal'],
  'cuir': ['cuir', 'leather'],
  'coton': ['coton', 'cotton'],
  'soie': ['soie', 'silk'],
};

// === FONCTIONS ===

const normalize = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, "'");
};

const getTypeFromText = (text) => {
  const normalized = normalize(text);
  for (const [type, keywords] of Object.entries(PRODUCT_TYPES)) {
    for (const kw of keywords) {
      if (normalized.includes(normalize(kw))) {
        return type;
      }
    }
  }
  return null;
};

const getStonesFromText = (text) => {
  const normalized = normalize(text);
  const found = [];
  for (const [stone, keywords] of Object.entries(STONES)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${normalize(kw)}\\b`);
      if (regex.test(normalized)) {
        found.push(stone);
        break;
      }
    }
  }
  return found;
};

const getMaterialFromText = (text) => {
  const normalized = normalize(text);
  for (const [material, keywords] of Object.entries(MATERIALS)) {
    for (const kw of keywords) {
      if (normalized.includes(normalize(kw))) {
        return material;
      }
    }
  }
  return null;
};

const isDescriptionInconsistent = (name, description) => {
  if (!description || !name) return false;
  
  const nameType = getTypeFromText(name);
  const descType = getTypeFromText(description);
  
  // Si les types sont différents, la description est incohérente
  if (nameType && descType && nameType !== descType) {
    return true;
  }
  
  return false;
};

// === TRAITEMENT ===

let stats = {
  descriptionsCleared: 0,
  typesEnriched: 0,
  stonesEnriched: 0,
  materialsEnriched: 0,
  namesFixed: 0,
};

const fixedProducts = products.map(p => {
  let product = { ...p };
  
  // 1. Corriger le nom (syntaxe, espaces)
  if (product.name) {
    let name = product.name;
    
    // Fix double espaces
    name = name.replace(/\s+/g, ' ').trim();
    
    // Première lettre majuscule
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Fix tirets bizarres
    name = name.replace(/–/g, '-');
    
    if (name !== product.name) {
      stats.namesFixed++;
    }
    product.name = name;
  }
  
  // 2. Vérifier cohérence description vs nom
  if (isDescriptionInconsistent(product.name, product.description)) {
    console.log(`⚠️  Description incohérente supprimée: "${product.name}"`);
    product.description = '';
    stats.descriptionsCleared++;
  }
  
  // 3. Corriger la description (syntaxe)
  if (product.description) {
    let desc = product.description;
    desc = desc.replace(/Cesboucles/g, 'Ces boucles');
    desc = desc.replace(/defabrication/g, 'de fabrication');
    desc = desc.replace(/\s+/g, ' ').trim();
    product.description = desc;
  }
  
  // 4. Enrichir TYPE depuis le nom
  if (!product.type) {
    const type = getTypeFromText(product.name);
    if (type) {
      product.type = type;
      stats.typesEnriched++;
    }
  }
  
  // 5. Enrichir STONES depuis le nom (PAS la description)
  const stonesFromName = getStonesFromText(product.name);
  if (stonesFromName.length > 0) {
    product.stones = stonesFromName;
    stats.stonesEnriched++;
  } else if (!product.stones) {
    product.stones = [];
  }
  
  // 6. Enrichir MATERIAL depuis le nom
  if (!product.material) {
    const material = getMaterialFromText(product.name);
    if (material) {
      product.material = material;
      stats.materialsEnriched++;
    }
  }
  
  return product;
});

// === STATS ===

console.log('\n📊 Résumé des corrections:');
console.log(`   Descriptions incohérentes supprimées: ${stats.descriptionsCleared}`);
console.log(`   Noms corrigés (syntaxe): ${stats.namesFixed}`);
console.log(`   Types enrichis: ${stats.typesEnriched}`);
console.log(`   Pierres enrichies: ${stats.stonesEnriched}`);
console.log(`   Matériaux enrichis: ${stats.materialsEnriched}`);

// Stats par type
const typeStats = {};
fixedProducts.forEach(p => {
  const t = p.type || 'non classé';
  typeStats[t] = (typeStats[t] || 0) + 1;
});

console.log('\n📊 Produits par type:');
Object.entries(typeStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });

// Stats par pierre
const stoneStats = {};
fixedProducts.forEach(p => {
  (p.stones || []).forEach(s => {
    stoneStats[s] = (stoneStats[s] || 0) + 1;
  });
});

console.log('\n📊 Produits par pierre:');
Object.entries(stoneStats)
  .sort((a, b) => b[1] - a[1])
  .forEach(([stone, count]) => {
    console.log(`   ${stone}: ${count}`);
  });

// === SAUVEGARDER ===

fs.writeFileSync(jsonPath, JSON.stringify(fixedProducts, null, 2));
console.log(`\n💾 Sauvegardé: ${jsonPath}`);
```

---

## EXÉCUTION
```bash
node scripts/fix-and-enrich-products.js
```

---

## ✅ CE QUE LE SCRIPT FAIT

1. **Supprime les descriptions incohérentes** (ex: nom="Collier" mais desc="Ces boucles...")
2. **Corrige la syntaxe** ("Cesboucles" → "Ces boucles", espaces doubles)
3. **Enrichit `type`** depuis le nom (boucles d'oreilles, collier, bracelet...)
4. **Enrichit `stones[]`** depuis le nom UNIQUEMENT (pas la description corrompue)
5. **Enrichit `material`** depuis le nom (argent, or, laiton...)

---

## ✅ RÉSULTAT ATTENDU

Après exécution:
- ~50-60 descriptions incohérentes supprimées
- Chaque produit a un `type` (si détectable)
- Chaque produit a `stones[]` (array des pierres dans le nom)
- Chaque produit a `material` (si détectable)
- Les filtres fonctionneront sur ces champs enrichis
EOFgrep -n "typeInfo.filter" app/\[locale\]/accessoires/\[type\]/page.tsx