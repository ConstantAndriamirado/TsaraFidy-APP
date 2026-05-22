# Migration Supabase vers Backend Local - État d'avancement

**Date:** 22 mai 2026  
**Status:** 🟡 En cours - Corrections compilées, tests API nécessaires

## ✅ Travail Complété

### 1. **Correction des erreurs `cookies()` (Next.js 16)**
- ✅ `lib/auth.ts` - Ajout de `await` sur tous les `cookies()` appels
  - `setAuthCookie()` → asynchrone
  - `clearAuthCookie()` → asynchrone  
  - `getCurrentUser()` → utilise `await cookies()`
  - `getCurrentUserId()` → utilise `await cookies()`
- ✅ `app/[locale]/auth/actions.ts` - Corrigé `signOut()` avec `await cookies()`
- ✅ `app/api/auth/login/route.ts` - Corrigé `await setAuthCookie()`
- ✅ `app/api/auth/signup/route.ts` - Corrigé `await setAuthCookie()`

### 2. **Migration API Routes Supabase → Postgres**
- ✅ `app/api/candidates/route.ts` - GET/POST avec `getCurrentUserId()` + Postgres
- ✅ `app/api/candidates/[id]/route.ts` - PUT/DELETE avec `getCurrentUserId()` + Postgres
- ✅ `app/api/criteria/route.ts` - GET/POST avec `getCurrentUserId()` + Postgres
- ✅ `app/api/criteria/[id]/route.ts` - PUT/DELETE avec `getCurrentUserId()` + Postgres
- ✅ `app/api/profile/route.ts` - GET/PUT déjà compatible Postgres

### 3. **Nettoyage du code**
- ✅ Suppression `lib/supabase/client.ts`
- ✅ Suppression `lib/supabase/proxy.ts`
- ✅ Suppression `lib/supabase/server.ts`

### 4. **Infrastructure Base de Données**
- ✅ `db-setup.sql` créé avec schéma complet
  - Tables: `users`, `profiles`, `candidates`, `criteria`
  - Données de test: 1 utilisateur test, 3 candidats, 4 critères
- ✅ `init-db.js` script pour initialiser la DB (multiple connection fallbacks)

### 5. **Serveur de Développement**
- ✅ `npm run dev` lancé sans erreurs de compilation
- ✅ Serveur accessible sur `http://localhost:3000`

## 🔴 Problèmes Restants

### 1. **Authentification Base de Données PostgreSQL**
- ❌ Impossible de se connecter à PostgreSQL avec credentials `postgres:postgres`
- **Solution nécessaire:** Clarifier le mot de passe PostgreSQL ou réinitialiser l'utilisateur

### 2. **Routes API Renvoyant 404**
- ❌ Les routes `/api/auth/signup` et `/api/candidates` retournent des pages 404
- **Cause probable:** Configuration i18n dans `next.config.mjs` redirige `/api/*` vers `/[locale]/api/*`
- **Solution nécessaire:** Vérifier/ajuster la configuration i18n ou déplacer les routes API

## 📋 Prochaines Étapes (Priorité)

### Étape 1: Résoudre l'Authentification PostgreSQL
```bash
# Option A: Utiliser pgAdmin pour vérifier/réinitialiser le mot de passe
# Option B: Créer une nouvelle DB avec un utilisateur connu
# Option C: Adapter le script init-db.js avec le bon mot de passe
```

### Étape 2: Corriger les Routes API
- Vérifier `next-intl` configuration dans `next.config.mjs`
- Considérer l'utilisation d'un `route.ts` racine pour les APIs
- Ou créer les routes dans `app/api/` en dehors de la structure i18n

### Étape 3: Initialiser la Base de Données
```bash
npm run init-db  # Une fois la connexion PostgreSQL fixée
```

### Étape 4: Tests Complets
```bash
# Créer un utilisateur de test
# Tester l'authentification (signup/login/logout)
# Tester les CRUD pour candidates et criteria
# Vérifier les permissions utilisateur
```

## 📁 Fichiers Créés/Modifiés

### Fichiers de Configuration
- `.env.local` - Configuration DB et JWT
- `db-setup.sql` - Schéma et données initiales
- `init-db.js` - Script d'initialisation

### Fichiers Code
- `lib/auth.ts` - Authentification JWT locale
- `lib/db.ts` - Connexion Postgres
- `app/api/auth/*.ts` - Routes d'authentification
- `app/api/candidates/*.ts` - Routes CRUD candidats
- `app/api/criteria/*.ts` - Routes CRUD critères
- `app/api/profile/*.ts` - Route profil utilisateur
- `app/[locale]/auth/actions.ts` - Actions serveur auth

## 🔧 Commandes Utiles

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Initialiser la base de données (une fois le mot de passe fixé)
node init-db.js

# Tester une route API
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# Accéder au tableau de bord
# http://localhost:3000/fr/dashboard (une fois authentifié)
```

## 📊 Statut Compilation
- ✅ Compilation Next.js réussie
- ✅ Pas d'erreurs TypeScript
- ⚠️  Avertissement: middleware deprecated (à corriger selon les conseils Next.js)
- ⚠️  Avertissement: viewport metadata dans not-found page (à déplacer)

## 🚀 Prochains Tests
1. Vérifier/réinitialiser PostgreSQL
2. Exécuter `node init-db.js`
3. Tester `POST /api/auth/signup` avec curl
4. Tester `POST /api/auth/login` et vérifier le cookie
5. Tester `GET /api/candidates` avec authentification
6. Tester le formulaire de login dans le navigateur

---

**Note:** Les fichiers de configuration et données de test utilisant des UUIDs et des données fictives. À adapter selon vos besoins.
