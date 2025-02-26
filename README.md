# Environnement d'Exécution React Interactif

## Vue d'ensemble

Ce projet est un environnement d'exécution interactif pour les composants React. Il permet de :
- Afficher le code source avec coloration syntaxique
- Exécuter des composants React en temps réel
- Gérer les états et les événements
- Afficher les erreurs de manière élégante
- Support complet de Tailwind CSS dans le preview
- Rendu de diagrammes Mermaid
- Chat interactif avec streaming des réponses
- Support avancé des graphiques Recharts avec mise en page responsive

## Améliorations Récentes

- Intégration complète des composants shadcn/ui
- Support avancé des composants Chart de shadcn/ui
- Utilisation systématique des composants Card pour une meilleure présentation
- Remplacement des composants HTML natifs par leurs équivalents shadcn/ui
- Amélioration des messages système pour une meilleure cohérence visuelle
- Optimisation des performances avec suppression des logs inutiles
- Meilleure organisation des composants (séparation des composants imbriqués)
- Support amélioré des graphiques Recharts avec ResponsiveContainer
- Correction des conventions de nommage React (useState setters)
- Amélioration de la qualité du code et respect des meilleures pratiques

## Structure du Projet

### 1. Composants Principaux

#### CodeRunner (Canva.tsx)
Le composant principal qui gère l'affichage et l'exécution du code React.

**Fonctionnalités** :
- Affichage du code source avec coloration syntaxique
- Exécution du code React avec support Tailwind CSS
- Gestion des erreurs via ErrorBoundary
- Support complet des hooks React (useState, useEffect, useRef, useCallback, useMemo)
- Gestion des événements React
- Utilitaires Tailwind intégrés (tw, TailwindWrapper)

**Props** :
```typescript
interface CodeRunnerProps {
  code: string | React.ReactNode;     // Le code à exécuter
  language?: string;                  // Langage pour la coloration syntaxique
  activeTab: 'source' | 'preview';    // Onglet actif (code source ou aperçu)
}
```

#### Chat (Chat.tsx)
Composant de chat interactif avec l'assistant.

**Fonctionnalités** :
- Streaming en temps réel des réponses
- Scroll automatique intelligent
- Historique des messages
- Support du markdown avec syntaxe highlighting
- Prévisualisation de code et diagrammes

#### MarkdownRenderer (MarkdownRenderer.tsx)
Composant de rendu Markdown avec support avancé.

**Fonctionnalités** :
- Rendu de code avec coloration syntaxique
- Support des emojis
- Validation DOM correcte
- Styles Tailwind intégrés

### 2. Fonctionnalités Avancées

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

#### Hooks React Disponibles
Tous les hooks React principaux sont disponibles dans le preview :
- useState
- useEffect
- useRef
- useCallback
- useMemo

### 3. Système de Types

#### Types pour les Hooks
```typescript
type ReactHook<T = unknown> = (...args: unknown[]) => T;
type ReactStateHook<T> = (initialState: T | (() => T)) => [T, React.Dispatch<React.SetStateAction<T>>];
type ReactEffectHook = (effect: React.EffectCallback, deps?: React.DependencyList) => void;
```

#### Scope des Dépendances
```typescript
interface DependencyScope {
  React: typeof React;
  useState: ReactStateHook<unknown>;
  useEffect: ReactEffectHook;
  useRef: ReactHook;
  useCallback: ReactHook;
  useMemo: ReactHook;
  tw: (className: string) => { className: string };
  TailwindWrapper: React.FC<{ children: React.ReactNode; className?: string }>;
  [key: string]: unknown;
}
```

## Démarrage

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
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

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
