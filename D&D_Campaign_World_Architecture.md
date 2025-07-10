# D&D Campaign World Architecture Document

## 🌍 Expanded Game Vision

### Campaign-Driven Gameplay
A comprehensive D&D campaign simulator featuring:
- **One-shot Campaign System**: Complete adventures with multiple levels/scenes
- **Dynamic World Loading**: JSON-driven world definitions and content
- **Split-Screen Interface**: Characters (left) vs Interactions (right)
- **Multi-Modal Interactions**: Combat, NPC dialogue, shopping, exploration
- **Progressive Storytelling**: Level-by-level campaign progression
- **Scalable Content System**: Easy expansion through JSON configuration

## 🏗️ Enhanced Technical Architecture

### Core System Components

```
Campaign System Architecture
├── 🌟 Campaign Manager
│   ├── Scene Loader & Transition
│   ├── Progress Tracking
│   ├── Save/Load States
│   └── Dynamic Content Loading
├── 🎭 Interaction Engine
│   ├── Combat System
│   ├── NPC Dialogue Trees
│   ├── Shop/Trading Mechanics
│   └── Exploration Events
├── 🎨 Dynamic Scene Renderer
│   ├── Background Board System
│   ├── Card Placement Engine
│   ├── Animation Orchestrator
│   └── UI Layout Manager
└── 📚 Content Management
    ├── JSON World Definitions
    ├── Asset Loading System
    ├── Localization Support
    └── Mod/Expansion Support
```

## 🎮 Campaign System Design

### JSON World Definition Schema

```javascript
// campaign.json - One-shot campaign definition
{
  "campaignId": "goblin_cave_rescue",
  "title": "The Goblin Cave Rescue",
  "description": "A classic rescue mission in dangerous goblin territory",
  "difficulty": "beginner",
  "estimatedDuration": "2-3 hours",
  "playerLevels": [1, 3],
  
  "scenes": [
    {
      "id": "village_start",
      "type": "town",
      "title": "Willowbrook Village",
      "background": "village_tavern.jpg",
      "music": "peaceful_village.mp3",
      "description": "A quiet village where your adventure begins...",
      
      "npcs": [
        {
          "id": "tavern_keeper",
          "name": "Marcus the Innkeeper",
          "position": { "x": 60, "y": 40 },
          "sprite": "innkeeper.png",
          "dialogue": {
            "greeting": "Welcome travelers! Have you heard about the missing children?",
            "questGiver": true,
            "shop": {
              "type": "general_goods",
              "inventory": ["healing_potion", "rope", "torch"]
            }
          }
        }
      ],
      
      "transitions": [
        {
          "to": "forest_path",
          "trigger": "quest_accepted",
          "position": { "x": 90, "y": 70 },
          "label": "Head to Darkwood Forest"
        }
      ]
    },
    
    {
      "id": "forest_path",
      "type": "exploration",
      "title": "Darkwood Forest Path",
      "background": "dark_forest.jpg",
      "music": "mysterious_forest.mp3",
      
      "encounters": [
        {
          "id": "goblin_ambush",
          "type": "combat",
          "triggerChance": 0.7,
          "position": { "x": 50, "y": 50 },
          "enemies": [
            { "type": "goblin_warrior", "count": 2 },
            { "type": "goblin_archer", "count": 1 }
          ]
        },
        {
          "id": "mysterious_merchant",
          "type": "npc",
          "triggerChance": 0.3,
          "position": { "x": 30, "y": 60 },
          "npc": {
            "name": "Wandering Merchant",
            "dialogue": "Dangerous paths ahead, friend. Perhaps some supplies?",
            "shop": {
              "type": "magical_items",
              "inventory": ["magic_sword", "protection_amulet"]
            }
          }
        }
      ],
      
      "transitions": [
        {
          "to": "goblin_cave_entrance",
          "trigger": "area_explored",
          "position": { "x": 80, "y": 30 }
        }
      ]
    },
    
    {
      "id": "goblin_cave_entrance",
      "type": "dungeon_entrance",
      "title": "Cave Entrance",
      "background": "cave_entrance.jpg",
      "music": "ominous_cave.mp3",
      
      "interactions": [
        {
          "type": "skill_check",
          "skill": "investigation",
          "dc": 12,
          "success": "You notice goblin tracks and a hidden entrance",
          "failure": "The cave seems ordinary, but menacing"
        }
      ]
    }
  ],
  
  "globalData": {
    "questItems": ["village_letter", "rescue_reward"],
    "partyLevel": 1,
    "availableActions": ["combat", "dialogue", "exploration", "trading"]
  }
}
```

### Scene Types & Interaction Models

```javascript
// Scene type definitions
const sceneTypes = {
  town: {
    defaultLayout: 'split_screen',
    interactions: ['npc_dialogue', 'shopping', 'resting'],
    backgroundMusic: 'peaceful',
    allowedActions: ['talk', 'trade', 'rest', 'travel']
  },
  
  exploration: {
    defaultLayout: 'exploration_view',
    interactions: ['random_encounters', 'discovery', 'skill_checks'],
    backgroundMusic: 'ambient',
    allowedActions: ['move', 'search', 'camp', 'use_item']
  },
  
  combat: {
    defaultLayout: 'battle_screen',
    interactions: ['turn_based_combat'],
    backgroundMusic: 'battle',
    allowedActions: ['attack', 'defend', 'spell', 'item', 'flee']
  },
  
  dungeon: {
    defaultLayout: 'dungeon_crawler',
    interactions: ['combat', 'traps', 'treasure', 'puzzles'],
    backgroundMusic: 'dungeon',
    allowedActions: ['combat_actions', 'investigation', 'disable_device']
  }
};
```

## 🎨 Dynamic Background & Card Placement System

### Background Board Component

```jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@pixi/react';

const DynamicSceneBoard = ({ scene, activeInteractions }) => {
  return (
    <div className="scene-container">
      {/* Background Layer */}
      <div 
        className="scene-background"
        style={{
          backgroundImage: `url(/scenes/${scene.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Ambient Animation Layer */}
        <Canvas>
          <AmbientEffects scene={scene} />
        </Canvas>
        
        {/* Interactive Elements Layer */}
        <AnimatePresence>
          {scene.npcs?.map(npc => (
            <motion.div
              key={npc.id}
              className="npc-marker"
              style={{
                left: `${npc.position.x}%`,
                top: `${npc.position.y}%`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleNPCInteraction(npc)}
            >
              <img src={`/npcs/${npc.sprite}`} alt={npc.name} />
              <div className="npc-nameplate">{npc.name}</div>
            </motion.div>
          ))}
          
          {scene.encounters?.map(encounter => (
            <EncounterMarker 
              key={encounter.id} 
              encounter={encounter}
              onTrigger={handleEncounter}
            />
          ))}
          
          {scene.transitions?.map(transition => (
            <TransitionPortal
              key={transition.to}
              transition={transition}
              onTransition={handleSceneTransition}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
```

### Split-Screen Layout System

```jsx
const GameplayLayout = ({ currentScene, activeInteraction }) => {
  return (
    <div className="gameplay-container">
      {/* Left Side - Party/Characters */}
      <motion.div 
        className="party-panel"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <PartyDisplay />
        <CharacterActions />
        <InventoryQuickAccess />
      </motion.div>
      
      {/* Center - Main Scene */}
      <div className="main-scene">
        <DynamicSceneBoard scene={currentScene} />
        <SceneUI scene={currentScene} />
      </div>
      
      {/* Right Side - Active Interaction */}
      <motion.div 
        className="interaction-panel"
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <AnimatePresence mode="wait">
          {activeInteraction?.type === 'combat' && (
            <CombatInterface key="combat" />
          )}
          {activeInteraction?.type === 'dialogue' && (
            <DialogueInterface key="dialogue" npc={activeInteraction.npc} />
          )}
          {activeInteraction?.type === 'shop' && (
            <ShopInterface key="shop" shop={activeInteraction.shop} />
          )}
          {activeInteraction?.type === 'exploration' && (
            <ExplorationInterface key="exploration" />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
```

## 🎭 NPC & Interaction System

### Dialogue System

```javascript
class DialogueManager {
  constructor() {
    this.currentDialogue = null;
    this.conversationHistory = [];
    this.relationshipTracker = new Map();
  }

  startConversation(npc, context = {}) {
    this.currentDialogue = {
      npc,
      context,
      currentNode: npc.dialogue.entry || 'greeting',
      availableChoices: this.getAvailableChoices(npc, context)
    };
    
    return this.getCurrentDialogueState();
  }

  makeChoice(choiceId) {
    const choice = this.currentDialogue.availableChoices.find(c => c.id === choiceId);
    if (!choice) return null;

    // Update relationship if needed
    if (choice.relationshipChange) {
      this.updateRelationship(this.currentDialogue.npc.id, choice.relationshipChange);
    }

    // Trigger consequences
    if (choice.consequences) {
      this.processConsequences(choice.consequences);
    }

    // Move to next dialogue node
    this.currentDialogue.currentNode = choice.nextNode;
    this.currentDialogue.availableChoices = this.getAvailableChoices(
      this.currentDialogue.npc, 
      this.currentDialogue.context
    );

    return this.getCurrentDialogueState();
  }
}
```

### Shop System

```jsx
const ShopInterface = ({ shop, onPurchase, onSell }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);

  return (
    <motion.div 
      className="shop-interface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="shop-header">
        <h2>{shop.name || 'General Store'}</h2>
        <div className="shop-type">{shop.type}</div>
      </div>

      <div className="shop-inventory">
        {shop.inventory.map(item => (
          <motion.div
            key={item.id}
            className="shop-item"
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedItem(item)}
          >
            <img src={`/items/${item.icon}`} alt={item.name} />
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-price">{item.price} gp</p>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem}
          onPurchase={() => handlePurchase(selectedItem)}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </motion.div>
  );
};
```

## 🎬 Animation System & Utilities

### Subtle Animation Framework

```javascript
// Animation utility system
class AnimationOrchestrator {
  constructor() {
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.settings = {
      subtlety: 'medium', // low, medium, high
      performance: 'auto' // low, medium, high, auto
    };
  }

  // Ambient scene animations
  createAmbientEffects(sceneType) {
    const effects = {
      town: [
        { type: 'floating_particles', intensity: 0.2, color: '#FFD700' },
        { type: 'gentle_sway', targets: '.npc-marker', amplitude: 2 }
      ],
      forest: [
        { type: 'wind_effect', intensity: 0.3 },
        { type: 'leaf_particles', density: 0.1 },
        { type: 'light_filtering', opacity: 0.6 }
      ],
      dungeon: [
        { type: 'torch_flicker', targets: '.light-source' },
        { type: 'mysterious_fog', opacity: 0.15 },
        { type: 'echo_distortion', audio: true }
      ]
    };

    return effects[sceneType] || [];
  }

  // Card interaction animations
  animateCardInteraction(card, type) {
    const animations = {
      hover: {
        scale: 1.05,
        rotateY: 5,
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        transition: { duration: 0.2 }
      },
      play: {
        scale: [1, 1.2, 0],
        rotateY: [0, 180, 360],
        transition: { duration: 0.6, ease: "easeInOut" }
      },
      draw: {
        scale: [0, 1.1, 1],
        opacity: [0, 0.8, 1],
        y: [50, -10, 0],
        transition: { duration: 0.4, ease: "backOut" }
      }
    };

    return animations[type];
  }
}
```

### Animation Builder Utility

```jsx
// Utility component for building custom animations
const AnimationBuilder = () => {
  const [animationConfig, setAnimationConfig] = useState({
    type: 'card_entrance',
    duration: 0.5,
    easing: 'easeInOut',
    properties: {
      scale: { from: 0, to: 1 },
      opacity: { from: 0, to: 1 },
      rotation: { from: -10, to: 0 }
    }
  });

  const previewAnimation = () => {
    // Live preview of animation
  };

  const exportAnimation = () => {
    // Export as JSON for use in game
    return JSON.stringify(animationConfig, null, 2);
  };

  return (
    <div className="animation-builder">
      <div className="animation-controls">
        <AnimationTimeline config={animationConfig} />
        <PropertyEditor 
          properties={animationConfig.properties}
          onChange={updateProperties}
        />
      </div>
      <div className="animation-preview">
        <motion.div 
          className="preview-card"
          animate={animationConfig.properties}
          transition={{
            duration: animationConfig.duration,
            ease: animationConfig.easing
          }}
        >
          Preview Card
        </motion.div>
      </div>
    </div>
  );
};
```

## 🗂️ Content Management System

### Campaign Loader

```javascript
class CampaignManager {
  constructor() {
    this.currentCampaign = null;
    this.currentScene = null;
    this.campaignProgress = {
      completedScenes: [],
      partyState: {},
      worldState: {},
      questProgress: {}
    };
  }

  async loadCampaign(campaignId) {
    try {
      const campaignData = await fetch(`/campaigns/${campaignId}.json`);
      this.currentCampaign = await campaignData.json();
      
      // Load initial scene
      await this.transitionToScene(this.currentCampaign.scenes[0].id);
      
      return this.currentCampaign;
    } catch (error) {
      console.error('Failed to load campaign:', error);
      throw new Error(`Campaign ${campaignId} not found`);
    }
  }

  async transitionToScene(sceneId) {
    const scene = this.currentCampaign.scenes.find(s => s.id === sceneId);
    if (!scene) throw new Error(`Scene ${sceneId} not found`);

    // Pre-load scene assets
    await this.preloadSceneAssets(scene);
    
    // Update current scene
    this.currentScene = scene;
    
    // Trigger scene transition animation
    this.triggerSceneTransition(scene);
    
    return scene;
  }

  async preloadSceneAssets(scene) {
    const assets = [
      scene.background,
      scene.music,
      ...scene.npcs?.map(npc => npc.sprite) || [],
      ...scene.encounters?.map(enc => enc.sprite) || []
    ];

    return Promise.all(
      assets.map(asset => this.preloadAsset(asset))
    );
  }
}
```

### Expansion Pack System

```javascript
// Support for modular content expansion
const expansionSystem = {
  async loadExpansion(expansionId) {
    const expansion = await fetch(`/expansions/${expansionId}/manifest.json`);
    const expansionData = await expansion.json();
    
    // Merge new content with existing
    this.mergeContent(expansionData);
    
    return expansionData;
  },

  mergeContent(newContent) {
    // Add new campaigns
    if (newContent.campaigns) {
      this.availableCampaigns.push(...newContent.campaigns);
    }
    
    // Add new card types
    if (newContent.cardTypes) {
      this.cardRegistry.merge(newContent.cardTypes);
    }
    
    // Add new NPCs
    if (newContent.npcs) {
      this.npcRegistry.merge(newContent.npcs);
    }
  }
};
```

## 🚀 Enhanced Development Roadmap

### Phase 1: Campaign Foundation (Weeks 1-4)
- [ ] Scene loading and transition system
- [ ] JSON campaign parser
- [ ] Basic split-screen layout
- [ ] Dynamic background system
- [ ] Simple NPC interaction

### Phase 2: Interaction Systems (Weeks 5-8)
- [ ] Dialogue tree system
- [ ] Shop/trading mechanics
- [ ] Combat integration with scenes
- [ ] Skill check and exploration events
- [ ] Save/load campaign progress

### Phase 3: Animation & Polish (Weeks 9-10)
- [ ] Ambient scene animations
- [ ] Card interaction animations
- [ ] Scene transition effects
- [ ] Animation builder utility
- [ ] Performance optimization

### Phase 4: Content Tools & Expansion (Weeks 11-12)
- [ ] Campaign editor tool
- [ ] Animation builder standalone app
- [ ] Expansion pack system
- [ ] Community content support
- [ ] Documentation and tutorials

This architecture supports your vision of a scalable, JSON-driven D&D campaign system with rich interactions, subtle animations, and room for significant growth! 