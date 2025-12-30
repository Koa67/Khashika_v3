const fs = require('fs');

const jsonPath = './lib/data/products-ultimate.json';
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('📦 ' + products.length + ' produits chargés\n');

const PRODUCT_TYPES = {
  "boucles d'oreilles": ["boucles d'oreille", "boucle d'oreille", "clous d'oreille", "creole", "créole"],
  "collier": ["collier"],
  "bracelet": ["bracelet"],
  "bague": ["bague", "anneau"],
  "pendentif": ["pendentif"],
  "chaîne": ["chaine", "chaîne"],
  "cheville": ["cheville", "chevilles"],
  "parure": ["parure"],
  "pashmina": ["pashmina"],
  "foulard": ["foulard", "étole", "etole"],
  "sac": ["sac", "pochette"]
};

const STONES = {
  "améthyste": ["améthyste", "amethyste"],
  "turquoise": ["turquoise"],
  "corail": ["corail"],
  "lapis-lazuli": ["lapis-lazuli", "lapis lazuli", "lapislazuli"],
  "onyx": ["onyx"],
  "jade": ["jade"],
  "grenat": ["grenat"],
  "perle": ["perle"],
  "pierre de lune": ["pierre de lune", "pierre-de-lune"],
  "quartz": ["quartz"],
  "agate": ["agate"],
  "jaspe": ["jaspe"],
  "obsidienne": ["obsidienne"],
  "labradorite": ["labradorite"],
  "oeil de tigre": ["oeil de tigre", "œil de tigre"],
  "cristal": ["cristal"],
  "malachite": ["malachite"],
  "howlite": ["howlite"],
  "amazonite": ["amazonite"],
  "aventurine": ["aventurine"],
  "calcédoine": ["calcedoine", "calcédoine"],
  "citrine": ["citrine"],
  "rhodonite": ["rhodonite"],
  "sodalite": ["sodalite"],
  "topaze": ["topaze"],
  "tourmaline": ["tourmaline"]
};

const MATERIALS = {
  "argent": ["argent", "silver"],
  "or": ["or ", " or", "doré", "gold"],
  "laiton": ["laiton", "brass"],
  "métal": ["metal", "métal"],
  "cuir": ["cuir", "leather"],
  "coton": ["coton", "cotton"],
  "soie": ["soie", "silk"]
};

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['']/g, "'");
}

function getTypeFromText(text) {
  var normalized = normalize(text);
  for (var type in PRODUCT_TYPES) {
    var keywords = PRODUCT_TYPES[type];
    for (var i = 0; i < keywords.length; i++) {
      if (normalized.includes(normalize(keywords[i]))) {
        return type;
      }
    }
  }
  return null;
}

function getStonesFromText(text) {
  var normalized = normalize(text);
  var found = [];
  for (var stone in STONES) {
    var keywords = STONES[stone];
    for (var i = 0; i < keywords.length; i++) {
      var regex = new RegExp('\\b' + normalize(keywords[i]) + '\\b');
      if (regex.test(normalized)) {
        found.push(stone);
        break;
      }
    }
  }
  return found;
}

function getMaterialFromText(text) {
  var normalized = normalize(text);
  for (var material in MATERIALS) {
    var keywords = MATERIALS[material];
    for (var i = 0; i < keywords.length; i++) {
      if (normalized.includes(normalize(keywords[i]))) {
        return material;
      }
    }
  }
  return null;
}

function isDescriptionInconsistent(name, description) {
  if (!description || !name) return false;
  var nameType = getTypeFromText(name);
  var descType = getTypeFromText(description);
  return (nameType && descType && nameType !== descType);
}

var stats = {
  descriptionsCleared: 0,
  typesEnriched: 0,
  stonesEnriched: 0,
  materialsEnriched: 0,
  namesFixed: 0
};

var fixedProducts = products.map(function(p) {
  var product = Object.assign({}, p);
  
  // 1. Corriger le nom
  if (product.name) {
    var name = product.name.replace(/\s+/g, ' ').trim();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.replace(/–/g, '-');
    if (name !== product.name) {
      stats.namesFixed++;
    }
    product.name = name;
  }
  
  // 2. Vérifier cohérence description vs nom
  if (isDescriptionInconsistent(product.name, product.description)) {
    console.log('⚠️  Description incohérente supprimée: ' + product.name);
    product.description = '';
    stats.descriptionsCleared++;
  }
  
  // 3. Corriger la description
  if (product.description) {
    var desc = product.description;
    desc = desc.replace(/Cesboucles/g, 'Ces boucles');
    desc = desc.replace(/defabrication/g, 'de fabrication');
    desc = desc.replace(/\s+/g, ' ').trim();
    product.description = desc;
  }
  
  // 4. Enrichir TYPE depuis le nom
  if (!product.type) {
    var type = getTypeFromText(product.name);
    if (type) {
      product.type = type;
      stats.typesEnriched++;
    }
  }
  
  // 5. Enrichir STONES depuis le nom
  var stonesFromName = getStonesFromText(product.name);
  if (stonesFromName.length > 0) {
    product.stones = stonesFromName;
    stats.stonesEnriched++;
  } else if (!product.stones) {
    product.stones = [];
  }
  
  // 6. Enrichir MATERIAL depuis le nom
  if (!product.material) {
    var material = getMaterialFromText(product.name);
    if (material) {
      product.material = material;
      stats.materialsEnriched++;
    }
  }
  
  return product;
});

console.log('\n📊 Résumé:');
console.log('   Descriptions supprimées: ' + stats.descriptionsCleared);
console.log('   Noms corrigés: ' + stats.namesFixed);
console.log('   Types enrichis: ' + stats.typesEnriched);
console.log('   Pierres enrichies: ' + stats.stonesEnriched);
console.log('   Matériaux enrichis: ' + stats.materialsEnriched);

var typeStats = {};
fixedProducts.forEach(function(p) {
  var t = p.type || 'non classé';
  typeStats[t] = (typeStats[t] || 0) + 1;
});

console.log('\n📊 Par type:');
Object.keys(typeStats).sort(function(a, b) {
  return typeStats[b] - typeStats[a];
}).forEach(function(t) {
  console.log('   ' + t + ': ' + typeStats[t]);
});

var stoneStats = {};
fixedProducts.forEach(function(p) {
  (p.stones || []).forEach(function(s) {
    stoneStats[s] = (stoneStats[s] || 0) + 1;
  });
});

console.log('\n📊 Par pierre:');
Object.keys(stoneStats).sort(function(a, b) {
  return stoneStats[b] - stoneStats[a];
}).forEach(function(s) {
  console.log('   ' + s + ': ' + stoneStats[s]);
});

fs.writeFileSync(jsonPath, JSON.stringify(fixedProducts, null, 2));
console.log('\n💾 Sauvegardé: ' + jsonPath);
