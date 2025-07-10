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
