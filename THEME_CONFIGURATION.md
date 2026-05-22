# Configuration du Thème TsaraFIDY

## Vue d'ensemble

TsaraFIDY utilise un système de couleurs basé sur les variables CSS et Tailwind CSS v4. Le thème est configuré pour supporter le mode sombre et clair.

## Fichiers de configuration du thème

### 1. Variables CSS principales
**Fichier: `app/globals.css`**

Ce fichier contient toutes les variables CSS qui définissent les couleurs de l'application.

Structure:
```css
:root {
  /* Thème clair (par défaut) */
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.65 0.2 280);
  /* ... autres variables ... */
}

.dark {
  /* Thème sombre */
  --background: oklch(0.12 0 0);
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.65 0.2 280);
  /* ... autres variables ... */
}
```

### 2. Configuration du HTML
**Fichier: `app/layout.tsx`**

La balise `<html>` doit avoir la classe `dark` pour activer le mode sombre:
```tsx
<html lang={locale} className="dark">
  <body>...</body>
</html>
```

## Personnalisation des couleurs

### Couleurs principales à modifier

1. **Couleur primaire** (violet)
   - Variable: `--primary`
   - Affecte: Boutons, liens, accents principaux
   - Valeur actuelle: `oklch(0.65 0.2 280)`

2. **Arrière-plan**
   - Variable: `--background`
   - Affecte: Fond de page
   - Clair: `oklch(0.98 0 0)`
   - Sombre: `oklch(0.12 0 0)`

3. **Texte principal**
   - Variable: `--foreground`
   - Affecte: Texte principal
   - Clair: `oklch(0.15 0 0)`
   - Sombre: `oklch(0.95 0 0)`

### Format de couleur OKLCH

Les couleurs utilisent le format OKLCH, qui est plus intuitif que RGB:
```
oklch(lightness saturation hue)

- lightness (0-1): Luminosité (0 = noir, 1 = blanc)
- saturation (0-x): Saturation (0 = gris, plus élevé = plus vibrant)
- hue (0-360): Nuance en degrés
```

Exemples de hues (teintes):
- 0-30: Rouges
- 30-90: Oranges/Jaunes
- 90-150: Verts
- 180-240: Bleus/Cyans
- 240-300: Violets
- 300-360: Magentas

### Modification rapide des couleurs

Pour changer la couleur principale (violet -> bleu):

1. Ouvrez `app/globals.css`
2. Trouvez `--primary` dans `:root` et `.dark`
3. Changez la valeur de hue (280 = violet):
   ```css
   --primary: oklch(0.65 0.2 220);  /* 220 = bleu */
   ```

## Toggler le mode sombre/clair

Actuellement, le mode sombre est forcé via la classe `dark` dans `app/layout.tsx`.

Pour ajouter un bouton de bascule:

1. Créez un composant theme-switcher:
```tsx
'use client'
export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(true)
  
  const toggleTheme = () => {
    const html = document.documentElement
    if (isDark) {
      html.classList.remove('dark')
    } else {
      html.classList.add('dark')
    }
    setIsDark(!isDark)
  }
  
  return <button onClick={toggleTheme}>Theme</button>
}
```

2. Ajoutez-le à la navbar
3. Sauvegardez la préférence dans localStorage

## Palette de couleurs actuelle

### Mode Clair
- Fond: Blanc cassé (#f8f7f5)
- Texte: Noir profond (#261e25)
- Primaire: Violet (#a644d6)
- Accent: Violet clair (#dc5df1)

### Mode Sombre
- Fond: Noir profond (#1f1723)
- Texte: Blanc (#f2f0ee)
- Primaire: Violet (#bf99f5)
- Accent: Violet clair (#e8a4ff)

## Variables CSS disponibles

```css
/* Couleurs de base */
--primary              /* Couleur principale */
--primary-foreground   /* Texte sur primary */
--secondary            /* Couleur secondaire */
--secondary-foreground /* Texte sur secondary */
--accent               /* Couleur d'accent */
--accent-foreground    /* Texte sur accent */
--muted                /* Couleur désaturée */
--muted-foreground     /* Texte sur muted */

/* Structure */
--background           /* Fond de page */
--foreground           /* Texte principal */
--card                 /* Fond des cartes */
--card-foreground      /* Texte des cartes */
--border               /* Couleur des bordures */
--input                /* Champs d'input */
--ring                 /* Focus ring */

/* Graphiques */
--chart-1 à --chart-5  /* Couleurs des graphiques */

/* Sidebar */
--sidebar-*            /* Variables sidebar */
```

## Tailwind CSS avec design tokens

Les couleurs sont utilisées via Tailwind:
```tsx
<div className="bg-primary text-primary-foreground">
  Contenu avec couleurs principales
</div>

<div className="bg-background text-foreground">
  Contenu avec couleurs de base
</div>
```

## Dépannage

### Les couleurs ne changent pas
1. Vérifiez que vous modifiez la bonne variable (`:root` ou `.dark`)
2. Redémarrez le serveur de développement
3. Videz le cache du navigateur (Ctrl+Shift+Del)

### Le thème n'est pas appliqué
1. Vérifiez que `<html className="dark">` est dans `app/layout.tsx`
2. Vérifiez que `app/globals.css` est importé
3. Vérifiez que Tailwind est configuré dans `tailwind.config.ts`

## Ressources

- [Documentation OKLCH](https://www.w3.org/TR/css-color-4/#oklch-notation)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors)
- [Color Picker](https://oklch.com)
