#!/bin/bash
cd ~/Dev/khashika

echo "=== 1. Mise à jour de filters.ts ==="

cat > /tmp/materials_block.txt << 'MATERIALS'
  materials: [
    { id: 'argent', label: 'Argent', count: 272 },
    { id: 'métal', label: 'Métal', count: 74 },
    { id: 'laiton', label: 'Laiton', count: 41 },
    { id: 'cordon', label: 'Cordon / Macramé', count: 41 },
    { id: 'bois', label: 'Bois', count: 11 },
    { id: 'cuir', label: 'Cuir', count: 11 },
  ],
MATERIALS

head -71 lib/types/filters.ts > /tmp/filters_new.ts
cat /tmp/materials_block.txt >> /tmp/filters_new.ts
tail -n +82 lib/types/filters.ts >> /tmp/filters_new.ts
cp /tmp/filters_new.ts lib/types/filters.ts
echo "filters.ts OK"

echo "=== 2. Mise à jour de ShopSidebar.tsx ==="

cat > /tmp/materiaux_section.txt << 'SECTION'

        {/* Section Matériaux */}
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

head -228 components/boutique/ShopSidebar.tsx > /tmp/sidebar_new.tsx
cat /tmp/materiaux_section.txt >> /tmp/sidebar_new.tsx
tail -n +229 components/boutique/ShopSidebar.tsx >> /tmp/sidebar_new.tsx
cp /tmp/sidebar_new.tsx components/boutique/ShopSidebar.tsx
echo "ShopSidebar.tsx OK"

echo "=== 3. Ajouter materiaux à openSections ==="
sed -i '' 's/prix: true,/prix: true,\n    materiaux: true,/' components/boutique/ShopSidebar.tsx
echo "openSections OK"

echo "=== Build ==="
pnpm build 2>&1 | grep -E "(Error|error|Successfully)" | head -10
