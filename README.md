# Environnement d'Exécution React Interactif

## 🎯 Vue d'ensemble

Ce projet est un environnement d'exécution interactif pour les composants React. Il permet de :
- Afficher le code source avec coloration syntaxique
- Exécuter des composants React en temps réel
- Gérer les états et les événements
- Afficher les erreurs de manière élégante

## 🏗️ Structure du Projet

### 1. Composants Principaux

#### `CodeRunner` (Canva.tsx)
Le composant principal qui gère l'affichage et l'exécution du code React.

**Fonctionnalités** :
- Affichage du code source avec coloration syntaxique
- Exécution du code React
- Gestion des erreurs via ErrorBoundary
- Support des composants avec état (useState)
- Gestion des événements React

**Props** :
```typescript
interface CodeRunnerProps {
  code: string | React.ReactNode;     // Le code à exécuter
  language?: string;                  // Langage pour la coloration syntaxique
  activeTab: 'source' | 'preview';    // Onglet actif (code source ou aperçu)
}
```

### 2. Système de Types

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
  [key: string]: typeof React | ReactComponent | ReactHook | ReactStateHook<unknown> | ReactEffectHook;
}
```

### 3. Gestion des Erreurs

Le composant `ErrorBoundary` capture et affiche les erreurs de rendu :
- Capture les erreurs pendant le rendu
- Affiche un message d'erreur formaté
- Empêche le plantage de l'application

## 🔄 Flux de Travail

1. **Analyse du Code** :
   - Le code source est analysé par `parseImports`
   - Les imports sont commentés
   - Les types d'événements sont ajoutés automatiquement

2. **Préparation du Code** :
   - Ajout automatique de `export default` si nécessaire
   - Configuration du scope avec React et ses hooks
   - Gestion des types pour les événements

3. **Exécution** :
   - Le code est exécuté dans un environnement sécurisé
   - Les erreurs sont capturées et affichées
   - L'état est géré via useState

## 💡 Exemples d'Utilisation

### 1. Composant Simple
```typescript
import React from 'react';

function MonBouton() {
  const handleClick = () => {
    alert('Le bouton a été cliqué !');
  };

  return (
    <div>
      <button onClick={handleClick}>Cliquez-moi !</button>
    </div>
  );
}

export default MonBouton;
```

### 2. Composant avec État
```typescript
import React, { useState } from 'react';

function NomComposant() {
  const [nom, setNom] = useState('');
  const [nomAffiche, setNomAffiche] = useState('');

  const handleNomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNom(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={nom}
        onChange={handleNomChange}
        placeholder="Votre nom..."
      />
      <button onClick={() => setNomAffiche(nom)}>Envoyé</button>
      {nomAffiche && <h2>Bonjour, {nomAffiche} !</h2>}
    </div>
  );
}

export default NomComposant;
```

## 🔧 Fonctionnalités Actuelles

1. **Affichage du Code** :
   - Coloration syntaxique avec Prism
   - Support de TypeScript/TSX
   - Formatage propre du code

2. **Exécution du Code** :
   - Support complet de React
   - Gestion des hooks (useState, useEffect)
   - Gestion des événements typés

3. **Gestion des Erreurs** :
   - Capture des erreurs de compilation
   - Capture des erreurs de rendu
   - Messages d'erreur formatés

4. **Support des Types** :
   - Types TypeScript complets
   - Types d'événements React
   - Types pour les hooks

## 🚧 Limitations Actuelles

1. Pas de support pour les bibliothèques externes
2. Pas de persistance d'état entre les rendus
3. Pas de support pour les styles CSS externes
4. Pas de support pour les requêtes réseau

## 🔜 Prochaines Étapes Possibles

1. Ajouter le support pour les bibliothèques externes
2. Implémenter la persistance d'état
3. Ajouter le support pour les styles CSS
4. Améliorer la gestion des erreurs
5. Ajouter plus d'exemples de composants
