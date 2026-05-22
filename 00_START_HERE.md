# Bienvenue dans TsaraFIDY

## Lire ceci d'abord

TsaraFIDY est une plateforme d'optimisation du recrutement. Vous êtes prêt à la utiliser!

### Les 3 prochaines minutes

1. **Ouvrez [QUICK_START.md](QUICK_START.md)**
   - Installation: 2 minutes
   - Utilisation: 1 minute

2. **Lancez l'app:**
   ```bash
   ./start-local.sh
   ```

3. **Accédez:** http://localhost:3000/fr

---

## Ce que vous pouvez faire

- ✓ **Gérer des candidats** - Ajouter, éditer, supprimer
- ✓ **Optimiser automatiquement** - Algorithme Goal Programming configurable
- ✓ **Voir les résultats** - Candidats classés par score
- ✓ **Analyser les données** - Graphiques et statistiques
- ✓ **Modifier le scoring** - Configuration simple en TypeScript
- ✓ **Personnaliser les couleurs** - 3 valeurs dans CSS
- ✓ **Changer de langue** - 6 langues supportées

---

## Documentation principale

### Pour les utilisateurs
- **[QUICK_START.md](QUICK_START.md)** - Commencez ici (5 min)
- **[LOCAL_SETUP.md](LOCAL_SETUP.md)** - Setup complet
- **[README.md](README.md)** - Documentation générale

### Pour les développeurs
- **[lib/goal-programming.ts](lib/goal-programming.ts)** - Algorithme
- **[THEME_CONFIGURATION.md](THEME_CONFIGURATION.md)** - Thème et couleurs
- **[CHANGES.md](CHANGES.md)** - Changements appliqués
- **[CHECKLIST.md](CHECKLIST.md)** - Vérifications

### Index complet
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Guide complet de la doc

---

## Modification rapide du scoring

Ouvrez `lib/goal-programming.ts` et modifiez:

```typescript
export const GOAL_PROGRAMMING_CONFIG = {
  experienceWeight: 0.4,      // 40% expérience
  ratingWeight: 0.6,          // 60% note
  maxExperienceYears: 20,     // ans max
  maxRatingScore: 5,          // note max
  shortlistedBonus: 0.15,     // +15% bonus
};
```

---

## Modification rapide des couleurs

Ouvrez `app/globals.css` et modifiez:

```css
:root {
  --primary: oklch(0.65 0.2 280);    /* 280=violet, 220=bleu */
  --background: oklch(0.98 0 0);     /* Fond clair */
}

.dark {
  --background: oklch(0.12 0 0);     /* Fond sombre */
}
```

---

## Commandes essentielles

```bash
./start-local.sh              # Démarrer simplement
pnpm dev                      # Développement
pnpm build                    # Build production
http://localhost:3000/fr      # Accès app
```

---

## Configuration locale requise

Créez `.env.local` avec:
```
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé
```

Obtenez ces valeurs sur https://supabase.com

---

## Structure du projet

```
Fichiers importants:
├── lib/goal-programming.ts      <- ALGORITHME
├── app/globals.css              <- COULEURS
├── messages/                    <- TRADUCTIONS
├── app/api/                     <- API REST
└── components/                  <- INTERFACE
```

---

## Prochaines étapes

1. Lisez **[QUICK_START.md](QUICK_START.md)**
2. Lancez **./start-local.sh**
3. Explorez l'interface
4. Modifiez le scoring/couleurs
5. Consultez la doc au besoin

---

## Besoin d'aide?

| Problème | Solution |
|----------|----------|
| Installation | → [LOCAL_SETUP.md](LOCAL_SETUP.md) |
| Modification scoring | → [lib/goal-programming.ts](lib/goal-programming.ts) |
| Modification couleurs | → [THEME_CONFIGURATION.md](THEME_CONFIGURATION.md) |
| Compréhension générale | → [README.md](README.md) |
| Vue d'ensemble doc | → [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) |

---

## Résumé rapide

- Application TsaraFIDY complète et fonctionnelle
- Algorithme Goal Programming configurable et compréhensible
- Support multi-langue (6 langues)
- Thème personnalisable (couleurs, sombre/clair)
- Documentation complète et détaillée
- Prête pour utilisation locale et production

**Bon courage! Consultez [QUICK_START.md](QUICK_START.md) pour commencer.**
