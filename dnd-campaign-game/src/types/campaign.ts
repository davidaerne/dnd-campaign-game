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