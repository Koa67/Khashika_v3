#!/bin/bash

# Script de vérification de l'API produits

API_URL="${1:-http://localhost:3000/api/products}"
MAX_RETRIES=5
RETRY_DELAY=2

echo "🔍 Vérification de l'API: $API_URL"
echo ""

for i in $(seq 1 $MAX_RETRIES); do
    echo "Tentative $i/$MAX_RETRIES..."
    
    if curl -s -f "$API_URL" > /dev/null 2>&1; then
        echo "✅ API accessible !"
        echo ""
        echo "📊 Données récupérées:"
        curl -s "$API_URL" | python3 -m json.tool | head -30
        echo ""
        exit 0
    else
        if [ $i -lt $MAX_RETRIES ]; then
            echo "⏳ API non disponible, nouvel essai dans ${RETRY_DELAY}s..."
            sleep $RETRY_DELAY
        fi
    fi
done

echo "❌ Impossible de contacter l'API après $MAX_RETRIES tentatives"
echo ""
echo "💡 Assurez-vous que:"
echo "   1. Le serveur de développement est démarré: npm run dev"
echo "   2. L'API est accessible à: $API_URL"
echo ""
exit 1













