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