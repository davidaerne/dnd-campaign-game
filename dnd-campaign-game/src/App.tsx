import React, { useState } from 'react';
import './App.css';
import { CampaignLoader } from './components/campaign/CampaignLoader';
import { SplitScreenLayout } from './components/layout/SplitScreenLayout';
import ImageGenerationManager from './components/tools/ImageGenerationManager';
import { useCampaignStore } from './stores/campaignStore';

type AppMode = 'campaign' | 'image-generator';

function App() {
  const [mode, setMode] = useState<AppMode>('campaign');
  const { currentCampaign, resetCampaign } = useCampaignStore();

  const handleBackToMenu = () => {
    resetCampaign();
  };

  const NavigationHeader = () => (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-amber-400">D&D Campaign Studio</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('campaign')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'campaign' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎲 Campaign Game
            </button>
            <button
              onClick={() => setMode('image-generator')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'image-generator' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎨 Image Generator
            </button>
          </div>
        </div>
        {mode === 'campaign' && currentCampaign && (
          <button
            onClick={handleBackToMenu}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Back to Menu
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="App min-h-screen bg-gray-900">
      <NavigationHeader />
      
      {mode === 'campaign' ? (
        <div className="campaign-content">
          {!currentCampaign ? (
            <CampaignLoader />
          ) : (
            <SplitScreenLayout />
          )}
        </div>
      ) : (
        <ImageGenerationManager />
      )}
    </div>
  );
}

export default App;
