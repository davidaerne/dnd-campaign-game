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