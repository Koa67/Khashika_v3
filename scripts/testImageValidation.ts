import { validateProductImage, isImageBlacklisted } from '../lib/imageAssociation';

// Images qui DOIVENT être rejetées
const shouldReject = [
  '/images/products/grenat.jpg',
  '/images/products/amethyste.jpg',
  '/images/products/aventurine.jpg',
  '/images/products/turquoise.jpg',
  '/images/products/corail.jpg',
  '/images/products/onyx.jpg',
  '/images/products/jade.jpg',
  '/images/products/lapis-lazuli.jpg',
  'https://www.khashika.com/autour-du-bijou-indien/grenat.jpg',
  '/images/stones/ruby.jpg',
  '/images/pierres/emeraude.png',
];

// Images qui DOIVENT être acceptées
const shouldAccept = [
  'https://www.khashika.com/wp-content/uploads/Photoroom_038_20240302_105809-768x512.jpeg',
  'https://www.khashika.com/wp-content/uploads/DSC05233-768x512.jpeg',
  '/wp-content/uploads/2024/03/bague-grenat-argent-001.jpg',
  '/images/products/Photoroom_038_20240302_105809.jpeg',
  '/images/products/DSC05233-768x512.jpeg',
  '/images/products/bague-argent-turquoise-001.jpg',
];

console.log('='.repeat(60));
console.log('TEST VALIDATION IMAGES - KHASHIKA v2.0');
console.log('='.repeat(60));

console.log('\n📛 Images qui DOIVENT être REJETÉES:');
let rejectPass = 0;
let rejectFail = 0;

shouldReject.forEach(img => {
  const result = isImageBlacklisted(img);
  if (result) {
    rejectPass++;
    console.log(`  ✅ REJETÉE: ${img.split('/').pop()}`);
  } else {
    rejectFail++;
    console.log(`  ❌ ERREUR: ${img} devrait être rejetée mais ne l'est pas!`);
  }
});

console.log('\n✅ Images qui DOIVENT être ACCEPTÉES:');
let acceptPass = 0;
let acceptFail = 0;

shouldAccept.forEach(img => {
  const result = validateProductImage(img);
  if (result.isValid) {
    acceptPass++;
    console.log(`  ✅ ACCEPTÉE: ${img.split('/').pop()}`);
  } else {
    acceptFail++;
    console.log(`  ❌ ERREUR: ${img} devrait être acceptée`);
    console.log(`     Raison: ${result.rejectionReason}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('RÉSUMÉ DU TEST');
console.log('='.repeat(60));
console.log(`Rejet: ${rejectPass}/${shouldReject.length} OK`);
console.log(`Acceptation: ${acceptPass}/${shouldAccept.length} OK`);

if (rejectFail === 0 && acceptFail === 0) {
  console.log('\n🎉 TOUS LES TESTS PASSENT!');
} else {
  console.log(`\n⚠️ ${rejectFail + acceptFail} erreur(s) détectée(s)`);
  process.exit(1);
}





