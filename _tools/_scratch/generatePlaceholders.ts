import * as fs from 'fs';
import * as path from 'path';

const PLACEHOLDERS_DIR = 'public/images/products';

// Couleurs Khashika
const PRIMARY = '#8B4E4E';    // Turquoise
const GOLD = '#F0C11D';       // Or
const BG = '#f8f9fa';         // Fond clair

const CATEGORIES = [
  { name: 'bague', icon: '💍', label: 'Bague' },
  { name: 'boucles', icon: '✨', label: 'Boucles d\'oreilles' },
  { name: 'collier', icon: '📿', label: 'Collier' },
  { name: 'bracelet', icon: '⭕', label: 'Bracelet' },
  { name: 'chaine', icon: '🔗', label: 'Chaîne de cheville' },
  { name: 'pendentif', icon: '💎', label: 'Pendentif' },
  { name: 'accessoire', icon: '🎀', label: 'Accessoire' },
  { name: 'image', icon: '📷', label: 'Image à venir' },
];

function generateSVG(category: typeof CATEGORIES[0]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="512" viewBox="0 0 768 512">
  <!-- Fond avec dégradé subtil -->
  <defs>
    <linearGradient id="bg-${category.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BG};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="border-${category.name}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${PRIMARY};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${GOLD};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fond -->
  <rect width="768" height="512" fill="url(#bg-${category.name})"/>
  
  <!-- Bordure décorative -->
  <rect x="20" y="20" width="728" height="472" fill="none" stroke="url(#border-${category.name})" stroke-width="2" rx="8"/>
  
  <!-- Motif central -->
  <circle cx="384" cy="220" r="80" fill="none" stroke="${PRIMARY}" stroke-width="2" opacity="0.3"/>
  <circle cx="384" cy="220" r="60" fill="none" stroke="${GOLD}" stroke-width="1.5" opacity="0.4"/>
  
  <!-- Icône -->
  <text x="384" y="240" font-size="64" text-anchor="middle" dominant-baseline="middle">${category.icon}</text>
  
  <!-- Label catégorie -->
  <text x="384" y="340" font-family="Georgia, serif" font-size="24" fill="${PRIMARY}" text-anchor="middle" font-weight="500">${category.label}</text>
  
  <!-- Sous-titre -->
  <text x="384" y="380" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle">Image bientôt disponible</text>
  
  <!-- Logo Khashika -->
  <text x="384" y="450" font-family="Georgia, serif" font-size="18" fill="${GOLD}" text-anchor="middle" font-style="italic">Khashika</text>
</svg>`;
}

async function main() {
  // Créer le dossier si nécessaire
  if (!fs.existsSync(PLACEHOLDERS_DIR)) {
    fs.mkdirSync(PLACEHOLDERS_DIR, { recursive: true });
  }
  
  console.log('='.repeat(50));
  console.log('GÉNÉRATION DES PLACEHOLDERS');
  console.log('='.repeat(50));
  
  for (const category of CATEGORIES) {
    const filename = `placeholder-${category.name}.svg`;
    const filepath = path.join(PLACEHOLDERS_DIR, filename);
    const svg = generateSVG(category);
    
    fs.writeFileSync(filepath, svg);
    console.log(`✅ Créé: ${filename}`);
  }
  
  // Créer aussi une version placeholder générique (fallback)
  const fallbackSvg = generateSVG({ name: 'default', icon: '💎', label: 'Bijou indien' });
  fs.writeFileSync(path.join(PLACEHOLDERS_DIR, 'placeholder.svg'), fallbackSvg);
  console.log('✅ Créé: placeholder.svg (fallback)');
  
  console.log('\n📁 Placeholders créés dans:', PLACEHOLDERS_DIR);
}

main().catch(console.error);





