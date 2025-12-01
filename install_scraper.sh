#!/bin/bash

echo "🔧 Installation des dépendances Python..."
if pip3 install --upgrade -r requirements.txt; then
    echo "✅ Installation terminée!"
    echo "🚀 Lancement du scraper..."
    python3 scrape_khashika_selenium.py
else
    echo "❌ Erreur lors de l'installation des dépendances."
    echo "💡 Essayez d'installer manuellement :"
    echo "   pip3 install --upgrade selenium webdriver-manager beautifulsoup4 requests pillow urllib3 lxml tqdm"
    exit 1
fi
