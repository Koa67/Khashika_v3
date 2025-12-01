# Scripts de Déploiement Khashika

Scripts automatisés pour le déploiement et la configuration de la base de données Supabase.

## 📋 Scripts Disponibles

### 1. `deploy.sh` - Protocole de Déploiement Complet

Script principal qui orchestre tout le processus de déploiement.

```bash
bash scripts/deploy.sh
```

**Ce script exécute:**
1. ✅ Vérification des migrations SQL
2. ✅ Vérification du CSV de produits
3. ✅ Seeding des produits dans Supabase
4. ✅ Vérification des images copiées

### 2. `seed_supabase.py` - Import des Produits

Importe les produits depuis le CSV vers Supabase.

```bash
python3 scripts/seed_supabase.py
```

**Fonctionnalités:**
- Lit `products_to_import.csv`
- Copie les images vers `public/images/products/`
- Gère les images manquantes (fallback aléatoire)
- Génère des slugs uniques
- Insère/mise à jour les produits dans Supabase

### 3. `scrape_products.py` - Scraping des Produits

Extrait les produits depuis le site web khashika.com.

```bash
python3 scripts/scrape_products.py
```

**Fonctionnalités:**
- Scrape les produits depuis https://www.khashika.com
- Extrait les informations (nom, prix, description, image)
- Génère `products_to_import.csv`

### 4. `sort_images.py` - Tri Intelligent des Images

Organise les 4400+ images par catégories.

```bash
python3 scripts/sort_images.py
```

**Catégories:**
- `Banners_Hero` : largeur > 1200px (paysage)
- `Products_HD` : largeur > 600px
- `Small_Icons` : largeur < 300px
- `Trash` : fichiers corrompus

### 5. `verify_api.sh` - Vérification de l'API

Teste que l'API produits fonctionne correctement.

```bash
bash scripts/verify_api.sh [URL]
# Par défaut: http://localhost:3000/api/products
```

## 🚀 Processus de Déploiement Complet

### Prérequis

1. **Variables d'environnement** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=votre-service-role-key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
   ```

2. **Dépendances Python**:
   ```bash
   pip3 install supabase python-dotenv pandas requests beautifulsoup4 Pillow
   ```

3. **Supabase CLI** (optionnel mais recommandé):
   ```bash
   npm install -g supabase
   ```

### Étapes

1. **Tri des images** (première fois seulement):
   ```bash
   python3 scripts/sort_images.py
   ```

2. **Scraping des produits** (si besoin de nouvelles données):
   ```bash
   python3 scripts/scrape_products.py
   ```

3. **Application des migrations SQL**:
   
   **Option A - Supabase CLI** (recommandé):
   ```bash
   npx supabase db push
   ```
   
   **Option B - Dashboard Supabase**:
   - Ouvrez le dashboard Supabase
   - Allez dans SQL Editor
   - Copiez-collez le contenu de `supabase/migrations/01_create_products_table.sql`
   - Exécutez
   - Répétez pour `02_create_cart_items_table.sql`

4. **Déploiement complet**:
   ```bash
   bash scripts/deploy.sh
   ```

5. **Vérification**:
   ```bash
   # Démarrer le serveur
   npm run dev
   
   # Dans un autre terminal, vérifier l'API
   bash scripts/verify_api.sh
   ```

## 📁 Structure des Fichiers

```
scripts/
├── deploy.sh              # Script principal de déploiement
├── seed_supabase.py       # Import des produits
├── scrape_products.py     # Scraping web
├── sort_images.py         # Tri des images
├── verify_api.sh          # Vérification API
└── README.md              # Cette documentation

supabase/migrations/
├── 01_create_products_table.sql
└── 02_create_cart_items_table.sql

_raw_assets/
├── Products_HD/           # Images produits (après tri)
├── Banners_Hero/          # Images bannières
├── Small_Icons/           # Icônes
└── Trash/                 # Images corrompues

products_to_import.csv     # Produits à importer
```

## ⚠️ Notes Importantes

1. **Migrations**: Les migrations SQL doivent être appliquées avant le seeding. Le script `deploy.sh` vérifie leur présence mais ne les exécute pas automatiquement.

2. **Service Role Key**: Pour insérer des données, vous devez utiliser `SUPABASE_SERVICE_ROLE_KEY` (pas seulement la clé anon). Cette clé contourne les politiques RLS.

3. **Images**: Les images sont copiées depuis `_raw_assets/Products_HD/` vers `public/images/products/`. Assurez-vous que le dossier source contient les images nécessaires.

4. **Erreurs courantes**:
   - `Could not find the table 'public.products'`: Les migrations n'ont pas été appliquées
   - `permission denied`: Vérifiez que vous utilisez la SERVICE_ROLE_KEY
   - `nodename nor servname provided`: L'URL Supabase est invalide

## 🔧 Dépannage

### Les migrations ne s'appliquent pas

```bash
# Vérifier la connexion Supabase
npx supabase db push

# Ou exécuter manuellement dans le dashboard
```

### Les produits ne s'insèrent pas

1. Vérifiez les variables d'environnement:
   ```bash
   cat .env.local | grep SUPABASE
   ```

2. Vérifiez que les migrations sont appliquées:
   - Dashboard Supabase → Table Editor → products

3. Vérifiez les logs:
   ```bash
   python3 scripts/seed_supabase.py 2>&1 | tee seeding.log
   ```

### L'API ne retourne pas de données

1. Vérifiez que le serveur est démarré:
   ```bash
   npm run dev
   ```

2. Testez l'API directement:
   ```bash
   curl http://localhost:3000/api/products
   ```

3. Vérifiez les logs du serveur pour les erreurs

## 📝 Logs

Les scripts génèrent des logs détaillés dans la console. Pour sauvegarder les logs:

```bash
bash scripts/deploy.sh 2>&1 | tee deploy.log
python3 scripts/seed_supabase.py 2>&1 | tee seeding.log
```

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Migrations SQL appliquées dans Supabase
- [ ] CSV de produits généré (`products_to_import.csv`)
- [ ] Images triées et organisées
- [ ] Scripts de déploiement exécutés
- [ ] API testée et fonctionnelle
- [ ] Produits visibles dans le dashboard Supabase
- [ ] Site fonctionne en local (`npm run dev`)










