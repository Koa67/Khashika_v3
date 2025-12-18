#!/usr/bin/env node

/**
 * 🧊 Script Ice Age - Automatisation des tâches de développement
 * 
 * Ce script fournit des utilitaires pour :
 * - Générer automatiquement des composants React
 * - Vérifier et gérer les images et placeholders
 * 
 * @module scripts/ice_age
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types et Interfaces
// ============================================================================

interface Product {
  id: string;
  image?: string;
  image_url?: string;
  images?: string[];
  [key: string]: any;
}

// ============================================================================
// Constantes
// ============================================================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(PROJECT_ROOT, 'components');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const PLACEHOLDER_SVG_PATH = path.join(PUBLIC_DIR, 'placeholder.svg');
const PRODUCTS_FILE_PATH = path.join(PROJECT_ROOT, 'lib', 'data', 'archived', 'products.ts.bak');

// Messages avec couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// ============================================================================
// Fonctions Utilitaires
// ============================================================================

/**
 * Affiche un message de succès dans le terminal
 */
function logSuccess(message: string): void {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

/**
 * Affiche un message d'erreur dans le terminal
 */
function logError(message: string): void {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
}

/**
 * Affiche un message d'avertissement dans le terminal
 */
function logWarning(message: string): void {
  console.warn(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

/**
 * Affiche un message d'information dans le terminal
 */
function logInfo(message: string): void {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

/**
 * Vérifie si un fichier existe
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Valide le nom d'un composant (doit être en PascalCase, alphanumerique)
 */
function validateComponentName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Le nom du composant ne peut pas être vide' };
  }

  // Vérifier que le nom commence par une majuscule
  if (!/^[A-Z]/.test(name)) {
    return { valid: false, error: 'Le nom du composant doit commencer par une majuscule (PascalCase)' };
  }

  // Vérifier que le nom ne contient que des caractères alphanumériques
  if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return { valid: false, error: 'Le nom du composant ne peut contenir que des lettres et chiffres (PascalCase)' };
  }

  return { valid: true };
}

// ============================================================================
// Génération de Templates
// ============================================================================

/**
 * Génère le template TypeScript pour un composant React
 */
function generateComponentTemplate(componentName: string): string {
  return `"use client";

import React from "react";

interface ${componentName}Props {
  // Props à définir
}

export default function ${componentName}({}: ${componentName}Props) {
  return (
    <div className="p-4">
      <h2 className="font-heading text-xl font-bold text-secondary">
        ${componentName}
      </h2>
    </div>
  );
}
`;
}

/**
 * Génère le SVG placeholder minimal
 */
function generatePlaceholderSVG(): string {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
  <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">Placeholder</text>
</svg>`;
}

// ============================================================================
// Fonctions de Gestion des Composants
// ============================================================================

/**
 * Génère un nouveau composant React
 */
function handleComponentGeneration(componentName: string): void {
  try {
    // Valider le nom du composant
    const validation = validateComponentName(componentName);
    if (!validation.valid) {
      logError(validation.error || 'Nom de composant invalide');
      process.exit(1);
    }

    // Construire le chemin du fichier
    const componentFilePath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);

    // Vérifier si le fichier existe déjà
    if (fileExists(componentFilePath)) {
      logError(`Le composant "${componentName}" existe déjà dans ${componentFilePath}`);
      logInfo('Supprimez le fichier existant ou choisissez un autre nom.');
      process.exit(1);
    }

    // Vérifier que le répertoire components existe
    if (!fileExists(COMPONENTS_DIR)) {
      logWarning(`Le répertoire ${COMPONENTS_DIR} n'existe pas, création...`);
      fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
    }

    // Générer le template
    const template = generateComponentTemplate(componentName);

    // Écrire le fichier
    fs.writeFileSync(componentFilePath, template, 'utf-8');

    logSuccess(`Composant "${componentName}" créé avec succès !`);
    logInfo(`Fichier: ${componentFilePath}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    logError(`Erreur lors de la génération du composant: ${errorMessage}`);
    process.exit(1);
  }
}

// ============================================================================
// Fonctions de Gestion des Images
// ============================================================================

/**
 * Vérifie et crée le placeholder SVG s'il n'existe pas
 */
function ensurePlaceholderExists(): void {
  try {
    if (fileExists(PLACEHOLDER_SVG_PATH)) {
      logInfo(`Le placeholder existe déjà: ${PLACEHOLDER_SVG_PATH}`);
      return;
    }

    // Vérifier que le répertoire public existe
    if (!fileExists(PUBLIC_DIR)) {
      logWarning(`Le répertoire ${PUBLIC_DIR} n'existe pas, création...`);
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    // Générer le SVG placeholder
    const svgContent = generatePlaceholderSVG();

    // Écrire le fichier
    fs.writeFileSync(PLACEHOLDER_SVG_PATH, svgContent, 'utf-8');

    logSuccess(`Placeholder SVG créé: ${PLACEHOLDER_SVG_PATH}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    logError(`Erreur lors de la création du placeholder: ${errorMessage}`);
    throw error;
  }
}

/**
 * Extrait les chemins d'images d'un tableau de produits
 */
function extractImagePaths(products: Product[]): string[] {
  const imagePaths: string[] = [];

  for (const product of products) {
    // Ajouter l'image principale
    if (product.image) {
      imagePaths.push(product.image);
    }
    if (product.image_url) {
      imagePaths.push(product.image_url);
    }

    // Ajouter les images de la galerie
    if (product.images && Array.isArray(product.images)) {
      imagePaths.push(...product.images);
    }
  }

  // Supprimer les doublons
  return [...new Set(imagePaths)];
}

/**
 * Parse le fichier products.ts.bak pour extraire les produits
 */
function parseProductsFile(): Product[] {
  try {
    if (!fileExists(PRODUCTS_FILE_PATH)) {
      logWarning(`Le fichier de produits n'existe pas: ${PRODUCTS_FILE_PATH}`);
      logInfo('Tentative d\'utilisation de lib/data/products.ts...');
      
      // Essayer le fichier principal si l'archivé n'existe pas
      const altProductsPath = path.join(PROJECT_ROOT, 'lib', 'data', 'products.ts');
      if (!fileExists(altProductsPath)) {
        logWarning('Aucun fichier de produits trouvé');
        return [];
      }
      
      const fileContent = fs.readFileSync(altProductsPath, 'utf-8');
      // Si le fichier est vide ou ne contient que des commentaires
      if (fileContent.includes('export const products: Product[] = []')) {
        logWarning('Le fichier de produits est vide');
        return [];
      }
      
      return [];
    }

    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
    const products: Product[] = [];
    const imagePaths: Set<string> = new Set();

    // Extraire tous les chemins d'images (image et image_url)
    const imageRegex = /(?:image|image_url)\s*[:=]\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = imageRegex.exec(fileContent)) !== null) {
      if (match[1] && match[1] !== 'Image Manquante') {
        imagePaths.add(match[1]);
      }
    }

    // Extraire les tableaux d'images (images: [...])
    const imagesArrayRegex = /images\s*:\s*\[([^\]]+)\]/g;
    while ((match = imagesArrayRegex.exec(fileContent)) !== null) {
      const arrayContent = match[1];
      const arrayImageRegex = /['"]([^'"]+)['"]/g;
      let arrayMatch;
      while ((arrayMatch = arrayImageRegex.exec(arrayContent)) !== null) {
        if (arrayMatch[1] && arrayMatch[1] !== 'Image Manquante') {
          imagePaths.add(arrayMatch[1]);
        }
      }
    }

    // Créer des objets produits simples avec les images trouvées
    // On compte chaque produit pour avoir un ID unique
    let productIndex = 0;
    const productBlocks = fileContent.match(/\{[^{}]*\}/g) || [];
    
    for (const block of productBlocks) {
      const productImages: string[] = [];
      
      // Extraire image/image_url de ce bloc
      const blockImageMatch = block.match(/(?:image|image_url)\s*[:=]\s*['"]([^'"]+)['"]/);
      if (blockImageMatch && blockImageMatch[1] && blockImageMatch[1] !== 'Image Manquante') {
        productImages.push(blockImageMatch[1]);
      }
      
      // Extraire images array de ce bloc
      const blockImagesMatch = block.match(/images\s*:\s*\[([^\]]+)\]/);
      if (blockImagesMatch) {
        const arrayContent = blockImagesMatch[1];
        const arrayImageRegex = /['"]([^'"]+)['"]/g;
        let arrayMatch;
        while ((arrayMatch = arrayImageRegex.exec(arrayContent)) !== null) {
          if (arrayMatch[1] && arrayMatch[1] !== 'Image Manquante') {
            productImages.push(arrayMatch[1]);
          }
        }
      }
      
      if (productImages.length > 0) {
        products.push({
          id: `product-${productIndex++}`,
          image: productImages[0],
          images: productImages.slice(1),
        });
      }
    }

    // Si aucun produit n'a été trouvé avec la méthode des blocs, utiliser les images uniques
    if (products.length === 0 && imagePaths.size > 0) {
      Array.from(imagePaths).forEach((imgPath, index) => {
        products.push({
          id: `product-${index}`,
          image: imgPath,
        });
      });
    }

    return products;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    logError(`Erreur lors du parsing du fichier de produits: ${errorMessage}`);
    return [];
  }
}

/**
 * Vérifie l'existence des images des produits
 */
function checkProductImages(): void {
  try {
    logInfo('Vérification des images des produits...');

    // S'assurer que le placeholder existe
    ensurePlaceholderExists();

    // Parser le fichier de produits
    const products = parseProductsFile();

    if (products.length === 0) {
      logWarning('Aucun produit trouvé dans le fichier');
      return;
    }

    logInfo(`${products.length} produit(s) trouvé(s)`);

    // Extraire tous les chemins d'images
    const imagePaths = extractImagePaths(products);

    if (imagePaths.length === 0) {
      logWarning('Aucune image trouvée dans les produits');
      return;
    }

    logInfo(`${imagePaths.length} chemin(s) d'image(s) trouvé(s)`);

    // Vérifier chaque image
    const missingImages: string[] = [];
    const existingImages: string[] = [];

    for (const imagePath of imagePaths) {
      // Nettoyer le chemin (enlever le / initial si présent)
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      const fullImagePath = path.join(PUBLIC_DIR, cleanPath);

      if (fileExists(fullImagePath)) {
        existingImages.push(imagePath);
      } else {
        missingImages.push(imagePath);
      }
    }

    // Afficher les résultats
    console.log('\n' + '='.repeat(60));
    logSuccess(`${existingImages.length} image(s) existante(s)`);
    if (existingImages.length > 0) {
      existingImages.slice(0, 5).forEach((img) => {
        console.log(`  ${colors.green}✓${colors.reset} ${img}`);
      });
      if (existingImages.length > 5) {
        logInfo(`  ... et ${existingImages.length - 5} autre(s) image(s)`);
      }
    }

    if (missingImages.length > 0) {
      console.log('\n' + '='.repeat(60));
      logWarning(`${missingImages.length} image(s) manquante(s):`);
      missingImages.forEach((img) => {
        console.log(`  ${colors.red}✗${colors.reset} ${img}`);
      });

      // Optionnel : proposer de copier le placeholder
      logInfo('\nAstuce: Utilisez le placeholder.svg pour remplacer les images manquantes');
    } else {
      logSuccess('\nToutes les images sont présentes !');
    }

    console.log('\n' + '='.repeat(60));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    logError(`Erreur lors de la vérification des images: ${errorMessage}`);
    process.exit(1);
  }
}

// ============================================================================
// Point d'Entrée Principal
// ============================================================================

/**
 * Affiche l'aide du script
 */
function showHelp(): void {
  console.log(`
${colors.cyan}🧊 Ice Age Script - Automatisation des tâches de développement${colors.reset}

${colors.yellow}Usage:${colors.reset}
  npm run ice-age -- <command> [args]
  npm run scaffold <ComponentName>

${colors.yellow}Commandes disponibles:${colors.reset}
  ${colors.green}component <ComponentName>${colors.reset}  Génère un nouveau composant React
  ${colors.green}images${colors.reset}                    Vérifie les images des produits et crée le placeholder

${colors.yellow}Exemples:${colors.reset}
  npm run scaffold MyNewComponent
  npm run ice-age -- component MyButton
  npm run ice-age -- images

${colors.yellow}Notes:${colors.reset}
  - Le nom du composant doit être en PascalCase (commence par une majuscule)
  - Le script vérifie automatiquement l'existence des fichiers avant de les créer
  - Le placeholder.svg est créé automatiquement s'il n'existe pas
`);
}

/**
 * Point d'entrée principal du script
 */
function main(): void {
  // Récupérer les arguments de la ligne de commande
  // Note: process.argv[0] = node, process.argv[1] = script path
  //       process.argv[2] = command, process.argv[3] = argument
  const command = process.argv[2];
  const argument = process.argv[3];

  // Afficher l'aide si aucune commande n'est fournie
  if (!command || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  // Router vers la bonne fonction
  switch (command) {
    case 'component':
      if (!argument) {
        logError('Le nom du composant est requis');
        logInfo('Usage: npm run ice-age -- component <ComponentName>');
        process.exit(1);
      }
      handleComponentGeneration(argument);
      break;

    case 'images':
      checkProductImages();
      break;

    default:
      logError(`Commande inconnue: "${command}"`);
      showHelp();
      process.exit(1);
  }
}

// Exécuter le script directement
main();
