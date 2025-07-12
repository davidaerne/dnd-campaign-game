import React, { useState } from 'react';
import './App.css';
import { CampaignLoader } from './components/campaign/CampaignLoader';
import { SplitScreenLayout } from './components/layout/SplitScreenLayout';
import ImageGenerationManager from './components/tools/ImageGenerationManager';
import TestCardViewer from './components/tools/TestCardViewer';
import { useCampaignStore } from './stores/campaignStore';

type AppMode = 'campaign' | 'image-generator' | 'test-cards';

function App() {
  const [mode, setMode] = useState<AppMode>('campaign');
  const { currentCampaign, resetCampaign } = useCampaignStore();

  const handleBackToMenu = () => {
    resetCampaign();
  };

  const NavigationHeader = () => (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-amber-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🐉</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-400">D&D Campaign Studio</h1>
                <p className="text-sm text-gray-400">Create • Generate • Adventure</p>
              </div>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setMode('campaign')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                mode === 'campaign' 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <span className="text-xl">🎲</span>
              <span>Campaign</span>
            </button>
            
            <button
              onClick={() => setMode('image-generator')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                mode === 'image-generator' 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <span className="text-xl">🎨</span>
              <span>AI Generator</span>
            </button>
            
            <button
              onClick={() => setMode('test-cards')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                mode === 'test-cards' 
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              <span className="text-xl">🃏</span>
              <span>Test Cards</span>
            </button>
          </nav>

          {mode === 'campaign' && currentCampaign && (
            <button
              onClick={handleBackToMenu}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              ← Back to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const MainContent = () => {
    switch (mode) {
      case 'campaign':
        return (
          <div className="campaign-content">
            {!currentCampaign ? (
              <CampaignLoader />
            ) : (
              <SplitScreenLayout />
            )}
          </div>
        );
      
      case 'image-generator':
        return <ImageGenerationManager />;
      
      case 'test-cards':
        return <TestCardViewer />;
      
      default:
        return <CampaignLoader />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-900">
      <NavigationHeader />
      <MainContent />
    </div>
  );
}

export default App;
