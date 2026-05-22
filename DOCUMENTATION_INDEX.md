# Index de la Documentation TsaraFIDY

Bienvenue ! Voici un guide pour naviguer dans la documentation de TsaraFIDY.

---

## Démarrage rapide (5 minutes)

**Commencez ici si vous êtes nouveau:**

1. **[QUICK_START.md](QUICK_START.md)** - Guide ultra-rapide
   - Installation en 3 étapes
   - Utilisation basique
   - Modification du scoring
   - Modification des couleurs

---

## Installation et Configuration

**Pour configurer l'app localement:**

1. **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Configuration complète
   - Prérequis (Node.js, pnpm, Supabase)
   - Installation pas à pas
   - Variables d'environnement
   - Dépannage

2. **[.env.example](.env.example)** - Template de configuration
   - Copier en `.env.local`
   - Ajouter vos clés Supabase

3. **[start-local.sh](start-local.sh)** - Script de démarrage
   - Lance l'app automatiquement
   - Crée `.env.local` si absent
   - Affiche les instructions

---

## Documentation Principale

**Pour comprendre l'application complètement:**

1. **[README.md](README.md)** - Documentation complète
   - Vue d'ensemble de l'app
   - Architecture et structure
   - Stack technologique
   - API REST
   - Algorithme Goal Programming
   - Déploiement

2. **[CHANGES.md](CHANGES.md)** - Ce qui a changé
   - Problèmes corrigés
   - Nouvelles fonctionnalités
   - Améliorations apportées
   - Avant/Après comparaisons

---

## Personnalisation

### Algorithme d'Optimisation

**[lib/goal-programming.ts](lib/goal-programming.ts)** - Code source
- Module principal d'optimisation
- Configuration centralisée
- Bien commenté et documenté

**[config/goal-programming.json](config/goal-programming.json)** - Configuration JSON
- Reference des paramètres
- Presets prédéfinis
- Guide d'utilisation

**Consulter aussi:** Section "Modifier le scoring" dans [QUICK_START.md](QUICK_START.md)

### Couleurs et Thème

**[THEME_CONFIGURATION.md](THEME_CONFIGURATION.md)** - Guide complet
- Format OKLCH expliqué
- Variables CSS disponibles
- Exemples de modifications
- Palette actuelle
- Mode sombre/clair

**[app/globals.css](app/globals.css)** - Code source
- Variables CSS principales
- Thème clair et sombre

**Consulter aussi:** Section "Modifier les couleurs" dans [QUICK_START.md](QUICK_START.md)

### Traductions

**[messages/](messages/)** - Fichiers de traductions
- `fr.json` - Français
- `en.json` - Anglais
- `es.json` - Espagnol
- `de.json` - Allemand
- `pt.json` - Portugais
- `ar.json` - Arabe

---

## Vérification et Tests

**[CHECKLIST.md](CHECKLIST.md)** - Checklist de vérification
- Avant lancement
- Après lancement
- Tests à faire
- Dépannage

---

## Compréhension Technique

### Architecture
- Consulter **Architecture** dans [README.md](README.md)
- Structure complète du projet
- Fichiers principaux
- Flux de données

### API REST
- Consulter **API REST** dans [README.md](README.md)
- Endpoints candidats
- Endpoints critères
- Endpoints profil

### Algorithme Goal Programming
- Consulter **Calcul du Score** dans [README.md](README.md)
- Formule mathématique
- Exemple de calcul
- Comment le modifier

### Stack Technologique
- Consulter **Stack Technologique** dans [README.md](README.md)
- Technologies utilisées
- Versions
- Justifications

---

## Étapes par Cas d'Usage

### Je veux juste utiliser l'app
```
QUICK_START.md → LOCAL_SETUP.md → Utilisation
```

### Je veux modifier le scoring
```
QUICK_START.md (section "Modifier le scoring")
→ lib/goal-programming.ts
→ config/goal-programming.json
```

### Je veux changer les couleurs
```
QUICK_START.md (section "Modifier les couleurs")
→ THEME_CONFIGURATION.md
→ app/globals.css
```

### Je veux ajouter une langue
```
README.md (section "Langues supportées")
→ Copier messages/fr.json en messages/[locale].json
→ Traduire les textes
```

### Je veux comprendre le code
```
README.md (Architecture)
→ Lire les fichiers source
→ Consulter CHANGES.md pour les modifications
```

### Je veux déployer l'app
```
README.md (section "Déploiement")
→ Suivre les instructions
```

---

## Fichiers Importants par Contexte

### Configuration
- `.env.example` - Template variables
- `i18n.config.ts` - Config i18n
- `next.config.mjs` - Config Next.js
- `tailwind.config.ts` - Config Tailwind

### Algorithme
- `lib/goal-programming.ts` - Code principal
- `config/goal-programming.json` - Configuration
- `components/optimization/optimization-engine.tsx` - Utilisation

### Apparence
- `app/globals.css` - Couleurs et styles globaux
- `tailwind.config.ts` - Configuration Tailwind
- `components/layout/` - Layouts et navigation

### Traductions
- `messages/` - Tous les textes
- `i18n.request.ts` - Configuration i18n
- `app/[locale]/` - Routes par langue

### API
- `app/api/candidates/` - API candidats
- `app/api/criteria/` - API critères
- `app/api/profile/` - API profil

---

## Accès rapide

### Pour modifier l'algorithme
```
Fichier: lib/goal-programming.ts
Cherchez: export const GOAL_PROGRAMMING_CONFIG = {
Modifiez: experienceWeight, ratingWeight, etc.
```

### Pour changer la couleur primaire
```
Fichier: app/globals.css
Cherchez: --primary:
Changez: La valeur (ex: 280 = violet, 220 = bleu)
```

### Pour ajouter un message
```
Fichier: messages/fr.json
Ajoutez: "clé": "valeur"
Utilisez: t('clé') dans le code
```

### Pour modifier le style d'une page
```
Fichier: app/[locale]/dashboard/page.tsx
Modifiez: Les classes Tailwind
Redémarrez: pnpm dev
```

---

## Support et Dépannage

1. **Cherchez dans [QUICK_START.md](QUICK_START.md)**
   - Section Dépannage rapide

2. **Consultez [LOCAL_SETUP.md](LOCAL_SETUP.md)**
   - Section Dépannage complet

3. **Vérifiez [CHECKLIST.md](CHECKLIST.md)**
   - Assurez-vous d'avoir fait les étapes

4. **Lisez [README.md](README.md)**
   - Section Support

---

## Commandes utiles

```bash
# Démarrer l'app
./start-local.sh
# Ou manuellement:
pnpm install
pnpm dev

# Accéder à l'app
http://localhost:3000/fr   # Français
http://localhost:3000/en   # Anglais

# Autre commandes
pnpm build      # Build production
pnpm start      # Lancer build
```

---

## Carte mentale de la doc

```
DOCUMENTATION_INDEX.md (Vous êtes ici)
│
├─ QUICK_START.md (5 min)
│  ├─ Installation
│  ├─ Tâches principales
│  ├─ Modifier scoring
│  └─ Modifier couleurs
│
├─ LOCAL_SETUP.md (Détails)
│  ├─ Prérequis
│  ├─ Installation pas à pas
│  ├─ Variables env
│  └─ Dépannage
│
├─ README.md (Complet)
│  ├─ Vue d'ensemble
│  ├─ Architecture
│  ├─ Stack tech
│  ├─ API REST
│  ├─ Algorithme
│  └─ Déploiement
│
├─ THEME_CONFIGURATION.md
│  ├─ Format OKLCH
│  ├─ Variables CSS
│  └─ Exemples
│
├─ CHANGES.md
│  ├─ Corrections
│  └─ Améliorations
│
└─ CHECKLIST.md
   ├─ Avant lancement
   ├─ Tests
   └─ Prochaines étapes
```

---

## Navigation rapide

| Je veux... | Je consulte... |
|-----------|-----------------|
| Démarrer en 5 min | [QUICK_START.md](QUICK_START.md) |
| Installer localement | [LOCAL_SETUP.md](LOCAL_SETUP.md) |
| Comprendre l'app | [README.md](README.md) |
| Modifier le scoring | [lib/goal-programming.ts](lib/goal-programming.ts) |
| Changer les couleurs | [THEME_CONFIGURATION.md](THEME_CONFIGURATION.md) |
| Ajouter une langue | [messages/](messages/) |
| Voir les changements | [CHANGES.md](CHANGES.md) |
| Vérifier tout | [CHECKLIST.md](CHECKLIST.md) |

---

**Prêt? Commencez par [QUICK_START.md](QUICK_START.md)!**
