# D&D Campaign Game - Project Setup Guide

## 🚀 Initial Setup Commands

When you have Node.js installed, run these commands:

```bash
# Create React TypeScript project
npx create-react-app dnd-campaign-game --template typescript
cd dnd-campaign-game

# Install required dependencies
npm install framer-motion zustand
npm install @types/react @types/react-dom
npm install tailwindcss postcss autoprefixer
npm install react-router-dom @types/react-router-dom

# Initialize Tailwind CSS
npx tailwindcss init -p
```

## 📁 Project Structure

Create this folder structure in your `src` directory:

```
src/
├── components/
│   ├── campaign/
│   │   ├── CampaignLoader.tsx
│   │   ├── SceneRenderer.tsx
│   │   └── SceneTransition.tsx
│   ├── layout/
│   │   ├── SplitScreenLayout.tsx
│   │   ├── PartyPanel.tsx
│   │   └── InteractionPanel.tsx
│   ├── interactions/
│   │   ├── NPCDialogue.tsx
│   │   ├── ShopInterface.tsx
│   │   ├── CombatInterface.tsx
│   │   └── ExplorationInterface.tsx
│   ├── cards/
│   │   ├── ActionCard.tsx
│   │   ├── CreatureCard.tsx
│   │   └── CardGrid.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
├── stores/
│   ├── campaignStore.ts
│   ├── gameStore.ts
│   └── animationStore.ts
├── types/
│   ├── campaign.ts
│   ├── interactions.ts
│   └── cards.ts
├── data/
│   ├── campaigns/
│   │   ├── goblin-cave-rescue.json
│   │   └── village-mystery.json
│   ├── npcs/
│   ├── items/
│   └── animations/
├── assets/
│   ├── images/
│   │   ├── scenes/
│   │   ├── npcs/
│   │   ├── cards/
│   │   └── ui/
│   └── sounds/
├── hooks/
│   ├── useCampaign.ts
│   ├── useScene.ts
│   └── useAnimation.ts
└── utils/
    ├── jsonLoader.ts
    ├── animationUtils.ts
    └── gameLogic.ts
```

## ⚙️ Configuration Files

### tailwind.config.js
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dnd-red': '#8B0000',
        'dnd-blue': '#1E3A8A',
        'dnd-green': '#166534',
        'dnd-purple': '#581C87',
        'dnd-gold': '#FFD700',
      },
      fontFamily: {
        'fantasy': ['Cinzel', 'serif'],
        'body': ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### tsconfig.json (additions)
```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/types/*": ["types/*"],
      "@/data/*": ["data/*"]
    }
  }
}
``` 