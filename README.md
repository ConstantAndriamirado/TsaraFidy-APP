# TsaraFIDY - Plateforme d'Optimisation du Recrutement

TsaraFIDY est une plateforme SaaS de recrutement alimentée par l'intelligence artificielle utilisant la programmation par objectifs pour optimiser la sélection des candidats.

## Caractéristiques

- **Gestion des candidats**: Ajoutez, modifiez et supprimez des candidats avec détails complets
- **Optimisation par Goal Programming**: Algorithme intelligent de classement basé sur la pondération des critères
- **Critères de sélection**: Définissez les critères d'évaluation avec pondération personnalisable
- **Résultats classés**: Visualisez les candidats triés par score d'optimisation
- **Analytique**: Tableaux de bord avec visualisations des données de recrutement
- **Paramètres utilisateur**: Gestion des préférences et profil
- **Multi-langue**: Support de 6 langues (FR, EN, ES, DE, PT, AR)
- **Thème sombre/clair**: Interface adaptative avec variables CSS personnalisables
- **Authentification sécurisée**: Intégration Supabase avec RLS

## Installation rapide

### Prérequis
- Node.js 18+
- pnpm (ou npm/yarn)
- Un compte Supabase gratuit

### Démarrage en 3 étapes

1. **Clonez le projet**
```bash
git clone https://github.com/ConstantAndriamirado/TsaraFidy-APP.git
cd tsarafidy
```

2. **Configurez les variables d'environnement**
```bash
cp .env.example .env.local
# Modifiez .env.local avec vos propres clés Supabase
```

3. **Lancez l'application**
```bash
./start-local.sh
# Ou manuellement:
pnpm install
pnpm dev
```

Accédez à http://localhost:3000/fr

## Documentation

### Guides principaux
- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Configuration locale complète et utilisation
- **[THEME_CONFIGURATION.md](THEME_CONFIGURATION.md)** - Personnalisation des couleurs et thème
- **[lib/goal-programming.ts](lib/goal-programming.ts)** - Algorithme d'optimisation avec configuration

### Modification de l'algorithme

L'algorithme Goal Programming est facile à modifier:

**Fichier: `lib/goal-programming.ts`**

Configuration simple (premières lignes):
```typescript
export const GOAL_PROGRAMMING_CONFIG = {
  experienceWeight: 0.4,      // Poids de l'expérience (40%)
  ratingWeight: 0.6,           // Poids de la note (60%)
  maxExperienceYears: 20,      // Années d'expérience maximales
  maxRatingScore: 5,           // Note maximale
  shortlistedBonus: 0.15,      // Bonus pour présélectionnés (+15%)
  rejectedPenalty: 0,          // Pénalité pour rejetés
};
```

### Personalization des couleurs

**Fichier: `app/globals.css`**

Modifiez les variables CSS pour changer les couleurs:
```css
:root {
  --primary: oklch(0.65 0.2 280);    /* Violet */
  --background: oklch(0.98 0 0);     /* Blanc cassé */
}

.dark {
  --primary: oklch(0.65 0.2 280);    /* Violet clair */
  --background: oklch(0.12 0 0);     /* Noir profond */
}
```

## Architecture

```
tsarafidy/
├── app/
│   ├── [locale]/                    # Routes avec support i18n
│   │   ├── auth/                    # Authentification
│   │   └── dashboard/               # Tableau de bord
│   │       ├── candidates/
│   │       ├── criteria/
│   │       ├── optimization/
│   │       ├── results/
│   │       ├── analytics/
│   │       └── settings/
│   └── api/                         # API REST
├── components/                      # Composants réutilisables
├── lib/
│   ├── goal-programming.ts          # ALGORITHME PRINCIPAL
│   └── supabase/                    # Configuration BD
├── messages/                        # Traductions (FR, EN, ES, DE, PT, AR)
└── public/                          # Assets statiques
```

## Stack Technologique

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styles**: Tailwind CSS v4, shadcn/ui
- **Base de données**: Supabase PostgreSQL avec RLS
- **Authentification**: Supabase Auth
- **i18n**: next-intl
- **État client**: SWR
- **Graphiques**: Recharts

## Utilisation

### 1. Créer un compte
- Accédez à http://localhost:3000/fr/auth/sign-up
- Inscrivez-vous avec votre email

### 2. Ajouter des candidats
- Allez à "Candidats"
- Cliquez sur "Ajouter un candidat"
- Remplissez les détails (expérience, note, etc.)

### 3. Définir les critères
- Allez à "Critères"
- Créez des critères avec pondération

### 4. Lancer l'optimisation
- Allez à "Optimisation"
- Cliquez sur "Lancer l'optimisation"
- Consultez les résultats classés

### 5. Analyser les données
- Allez à "Analytique"
- Visualisez les statistiques de recrutement

## Configuration locale

### Variables d'environnement requises

Créez un fichier `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

Obtenez ces valeurs depuis:
1. https://supabase.com
2. Créez un projet
3. Allez à Settings > API
4. Copiez l'URL et la clé "anon"

### Scripts de développement

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev

# Build pour production
pnpm build

# Lancer la build en production
pnpm start
```

## Langues supportées

L'application supporte 6 langues. Accédez via l'URL:

- `/fr` - Français (défaut)
- `/en` - Anglais
- `/es` - Espagnol
- `/de` - Allemand
- `/pt` - Portugais
- `/ar` - Arabe

Les traductions sont dans `messages/*.json`

## Calcul du Score d'Optimisation

L'algorithme Goal Programming utilise la formule suivante:

```
1. Normaliser l'expérience: (années / maxYears) × 100
2. Normaliser la note: (note / maxNote) × 100
3. Score pondéré = (exp × poids_exp) + (note × poids_note)
4. Appliquer les bonus/pénalités selon le statut
5. Classer par score décroissant
```

**Exemple avec configuration par défaut:**
- Candidat A: 10 ans, note 4.5
  - Score exp: (10/20) × 100 = 50
  - Score note: (4.5/5) × 100 = 90
  - Score final: (50 × 0.4) + (90 × 0.6) = 74
  - Rang: Selon comparaison avec autres candidats

Modifiez les poids dans `lib/goal-programming.ts` pour changer le comportement.

## API REST

### Candidats
- `GET /api/candidates` - Lister tous les candidats
- `POST /api/candidates` - Créer un candidat
- `GET /api/candidates/:id` - Obtenir un candidat
- `PUT /api/candidates/:id` - Mettre à jour
- `DELETE /api/candidates/:id` - Supprimer

### Critères
- `GET /api/criteria` - Lister les critères
- `POST /api/criteria` - Créer un critère
- `PUT /api/criteria/:id` - Mettre à jour
- `DELETE /api/criteria/:id` - Supprimer

### Profil
- `GET /api/profile` - Obtenir le profil
- `PUT /api/profile` - Mettre à jour le profil

## Dépannage

### La langue reste en anglais
- Vérifiez l'URL: doit être `/fr` pour français
- Confirmez que `messages/fr.json` existe
- Redémarrez le serveur: `pnpm dev`

### Les candidats n'apparaissent pas
- Vérifiez la connexion à Supabase dans `.env.local`
- Assurez-vous d'être connecté
- Consultez la console du navigateur pour les erreurs

### Le thème sombre ne s'applique pas
- Vérifiez que la classe `dark` est sur la balise `<html>`
- Videz le cache du navigateur
- Vérifiez les variables CSS dans `app/globals.css`

### Erreur "Cannot find module"
```bash
# Réinstallez les dépendances
rm -rf node_modules
pnpm install
```

## Déploiement

### Sur Vercel (recommandé)
```bash
# Installez Vercel CLI
npm install -g vercel

# Déployez
vercel
```

### Autohébergement
```bash
# Build
pnpm build

# Lancez
pnpm start
```

## Contribution

Pour contribuer:
1. Créez une branche feature
2. Faites vos modifications
3. Testez localement
4. Créez une pull request

## Licence

MIT

## Support

Pour des questions ou des problèmes:
1. Consultez [LOCAL_SETUP.md](LOCAL_SETUP.md)
2. Consultez [THEME_CONFIGURATION.md](THEME_CONFIGURATION.md)
3. Vérifiez les commentaires dans [lib/goal-programming.ts](lib/goal-programming.ts)

---

**Bonne utilisation de TsaraFIDY!**
# TsaraFidy-APP
