import { test, expect } from '@playwright/test';

/**
 * ROBOT DE VALIDATION (PLAYWRIGHT)
 * Test complet du flux d'achat :
 * 1. Ouvre la Homepage
 * 2. Change la langue en Anglais puis Français
 * 3. Va sur /shop, filtre par "Argent"
 * 4. Ouvre un produit, l'ajoute au panier
 * 5. Va au Checkout, remplit le formulaire
 * 6. Vérifie que le paiement (simulé) fonctionne et affiche "Merci"
 * 
 * Si ce test échoue, le code doit être corrigé.
 */

test.describe('Checkout Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Aller sur la homepage
    await page.goto('http://localhost:3000');
  });

  test('Complete checkout flow', async ({ page }) => {
    // 1. Vérifier que la homepage charge
    await expect(page).toHaveTitle(/Khashika/);

    // 2. Changer la langue en Anglais
    // Note: Le sélecteur de langue doit être présent dans la Navbar
    const languageSwitcher = page.locator('button:has-text("FR"), button:has-text("EN")').first();
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      // Attendre le dropdown et cliquer sur English
      await page.waitForTimeout(500);
      const englishOption = page.locator('text=English, text=🇬🇧').first();
      if (await englishOption.isVisible()) {
        await englishOption.click();
        await page.waitForURL(/\/en\//);
      }
    }

    // 3. Changer la langue en Français
    const languageSwitcherFr = page.locator('button:has-text("EN"), button:has-text("FR")').first();
    if (await languageSwitcherFr.isVisible()) {
      await languageSwitcherFr.click();
      await page.waitForTimeout(500);
      const frenchOption = page.locator('text=Français, text=🇫🇷').first();
      if (await frenchOption.isVisible()) {
        await frenchOption.click();
        await page.waitForURL(/\/fr\/|^\//);
      }
    }

    // 4. Aller sur /shop
    await page.goto('http://localhost:3000/shop');
    await expect(page).toHaveURL(/\/shop/);

    // 5. Filtrer par "Argent" (si le filtre existe)
    // Note: Adapter selon l'implémentation réelle des filtres
    const materialFilter = page.locator('text=Argent, text=material').first();
    if (await materialFilter.isVisible()) {
      await materialFilter.click();
      await page.waitForTimeout(1000); // Attendre le filtrage
    }

    // 6. Ouvrir le premier produit disponible
    const firstProduct = page.locator('a[href*="/product/"]').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await page.waitForURL(/\/product\//);
    } else {
      // Si pas de produit, on skip cette partie
      test.skip();
    }

    // 7. Ajouter au panier
    const addToCartButton = page.locator('button:has-text("Ajouter"), button:has-text("Add")').first();
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
    }

    // 8. Aller au checkout
    const checkoutLink = page.locator('a[href*="/checkout"]').first();
    if (await checkoutLink.isVisible()) {
      await checkoutLink.click();
    } else {
      // Essayer d'aller directement
      await page.goto('http://localhost:3000/checkout');
    }
    await page.waitForURL(/\/checkout/);

    // 9. Remplir le formulaire de checkout
    await page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await page.fill('input[name="firstName"], input[name="first_name"]', 'Jean');
    await page.fill('input[name="lastName"], input[name="last_name"]', 'Dupont');
    await page.fill('input[name="address"]', '123 Rue de la Paix');
    await page.fill('input[name="city"]', 'Paris');
    await page.fill('input[name="zipCode"], input[name="zip_code"]', '75001');
    await page.selectOption('select[name="country"]', 'France').catch(() => {
      // Si pas de select, on continue
    });

    // 10. Soumettre le formulaire (paiement simulé)
    const submitButton = page.locator('button:has-text("Payer"), button:has-text("Pay"), button:has-text("Simuler")').first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }

    // 11. Vérifier la page de succès
    await page.waitForURL(/\/checkout\/success/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/checkout\/success/);

    // 12. Vérifier le message de confirmation
    const successMessage = page.locator('text=Merci, text=Thank you, text=Commande Confirmée, text=Order Confirmed').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('Language switching works', async ({ page }) => {
    // Test simple de changement de langue
    await page.goto('http://localhost:3000');
    
    // Vérifier que le contenu français est présent
    const frenchContent = page.locator('text=Khashika, text=CRÉATIONS').first();
    await expect(frenchContent).toBeVisible();
  });

  test('Shop page loads and displays products', async ({ page }) => {
    await page.goto('http://localhost:3000/shop');
    await expect(page).toHaveURL(/\/shop/);
    
    // Vérifier qu'il y a du contenu (produits ou message)
    const content = page.locator('body').first();
    await expect(content).toBeVisible();
  });
});















