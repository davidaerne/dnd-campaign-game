import React from 'react';

export const PartyPanel: React.FC = () => {
  return (
    <div className="party-panel">
      <h3>Party</h3>
      <div className="party-members">
        <div className="party-member">
          <h4>Hero</h4>
          <div className="stats">
            <div>HP: 25/25</div>
            <div>AC: 16</div>
            <div>Level: 2</div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <button className="action-btn">Rest</button>
        <button className="action-btn">Inventory</button>
        <button className="action-btn">Character Sheet</button>
      </div>
    </div>
  );
}; 