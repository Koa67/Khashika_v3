#!/bin/bash
# Script pour ajouter la section Matériaux aux filtres
cd ~/Dev/khashika

echo "=== 1. Mise à jour de filters.ts ==="

# Créer le nouveau bloc materials
cat > /tmp/materials_block.txt << 'MATERIALS'
  materials: [
    { id: 'argent', label: 'Argent', count: 256 },
    { id: 'pierres', label: 'Pierres naturelles', count: 140 },
    { id: 'métal tibétain', label: 'Métal tibétain', count: 60 },
    { id: 'soie', label: 'Soie', count: 31 },
    { id: 'or', label: 'Or', count: 31 },
    { id: 'cordon', label: 'Cordon / Macramé', count: 25 },
    { id: 'laiton', label: 'Laiton', count: 19 },
    { id: 'coton', label: 'Coton', count: 18 },
    { id: 'fantaisie', label: 'Fantaisie', count: 11 },
    { id: 'bois', label: 'Bois', count: 8 },
    { id: 'cuir', label: 'Cuir', count: 1 },
    { id: 'résine', label: 'Résine', count: 1 },
    { id: 'métal', label: 'Métal', count: 1 },
  ],
MATERIALS

# Remplacer lignes 72-81 (ancien bloc materials)
head -71 lib/types/filters.ts > /tmp/filters_new.ts
cat /tmp/materials_block.txt >> /tmp/filters_new.ts
tail -n +82 lib/types/filters.ts >> /tmp/filters_new.ts
cp /tmp/filters_new.ts lib/types/filters.ts
echo "filters.ts OK"

echo "=== 2. Mise à jour de ShopSidebar.tsx ==="

# Créer la section Matériaux
cat > /tmp/materiaux_section.txt << 'SECTION'

        {/* Section Matériaux - EN PREMIER */}
        <div className="mb-0 pb-0 border-b border-[#EAB615]/20">
          <button 
            onClick={() => toggleSection('materiaux')}
            className="flex items-center justify-between w-full font-serif text-lg py-3"
          >
            <span>Matériaux</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.materiaux ? 'rotate-180' : ''}`} />
          </button>
          {openSections.materiaux && (
            <div className="space-y-1 pb-4">
              {FILTER_CONFIG.materials.map((mat) => (
                <label key={mat.id} className="flex items-center gap-3 cursor-pointer group py-1.5 hover:translate-x-1 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={filters.materials.includes(mat.id)}
                    onChange={() => onToggleFilter('materials', mat.id)}
                    className="w-4 h-4 accent-[#EAB615] cursor-pointer"
                  />
                  <span className="text-sm text-[#2D2926] group-hover:text-gold-fusion transition-colors">
                    {mat.label}
                  </span>
                  <span className="ml-auto text-xs text-[#2D2926]/40">
                    ({filterCounts.materials?.[mat.id] || 0})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
SECTION

# Insérer après la section Prix (ligne 228) et avant Bijoux (ligne 230)
# La section Prix se termine à la ligne qui contient "</div>" avant "Section Bijoux"
head -228 components/boutique/ShopSidebar.tsx > /tmp/sidebar_new.tsx
cat /tmp/materiaux_section.txt >> /tmp/sidebar_new.tsx
tail -n +229 components/boutique/ShopSidebar.tsx >> /tmp/sidebar_new.tsx
cp /tmp/sidebar_new.tsx components/boutique/ShopSidebar.tsx
echo "ShopSidebar.tsx OK"

echo "=== 3. Ajouter 'materiaux' à openSections ==="
# Ajouter materiaux: true dans openSections (actuellement vers ligne 41)
sed -i '' 's/prix: true,/prix: true,\n    materiaux: true,/' components/boutique/ShopSidebar.tsx
echo "openSections OK"

echo "=== Build ==="
pnpm build 2>&1 | grep -E "(Error|error|Successfully)" | head -10
