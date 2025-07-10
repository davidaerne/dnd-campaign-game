# Core TypeScript Files for D&D Campaign Game

## 📄 Essential Files to Create

### 1. TypeScript Type Definitions

#### types/campaign.ts
```typescript
// Core campaign and scene types
export interface Campaign {
  campaignId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: string;
  playerLevels: [number, number];
  scenes: Scene[];
  globalData: GlobalData;
}

export interface Scene {
  id: string;
  type: 'town' | 'exploration' | 'combat' | 'dungeon' | 'social' | 'puzzle';
  title: string;
  background: string;
  music?: string;
  description: string;
  npcs?: NPC[];
  encounters?: Encounter[];
  interactions?: Interaction[];
  transitions: Transition[];
  requiredItems?: string[];
  completionConditions?: CompletionCondition[];
}

export interface NPC {
  id: string;
  name: string;
  position: { x: number; y: number };
  sprite: string;
  dialogue: DialogueTree;
  shop?: Shop;
  questGiver?: boolean;
  relationship: number;
}

export interface DialogueTree {
  greeting: string;
  nodes: DialogueNode[];
  farewell?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  conditions?: Condition[];
  choices: DialogueChoice[];
  consequences?: Consequence[];
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNode?: string;
  requirements?: Requirement[];
  consequences?: Consequence[];
}

export interface Shop {
  type: 'general_goods' | 'weapons' | 'armor' | 'magical_items' | 'potions' | 'inn';
  name: string;
  buybackRate: number;
  inventory: ShopItem[];
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
}

export interface Encounter {
  id: string;
  type: 'combat' | 'skill_check' | 'discovery' | 'trap';
  triggerChance: number;
  position: { x: number; y: number };
  data: any;
}

export interface Transition {
  to: string;
  trigger: 'automatic' | 'quest_completed' | 'area_explored' | 'item_found' | 'choice_made';
  position: { x: number; y: number };
  label: string;
  requirements?: Requirement[];
}

export interface GlobalData {
  questItems: string[];
  partyLevel: number;
  availableActions: string[];
  experienceRewards?: Record<string, number>;
}

export interface Condition {
  type: 'has_item' | 'relationship_level' | 'quest_status' | 'stat_check';
  target: string;
  value: any;
  operator?: '>' | '<' | '=' | '>=' | '<=';
}

export interface Requirement {
  type: 'has_quest' | 'has_item' | 'has_clue' | 'level_minimum';
  value: string | number;
}

export interface Consequence {
  type: 'add_quest' | 'add_item' | 'add_clue' | 'relationship_change' | 'add_gold' | 'add_experience';
  value: string | number;
}

export interface CompletionCondition {
  type: 'npc_rescued' | 'enemy_defeated' | 'item_collected' | 'dialogue_completed';
  target: string;
}

export interface Interaction {
  type: 'skill_check' | 'discovery' | 'puzzle';
  position: { x: number; y: number };
  data: any;
}
```

#### types/game.ts
```typescript
// Game state and progress types
export interface GameState {
  currentCampaign: string | null;
  currentScene: string | null;
  party: PartyMember[];
  inventory: InventoryItem[];
  questLog: Quest[];
  worldState: Record<string, any>;
  campaignProgress: CampaignProgress;
}

export interface PartyMember {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: { current: number; max: number };
  ac: number;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills: Record<string, number>;
  equipment: Equipment;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'quest_item' | 'misc';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  properties?: Record<string, any>;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
  rewards: QuestReward[];
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  type: 'kill' | 'collect' | 'talk_to' | 'reach_location' | 'survive';
  target?: string;
  current?: number;
  required?: number;
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item';
  amount: number;
  itemId?: string;
}

export interface CampaignProgress {
  completedScenes: string[];
  discoveredClues: string[];
  npcRelationships: Record<string, number>;
  choicesMade: Record<string, string>;
  timeElapsed: number;
}

export interface Equipment {
  weapon?: InventoryItem;
  armor?: InventoryItem;
  shield?: InventoryItem;
  accessories: InventoryItem[];
}
```

#### types/cards.ts
```typescript
// Action card system types
export interface ActionCard {
  id: string;
  name: string;
  type: 'attack' | 'defense' | 'special' | 'legendary' | 'utility';
  description: string;
  cost?: number;
  damage?: string;
  effect?: string;
  range?: 'melee' | 'ranged' | 'touch' | 'self';
  actionType: 'action' | 'bonus_action' | 'reaction' | 'legendary';
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  requirements?: CardRequirement[];
  animation?: string;
}

export interface CardRequirement {
  type: 'class' | 'level' | 'item' | 'stat';
  value: string | number;
  minimum?: number;
}

export interface CardPlay {
  card: ActionCard;
  actor: string;
  targets: string[];
  result: CardResult;
  timestamp: number;
}

export interface CardResult {
  success: boolean;
  damage?: number;
  healing?: number;
  effects: StatusEffect[];
  description: string;
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'buff' | 'debuff' | 'neutral';
  stackable: boolean;
}
```

### 2. State Management (Zustand Store)

#### stores/campaignStore.ts
```typescript
import { create } from 'zustand';
import { Campaign, Scene, GameState } from '../types/campaign';

interface CampaignStore {
  // State
  currentCampaign: Campaign | null;
  currentScene: Scene | null;
  gameState: GameState;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCampaign: (campaignId: string) => Promise<void>;
  transitionToScene: (sceneId: string) => Promise<void>;
  updateGameState: (updates: Partial<GameState>) => void;
  saveProgress: () => Promise<void>;
  loadProgress: () => Promise<void>;
  resetCampaign: () => void;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  // Initial state
  currentCampaign: null,
  currentScene: null,
  gameState: {
    currentCampaign: null,
    currentScene: null,
    party: [],
    inventory: [],
    questLog: [],
    worldState: {},
    campaignProgress: {
      completedScenes: [],
      discoveredClues: [],
      npcRelationships: {},
      choicesMade: {},
      timeElapsed: 0
    }
  },
  isLoading: false,
  error: null,

  // Actions
  loadCampaign: async (campaignId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/data/campaigns/${campaignId}.json`);
      if (!response.ok) throw new Error(`Campaign ${campaignId} not found`);
      
      const campaign: Campaign = await response.json();
      const initialScene = campaign.scenes[0];
      
      set({
        currentCampaign: campaign,
        currentScene: initialScene,
        gameState: {
          ...get().gameState,
          currentCampaign: campaignId,
          currentScene: initialScene.id
        },
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load campaign',
        isLoading: false
      });
    }
  },

  transitionToScene: async (sceneId: string) => {
    const { currentCampaign, gameState } = get();
    if (!currentCampaign) return;

    const scene = currentCampaign.scenes.find(s => s.id === sceneId);
    if (!scene) {
      set({ error: `Scene ${sceneId} not found` });
      return;
    }

    // Add current scene to completed scenes
    const updatedProgress = {
      ...gameState.campaignProgress,
      completedScenes: [...gameState.campaignProgress.completedScenes, gameState.currentScene].filter(Boolean)
    };

    set({
      currentScene: scene,
      gameState: {
        ...gameState,
        currentScene: sceneId,
        campaignProgress: updatedProgress
      }
    });
  },

  updateGameState: (updates: Partial<GameState>) => {
    set(state => ({
      gameState: { ...state.gameState, ...updates }
    }));
  },

  saveProgress: async () => {
    const { gameState } = get();
    try {
      localStorage.setItem('dnd-campaign-save', JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  loadProgress: async () => {
    try {
      const saved = localStorage.getItem('dnd-campaign-save');
      if (saved) {
        const gameState = JSON.parse(saved);
        set({ gameState });
        
        // Load the campaign if one was in progress
        if (gameState.currentCampaign) {
          get().loadCampaign(gameState.currentCampaign);
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  },

  resetCampaign: () => {
    set({
      currentCampaign: null,
      currentScene: null,
      gameState: {
        currentCampaign: null,
        currentScene: null,
        party: [],
        inventory: [],
        questLog: [],
        worldState: {},
        campaignProgress: {
          completedScenes: [],
          discoveredClues: [],
          npcRelationships: {},
          choicesMade: {},
          timeElapsed: 0
        }
      },
      error: null
    });
  }
}));
```

### 3. Core Components

#### components/campaign/CampaignLoader.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { useCampaignStore } from '../../stores/campaignStore';

interface CampaignLoaderProps {
  onCampaignLoaded?: () => void;
}

export const CampaignLoader: React.FC<CampaignLoaderProps> = ({ onCampaignLoaded }) => {
  const [availableCampaigns, setAvailableCampaigns] = useState<Array<{id: string, title: string, description: string}>>([]);
  const { loadCampaign, isLoading, error } = useCampaignStore();

  useEffect(() => {
    // Load available campaigns list
    fetchAvailableCampaigns();
  }, []);

  const fetchAvailableCampaigns = async () => {
    try {
      // This would typically come from an API or manifest file
      const campaigns = [
        {
          id: 'missing_merchant',
          title: 'The Missing Merchant',
          description: 'A wealthy merchant has gone missing on the road to Greenhill.'
        },
        {
          id: 'village_festival',
          title: 'The Festival Phantom',
          description: 'Strange occurrences plague the annual Harvest Festival.'
        }
      ];
      setAvailableCampaigns(campaigns);
    } catch (error) {
      console.error('Failed to load campaigns list:', error);
    }
  };

  const handleCampaignSelect = async (campaignId: string) => {
    await loadCampaign(campaignId);
    if (onCampaignLoaded) {
      onCampaignLoaded();
    }
  };

  if (isLoading) {
    return (
      <div className="campaign-loader loading">
        <div className="loading-spinner"></div>
        <p>Loading campaign...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaign-loader error">
        <h3>Error Loading Campaign</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="campaign-loader">
      <h2>Select a Campaign</h2>
      <div className="campaign-list">
        {availableCampaigns.map(campaign => (
          <div key={campaign.id} className="campaign-card">
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <button 
              onClick={() => handleCampaignSelect(campaign.id)}
              className="btn-primary"
            >
              Start Campaign
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### components/layout/SplitScreenLayout.tsx
```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PartyPanel } from './PartyPanel';
import { InteractionPanel } from './InteractionPanel';
import { SceneRenderer } from '../campaign/SceneRenderer';

interface SplitScreenLayoutProps {
  children?: React.ReactNode;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({ children }) => {
  return (
    <div className="split-screen-layout">
      {/* Left Panel - Party */}
      <motion.div 
        className="party-panel-container"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <PartyPanel />
      </motion.div>

      {/* Center - Main Scene */}
      <div className="main-scene-container">
        <SceneRenderer />
        {children}
      </div>

      {/* Right Panel - Interactions */}
      <motion.div 
        className="interaction-panel-container"
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <InteractionPanel />
      </motion.div>
    </div>
  );
};
```

#### components/campaign/SceneRenderer.tsx
```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStore } from '../../stores/campaignStore';
import { NPC } from '../../types/campaign';

export const SceneRenderer: React.FC = () => {
  const { currentScene } = useCampaignStore();

  if (!currentScene) {
    return (
      <div className="scene-renderer empty">
        <p>No scene loaded</p>
      </div>
    );
  }

  return (
    <div className="scene-renderer">
      {/* Background Image */}
      <div 
        className="scene-background"
        style={{
          backgroundImage: `url(/assets/images/scenes/${currentScene.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Scene Title */}
      <motion.div 
        className="scene-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>{currentScene.title}</h2>
        <p>{currentScene.description}</p>
      </motion.div>

      {/* Interactive Elements */}
      <AnimatePresence>
        {currentScene.npcs?.map(npc => (
          <NPCMarker key={npc.id} npc={npc} />
        ))}
        
        {currentScene.encounters?.map(encounter => (
          <EncounterMarker key={encounter.id} encounter={encounter} />
        ))}
        
        {currentScene.transitions?.map(transition => (
          <TransitionPortal key={transition.to} transition={transition} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NPCMarker: React.FC<{ npc: NPC }> = ({ npc }) => {
  const handleNPCInteraction = () => {
    // TODO: Open dialogue interface
    console.log(`Interacting with ${npc.name}`);
  };

  return (
    <motion.div
      className="npc-marker"
      style={{
        left: `${npc.position.x}%`,
        top: `${npc.position.y}%`
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={handleNPCInteraction}
    >
      <img src={`/assets/images/npcs/${npc.sprite}`} alt={npc.name} />
      <div className="npc-nameplate">{npc.name}</div>
    </motion.div>
  );
};

const EncounterMarker: React.FC<{ encounter: any }> = ({ encounter }) => {
  const handleEncounter = () => {
    console.log(`Triggering encounter: ${encounter.id}`);
  };

  return (
    <motion.div
      className="encounter-marker"
      style={{
        left: `${encounter.position.x}%`,
        top: `${encounter.position.y}%`
      }}
      whileHover={{ scale: 1.05 }}
      onClick={handleEncounter}
    >
      <div className="encounter-icon">!</div>
    </motion.div>
  );
};

const TransitionPortal: React.FC<{ transition: any }> = ({ transition }) => {
  const { transitionToScene } = useCampaignStore();

  const handleTransition = () => {
    transitionToScene(transition.to);
  };

  return (
    <motion.div
      className="transition-portal"
      style={{
        left: `${transition.position.x}%`,
        top: `${transition.position.y}%`
      }}
      whileHover={{ scale: 1.05 }}
      onClick={handleTransition}
    >
      <div className="portal-icon">→</div>
      <div className="portal-label">{transition.label}</div>
    </motion.div>
  );
};
```

### 4. Main App Component

#### App.tsx
```tsx
import React, { useEffect, useState } from 'react';
import { CampaignLoader } from './components/campaign/CampaignLoader';
import { SplitScreenLayout } from './components/layout/SplitScreenLayout';
import { useCampaignStore } from './stores/campaignStore';
import './App.css';

function App() {
  const [showCampaignLoader, setShowCampaignLoader] = useState(true);
  const { currentCampaign, loadProgress } = useCampaignStore();

  useEffect(() => {
    // Try to load saved progress on app start
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    // Hide campaign loader when a campaign is loaded
    if (currentCampaign) {
      setShowCampaignLoader(false);
    }
  }, [currentCampaign]);

  const handleCampaignLoaded = () => {
    setShowCampaignLoader(false);
  };

  const handleBackToCampaigns = () => {
    setShowCampaignLoader(true);
  };

  return (
    <div className="App">
      {showCampaignLoader ? (
        <CampaignLoader onCampaignLoaded={handleCampaignLoaded} />
      ) : (
        <SplitScreenLayout>
          <button 
            className="back-button"
            onClick={handleBackToCampaigns}
          >
            ← Back to Campaigns
          </button>
        </SplitScreenLayout>
      )}
    </div>
  );
}

export default App;
```

### 5. CSS Styling Foundation

#### App.css
```css
/* Base styles for D&D Campaign Game */
.App {
  height: 100vh;
  width: 100vw;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #f0f0f0;
}

/* Campaign Loader Styles */
.campaign-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
}

.campaign-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin-top: 2rem;
}

.campaign-card {
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  border: 2px solid #8B0000;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.campaign-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(139, 0, 0, 0.3);
}

/* Split Screen Layout */
.split-screen-layout {
  display: grid;
  grid-template-columns: 300px 1fr 400px;
  height: 100vh;
  gap: 1rem;
}

.party-panel-container {
  background: linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%);
  border-right: 2px solid #3B82F6;
  padding: 1rem;
}

.main-scene-container {
  position: relative;
  overflow: hidden;
  background: #000;
}

.interaction-panel-container {
  background: linear-gradient(180deg, #374151 0%, #4B5563 100%);
  border-left: 2px solid #6B7280;
  padding: 1rem;
}

/* Scene Renderer */
.scene-renderer {
  position: relative;
  width: 100%;
  height: 100%;
}

.scene-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.scene-title {
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 8px;
  z-index: 10;
}

.scene-title h2 {
  margin: 0 0 0.5rem 0;
  color: #FFD700;
  font-family: 'Cinzel', serif;
}

.scene-title p {
  margin: 0;
  color: #f0f0f0;
  font-size: 0.9rem;
}

/* Interactive Elements */
.npc-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 5;
}

.npc-marker img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid #FFD700;
}

.npc-nameplate {
  background: rgba(0, 0, 0, 0.8);
  color: #FFD700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.25rem;
}

.encounter-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #DC2626 0%, #7F1D1D 100%);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
}

.encounter-icon {
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.transition-portal {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 5;
  text-align: center;
}

.portal-icon {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #10B981 0%, #047857 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.portal-label {
  background: rgba(0, 0, 0, 0.8);
  color: #10B981;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 0, 0, 0.4);
}

.back-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: #f0f0f0;
  border: 1px solid #6B7280;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  z-index: 20;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: #9CA3AF;
}

/* Loading States */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #374151;
  border-top: 4px solid #8B0000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error States */
.error {
  color: #EF4444;
  text-align: center;
}

.error h3 {
  color: #DC2626;
  margin-bottom: 1rem;
}
```

## 🚀 Implementation Order

1. **Set up React project** with the commands from `project-setup-guide.md`
2. **Create the TypeScript files** above in the correct folders
3. **Add the sample JSON campaigns** to `/public/data/campaigns/`
4. **Generate images** using the ChatGPT prompts and place in `/public/assets/images/`
5. **Test the basic campaign loader** and scene rendering
6. **Iterate and expand** functionality

This foundation gives you a fully functional campaign system that can load JSON-defined campaigns, render scenes with interactive elements, and manage game state. Once this is working, we can move into the utility phase with animations and advanced features! 