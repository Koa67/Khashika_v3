#!/usr/bin/env python3
import json

# Charger les données
with open("lib/data/products-ultimate.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Patterns: pierre -> mots-clés à chercher
PATTERNS = {
    "oeil de tigre": ["oeil de tigre", "oeil du tigre", "tiger eye"],
    "cornaline": ["cornaline"],
    "péridot": ["peridot", "péridot"],
    "aigue-marine": ["aigue-marine", "aigue marine"],
    "rubis": ["rubis"],
    "saphir": ["saphir"],
    "émeraude": ["emeraude", "émeraude"],
    "larimar": ["larimar"],
    "dzi": ["dzi"],
    "nacre": ["nacre", "onacre"],
    "zircon": ["zircon"],
    "jaspe dalmatien": ["dalmatien"],
}

count = 0
details = []

for p in data:
    text = (p.get("name", "") + " " + p.get("description", "")).lower()
    current = [s.lower() for s in p.get("stones", [])]
    added = []
    
    for stone, keywords in PATTERNS.items():
        if stone not in current:
            for kw in keywords:
                if kw in text:
                    added.append(stone)
                    break
    
    if added:
        p["stones"] = p.get("stones", []) + added
        count += 1
        name_short = p["name"][:45]
        details.append(f"+ {added} -> {name_short}")

# Sauvegarder
with open("lib/data/products-ultimate.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Afficher résultat
print(f"PRODUITS MIS A JOUR: {count}")
print("")
for d in details:
    print(d)
print("")
print("Fichier sauvegarde!")
