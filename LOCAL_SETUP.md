# TsaraFIDY - Guide de Configuration Locale

## Installation et Lancement Local

### Prérequis
- Node.js 18+ 
- pnpm (ou npm/yarn)
- Un compte Supabase (ou une instance locale de Supabase)

### Étapes d'installation

1. **Clonez ou téléchargez le projet**
```bash
git clone <repository-url>
cd tsarafidy
```

2. **Installez les dépendances**
```bash
pnpm install
```

3. **Configurez les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_supabase
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

Pour développer localement, utilisez une instance Supabase gratuite sur supabase.com

4. **Lancez le serveur de développement**
```bash
pnpm dev
```

5. **Accédez à l'application**
```
http://localhost:3000
```

## Utilisation de l'application

### Langues supportées
L'application supporte 6 langues :
- Français (par défaut)
- Anglais
- Espagnol
- Allemand
- Portugais
- Arabe

Pour changer la langue, naviguez vers `/[locale]` (ex: `/en`, `/es`, `/de`)

### Flux d'utilisation
1. **Inscription/Connexion** - Créez un compte
2. **Gestion des candidats** - Ajoutez et gérez vos candidats
3. **Définition des critères** - Configurez les critères d'évaluation
4. **Optimisation** - Lancez l'algorithme de Goal Programming
5. **Résultats** - Consultez les candidats classés
6. **Analytics** - Analysez vos données de recrutement

## Modifier l'Algorithme de Goal Programming

L'algorithme d'optimisation est concentré dans un seul fichier facile à modifier :

### Fichier principal
**`lib/goal-programming.ts`**

Ce fichier contient :
- La configuration de l'algorithme
- Les fonctions de calcul
- La logique de scoring

### Configuration simple (premières lignes du fichier)

```typescript
export const GOAL_PROGRAMMING_CONFIG = {
  // Poids pour le score d'expérience (0-1)
  experienceWeight: 0.4,
  
  // Poids pour le score de notation (0-1)
  ratingWeight: 0.6,
  
  // Années d'expérience maximales pour la normalisation
  maxExperienceYears: 20,
  
  // Score de notation maximal
  maxRatingScore: 5,
  
  // Bonus pour les candidats "Présélectionnés"
  shortlistedBonus: 0.15,
  
  // Pénalité pour les candidats "Rejetés"
  rejectedPenalty: 0,
};
```

### Exemples de modifications

#### 1. Augmenter l'importance de l'expérience
```typescript
experienceWeight: 0.6,  // De 0.4 à 0.6
ratingWeight: 0.4,      // De 0.6 à 0.4
```

#### 2. Réduire le bonus pour les présélectionnés
```typescript
shortlistedBonus: 0.05,  // De 0.15 à 0.05
```

#### 3. Pénaliser les candidats rejetés
```typescript
rejectedPenalty: 0.5,  // 50% de réduction de score
```

#### 4. Augmenter l'expérience maximale considérée
```typescript
maxExperienceYears: 30,  // De 20 à 30
```

### Fonctionnement de l'algorithme

1. **Normalisation de l'expérience** : (années / maxYears) × 100
2. **Normalisation de la note** : (note / maxNote) × 100
3. **Score pondéré** : (expérience × poids_exp) + (note × poids_note)
4. **Ajustements par statut** : Bonus/pénalité selon le statut
5. **Classement** : Tri décroissant par score final

### Fonction principale

La fonction `optimizeCandidates()` est appelée depuis :
- `/components/optimization/optimization-engine.tsx`
- `/components/results/results-view.tsx`

Vous pouvez importer et utiliser cette fonction n'importe où :

```typescript
import { optimizeCandidates } from '@/lib/goal-programming'

const rankedCandidates = optimizeCandidates(candidates, config)
```

## Mode Sombre et Clair

Le mode sombre est activé par défaut. Pour basculer entre les thèmes :

1. Le thème est contrôlé par la classe `dark` sur la balise `<html>`
2. Les couleurs utilisent les variables CSS définies dans `/app/globals.css`

Pour modifier les couleurs, éditez les variables CSS dans `app/globals.css` :

```css
:root {
  --primary: oklch(0.65 0.2 280);  /* Violet principal */
  --background: oklch(0.98 0 0);   /* Fond en clair */
}

.dark {
  --background: oklch(0.12 0 0);   /* Fond en sombre */
}
```

## Structure du projet

```
tsarafidy/
├── app/
│   ├── [locale]/                    # Routes avec support multi-langue
│   │   ├── auth/                    # Pages d'authentification
│   │   ├── dashboard/               # Tableau de bord
│   │   │   ├── candidates/          # Gestion des candidats
│   │   │   ├── criteria/            # Définition des critères
│   │   │   ├── optimization/        # Optimisation
│   │   │   ├── results/             # Résultats
│   │   │   ├── analytics/           # Analytics
│   │   │   └── settings/            # Paramètres
│   └── api/                         # Routes API
│       ├── candidates/              # API candidats
│       ├── criteria/                # API critères
│       └── profile/                 # API profil
├── components/                       # Composants réutilisables
├── lib/
│   ├── goal-programming.ts          # ALGORITHME D'OPTIMISATION
│   ├── supabase/                    # Configuration Supabase
│   └── utils.ts
├── messages/                         # Traductions i18n
│   ├── fr.json
│   ├── en.json
│   ├── es.json
│   ├── de.json
│   ├── pt.json
│   └── ar.json
└── public/                          # Assets statiques
```

## Dépannage

### Problème : "Cannot find module"
```bash
pnpm install
pnpm dev
```

### Problème : Variables d'environnement manquantes
Vérifiez que `.env.local` contient :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Problème : La langue reste en anglais
1. Vérifiez l'URL : `/fr` pour français, `/en` pour anglais
2. Les messages sont dans `/messages/*.json`
3. La locale par défaut est `fr` (voir `i18n.config.ts`)

## Support et Contribution

Pour modifier ou améliorer l'application :
1. Les traductions sont dans `/messages/*.json`
2. L'algorithme d'optimisation est dans `/lib/goal-programming.ts`
3. Les composants UI utilisent shadcn/ui

Bonne utilisation de TsaraFIDY !
