#!/bin/bash

# TsaraFIDY Local Development Startup Script

echo "======================================"
echo "TsaraFIDY - Démarrage en développement"
echo "======================================"
echo ""

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Erreur: Node.js n'est pas installé"
    echo "Téléchargez Node.js depuis https://nodejs.org/"
    exit 1
fi

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "Installation de pnpm..."
    npm install -g pnpm
fi

# Vérifier si .env.local existe
if [ ! -f .env.local ]; then
    echo "Attention: .env.local n'existe pas"
    echo "Créant .env.local à partir de .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo ""
        echo "IMPORTANT: Modifiez .env.local avec vos identifiants Supabase"
        echo "1. Allez sur https://supabase.com"
        echo "2. Créez un nouveau projet ou utilisez un projet existant"
        echo "3. Copiez les clés API dans .env.local"
        echo ""
        read -p "Avez-vous configuré .env.local? (oui/non): " response
        if [ "$response" != "oui" ]; then
            echo "Veuillez d'abord configurer .env.local"
            exit 1
        fi
    fi
fi

# Installer les dépendances si node_modules n'existe pas
if [ ! -d node_modules ]; then
    echo "Installation des dépendances..."
    pnpm install
fi

echo ""
echo "======================================"
echo "Démarrage du serveur de développement"
echo "======================================"
echo ""
echo "Accédez à l'application:"
echo "  Français: http://localhost:3000/fr"
echo "  Anglais:  http://localhost:3000/en"
echo ""
echo "Pour modifier l'algorithme Goal Programming:"
echo "  Ouvrez: lib/goal-programming.ts"
echo ""
echo "Pour modifier les couleurs du thème:"
echo "  Ouvrez: app/globals.css"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo "======================================"
echo ""

# Démarrer le serveur
pnpm dev
