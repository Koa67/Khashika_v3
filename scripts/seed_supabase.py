import os
import math
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path


def main():
    # Chargement config - charger .env.local explicitement
    env_path = Path('.env.local')
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    else:
        load_dotenv()
    
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_key:
        print("❌ Erreur: Variables d'environnement Supabase manquantes")
        print("   Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local")
        return
    
    supabase: Client = create_client(supabase_url, supabase_key)
    
    products = pd.read_csv("products_to_import.csv").to_dict('records')
    success_count = 0

    for product in products:
        try:
            # Conversion sécurisée du prix
            price_value = product.get('price', 0)
            
            # Vérifier si c'est NaN (pandas ou numpy)
            if pd.isna(price_value) or (isinstance(price_value, float) and math.isnan(price_value)):
                price = 0.0
            else:
                price_str = str(price_value)  # Force le string
                price_cleaned = price_str.replace('€', '').replace(',', '.').strip()
                
                # Ignorer les valeurs 'nan' en string
                if price_cleaned.lower() in ['nan', 'none', '', 'null']:
                    price = 0.0
                else:
                    # Gérer les valeurs invalides
                    try:
                        price = float(price_cleaned)
                        # Vérifier si c'est NaN après conversion
                        if math.isnan(price):
                            price = 0.0
                    except (ValueError, TypeError):
                        price = 0.0

            # Nettoyer tous les champs pour éviter les NaN
            name = str(product.get('name', 'Produit sans nom')).strip()
            description = str(product.get('description', '')).strip() if not pd.isna(product.get('description')) else ''
            image_url = str(product.get('image_path', '')).strip() if not pd.isna(product.get('image_path')) else ''
            category = str(product.get('category', 'default')).strip() if not pd.isna(product.get('category')) else 'default'
            
            data = {
                "name": name,
                "price": price,  # Prix nettoyé
                "description": description,
                "image_url": image_url,
                "slug": name.lower().replace(' ', '-'),
                "category": category
            }
            supabase.table("products").upsert(data).execute()
            success_count += 1
        except Exception as e:
            print(f"Erreur produit {product.get('name', 'N/A')}: {str(e)}")
            continue

    print(f"✅ Succès: {success_count} produits importés")


if __name__ == "__main__":
    main()