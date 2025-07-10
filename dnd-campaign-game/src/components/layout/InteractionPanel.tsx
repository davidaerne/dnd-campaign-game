import React from 'react';

export const InteractionPanel: React.FC = () => {
  return (
    <div className="interaction-panel">
      <h3>Interactions</h3>
      <div className="interaction-content">
        <p>Click on NPCs, encounters, or transitions in the scene to interact with them.</p>
        
        <div className="recent-actions">
          <h4>Recent Actions</h4>
          <div className="action-log">
            <div className="log-entry">Game started</div>
          </div>
        </div>
        
        <div className="available-actions">
          <h4>Available Actions</h4>
          <button className="action-btn">Look Around</button>
          <button className="action-btn">Search</button>
          <button className="action-btn">Wait</button>
        </div>
      </div>
    </div>
  );
}; 