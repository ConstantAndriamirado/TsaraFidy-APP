# Démarrage Rapide TsaraFIDY

## En 5 minutes

### 1. Installation (2 min)
```bash
# Clonez le projet
git clone <repository-url>
cd tsarafidy

# Ou lancez le script
./start-local.sh
```

### 2. Configuration (1 min)
Créez `.env.local` avec vos clés Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Lancez l'app (2 min)
```bash
pnpm install
pnpm dev
```
Ouvrez http://localhost:3000/fr

---

## Tâches principales

### Ajouter un candidat
1. Cliquez sur "Candidats" dans la sidebar
2. Cliquez sur "Ajouter un candidat"
3. Remplissez les informations:
   - Nom, email, téléphone
   - Poste demandé
   - Années d'expérience (ex: 5)
   - Note (1-5 étoiles)
   - Statut (Nouveau, En examen, etc.)
4. Cliquez sur "Ajouter"

### Lancer l'optimisation
1. Ajoutez au moins 1 candidat
2. Cliquez sur "Optimisation"
3. Cliquez sur "Lancer l'optimisation"
4. Attendez le résultat
5. Consultez les candidats classés par score

### Voir les résultats
1. Cliquez sur "Résultats"
2. Les candidats sont triés par score
3. Cliquez sur un candidat pour voir les détails
4. Exportez en CSV si nécessaire

### Analyser les données
1. Cliquez sur "Analytique"
2. Consultez:
   - Distribution par statut (pie chart)
   - Distribution par expérience (bar chart)
   - Note moyenne
   - Taux de finalisation

---

## Modifier le scoring

**Fichier: `lib/goal-programming.ts`**

Cherchez la section `GOAL_PROGRAMMING_CONFIG`:

```typescript
export const GOAL_PROGRAMMING_CONFIG = {
  experienceWeight: 0.4,      // 40% = expérience
  ratingWeight: 0.6,          // 60% = note
  maxExperienceYears: 20,
  maxRatingScore: 5,
  shortlistedBonus: 0.15,     // +15% pour présélectionnés
  rejectedPenalty: 0,
};
```

**Exemples de modifications:**

1. Favoriser l'expérience:
```typescript
experienceWeight: 0.7,        // 70%
ratingWeight: 0.3,            // 30%
```

2. Favoriser la note:
```typescript
experienceWeight: 0.3,        // 30%
ratingWeight: 0.7,            // 70%
```

3. Augmenter le bonus présélection:
```typescript
shortlistedBonus: 0.3,        // +30% au lieu de +15%
```

4. Augmenter l'expérience max:
```typescript
maxExperienceYears: 30,       // Au lieu de 20
```

Après modification, redémarrez le serveur:
```bash
# Arrêtez avec Ctrl+C, puis:
pnpm dev
```

---

## Modifier les couleurs

**Fichier: `app/globals.css`**

Trouvez les variables dans `:root` et `.dark`:

```css
:root {
  --primary: oklch(0.65 0.2 280);    /* Violet principal */
  --background: oklch(0.98 0 0);     /* Fond clair */
}

.dark {
  --primary: oklch(0.65 0.2 280);
  --background: oklch(0.12 0 0);     /* Fond sombre */
}
```

**Modifier la couleur primaire:**

Changez la valeur hue (280 = violet):
- 220 = Bleu
- 30 = Orange
- 120 = Vert
- 0 = Rouge

Exemple pour bleu:
```css
--primary: oklch(0.65 0.2 220);      /* Bleu au lieu de violet */
```

Redémarrez pour voir les changements.

---

## Changer la langue

L'app supporte 6 langues. Accédez par l'URL:

- http://localhost:3000/fr - Français
- http://localhost:3000/en - Anglais
- http://localhost:3000/es - Espagnol
- http://localhost:3000/de - Allemand
- http://localhost:3000/pt - Portugais
- http://localhost:3000/ar - Arabe

Les traductions sont dans `messages/[locale].json`

---

## Comprendre le scoring

**Formule d'optimisation:**

```
Score_exp = (années_expérience / max_années) × 100
Score_note = (note / max_note) × 100
Score_pondéré = (Score_exp × exp_weight) + (Score_note × note_weight)
Score_final = Score_pondéré + ajustements_statut
```

**Exemple avec valeurs par défaut:**

Candidat:
- 10 années d'expérience (max 20)
- Note: 4 / 5
- Statut: Nouveau

Calcul:
```
Score_exp = (10 / 20) × 100 = 50
Score_note = (4 / 5) × 100 = 80
Score_pondéré = (50 × 0.4) + (80 × 0.6) = 20 + 48 = 68
Score_final = 68 (pas d'ajustement pour "Nouveau")
```

Si le candidat était "Présélectionné" avec bonus 0.15:
```
Score_final = 68 + (0.15 × 100) = 68 + 15 = 83
```

---

## Points clés

- **Expérience**: Années de travail du candidat
- **Note**: Évaluation personnelle (1-5 stars)
- **Statut**: Nouveau, En examen, Présélectionné, Rejeté
- **Poids**: Détermine l'importance de chaque facteur
- **Bonus**: Points supplémentaires selon le statut

---

## Dépannage rapide

| Problème | Solution |
|----------|----------|
| "Cannot find module" | `pnpm install && pnpm dev` |
| Langue en anglais | Vérifiez l'URL: `/fr` |
| Pas de candidats | Ajoutez-en d'abord |
| Couleurs bizarres | Videz le cache (Ctrl+Shift+Del) |
| .env vide | Copiez `.env.example` à `.env.local` |

---

## Fichiers importants

```
tsarafidy/
├── lib/goal-programming.ts    <- MODIFIER L'ALGORITHME
├── app/globals.css            <- MODIFIER LES COULEURS
├── messages/*.json            <- TRADUCTIONS
├── .env.local                 <- CONFIGURATION
├── README.md                  <- DOCUMENTATION COMPLÈTE
├── LOCAL_SETUP.md             <- SETUP DÉTAILLÉ
└── THEME_CONFIGURATION.md     <- THÈME DÉTAILLÉ
```

---

## Prochaines étapes

1. Explorez l'interface avec quelques candidats
2. Testez l'optimisation
3. Modifiez les poids pour voir les différences
4. Changez les couleurs à votre goût
5. Lisez la documentation complète dans README.md

Bonne utilisation!
