import { create } from 'zustand';
import { Campaign, Scene } from '../types/campaign';
import { GameState } from '../types/game';

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
      completedScenes: gameState.currentScene 
        ? [...gameState.campaignProgress.completedScenes, gameState.currentScene]
        : gameState.campaignProgress.completedScenes
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