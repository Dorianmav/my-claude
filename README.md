# Environnement d'Exécution React Interactif

## 🎯 Vue d'ensemble

Ce projet est un environnement d'exécution interactif pour les composants React. Il permet de :
- Afficher le code source avec coloration syntaxique
- Exécuter des composants React en temps réel
- Gérer les états et les événements
- Afficher les erreurs de manière élégante
- Support complet de Tailwind CSS dans le preview
- Rendu de diagrammes Mermaid
- Chat interactif avec streaming des réponses
- Support avancé des graphiques Recharts avec mise en page responsive

## 🚀 Améliorations Récentes

### Interface et Expérience Utilisateur
- Intégration complète des composants shadcn/ui
- Support avancé des composants Chart de shadcn/ui
- Utilisation systématique des composants Card pour une meilleure présentation
- Remplacement des composants HTML natifs par leurs équivalents shadcn/ui
- Ajout de notifications Toast pour les actions utilisateur
- Raccourcis clavier pour une meilleure productivité :
  - `Ctrl+C` : Copier le code
  - `Ctrl+P` : Mode Preview
  - `Ctrl+S` : Mode Source
  - `Escape` : Fermer le canvas
- Amélioration des icônes et du design des boutons

### Architecture et Code
- Réorganisation complète des composants pour plus de modularité
- Séparation des types dans des fichiers dédiés
- Meilleure organisation des composants (séparation des composants imbriqués)
- Support amélioré des graphiques Recharts avec ResponsiveContainer
- Ajout de nouveaux composants Recharts :
  - FunnelChart et Sankey pour les visualisations avancées
  - Composants de référence (ReferenceLine, ReferenceDot, etc.)
  - Composants de base (Label, Brush, etc.)
  - Composants de forme (Polygon, Rectangle, etc.)
- Optimisation des performances avec suppression des logs inutiles
- Correction des conventions de nommage React (useState setters)
- Amélioration de la qualité du code et respect des meilleures pratiques
- Suppression du message système automatique pour plus de flexibilité

## 🏗️ Structure du Projet

### 1. Composants Principaux

#### `CodeRunner` (Canva.tsx)
Le composant principal qui gère l'affichage et l'exécution du code React.

**Fonctionnalités** :
- Affichage du code source avec coloration syntaxique
- Exécution du code React avec support Tailwind CSS
- Gestion des erreurs via ErrorBoundary
- Support complet des hooks React (useState, useEffect, useRef, useCallback, useMemo)
- Gestion des événements React
- Utilitaires Tailwind intégrés (tw, TailwindWrapper)
- Copie du code avec feedback visuel
- Raccourcis clavier intégrés

**Props** :
```typescript
interface CodeRunnerProps {
  code: string | React.ReactNode;     // Le code à exécuter
  language?: string;                  // Langage pour la coloration syntaxique
  activeTab: 'source' | 'preview';    // Onglet actif (code source ou aperçu)
}
```

#### `Chat` (Chat.tsx)
Composant de chat interactif avec l'assistant.

**Fonctionnalités** :
- Streaming en temps réel des réponses
- Scroll automatique intelligent
- Historique des messages persistant
- Support du markdown avec syntaxe highlighting
- Prévisualisation de code et diagrammes

#### `MarkdownRenderer` (MarkdownRenderer.tsx)
Composant de rendu Markdown avec support avancé.

**Fonctionnalités** :
- Rendu de code avec coloration syntaxique
- Support des emojis
- Validation DOM correcte
- Styles Tailwind intégrés

### 2. Composants Utilitaires

#### Toast (toast.tsx)
```typescript
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}
```

#### CopyButton (buttons/CopyButton.tsx)
```typescript
interface CopyButtonProps {
  code: string;
}
```

### 3. Hooks Personnalisés

#### useKeyboardShortcut
```typescript
interface ShortcutOptions {
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options?: ShortcutOptions
) => void;
```

### 4. Fonctionnalités Avancées

#### Support Complet shadcn/ui
L'application utilise maintenant les composants shadcn/ui pour une interface moderne et cohérente :
```jsx
// Composants Card pour la présentation
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Contenu principal
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>

// Composants Chart pour les visualisations
<ChartContainer>
  <ChartTooltip>
    <ChartTooltipContent />
  </ChartTooltip>
  <ChartLegend>
    <ChartLegendContent />
  </ChartLegend>
</ChartContainer>
```

#### Support Tailwind CSS
Le preview supporte maintenant complètement Tailwind CSS avec :
```jsx
// Utilisation directe des classes
<div className="flex items-center justify-center">
  Contenu
</div>

// Utilisation du helper tw pour les styles dynamiques
<div {...tw(`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`)}>
  Styles Dynamiques
</div>

// Utilisation du composant wrapper
<TailwindWrapper className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</TailwindWrapper>
```

## Technologies Utilisées

- React 18.2.0
- TypeScript
- Tailwind CSS
- Recharts
- shadcn/ui
- Groq SDK
- React Runner
- React Markdown
- React Syntax Highlighter
- Mermaid
- Framer Motion
- Lucide React

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` avec vos clés API :
```env
VITE_APP_GROQ_API_KEY=votre_clé_api
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

## Dépendances Principales

- React 18.2.0
- Vite
- TypeScript
- Tailwind CSS
- React Runner
- React Markdown
- Groq SDK
- React Syntax Highlighter
- Mermaid
- shadcn/ui

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug
- Proposer de nouvelles fonctionnalités
- Soumettre une pull request

## License

MIT
