import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCampaignStore } from '../../stores/campaignStore';
import { NPC, Encounter, Transition } from '../../types/campaign';

export const SceneRenderer: React.FC = () => {
  const { currentScene } = useCampaignStore();

  if (!currentScene) {
    return (
      <div className="scene-renderer empty">
        <p>No scene loaded</p>
      </div>
    );
  }

  return (
    <div className="scene-renderer">
      {/* Background Image */}
      <div 
        className="scene-background"
        style={{
          backgroundImage: `url(/assets/images/scenes/${currentScene.background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Scene Title */}
      <motion.div 
        className="scene-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>{currentScene.title}</h2>
        <p>{currentScene.description}</p>
      </motion.div>

      {/* Interactive Elements */}
      <AnimatePresence>
        {currentScene.npcs?.map(npc => (
          <NPCMarker key={npc.id} npc={npc} />
        ))}
        
        {currentScene.encounters?.map(encounter => (
          <EncounterMarker key={encounter.id} encounter={encounter} />
        ))}
        
        {currentScene.transitions?.map(transition => (
          <TransitionPortal key={transition.to} transition={transition} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NPCMarker: React.FC<{ npc: NPC }> = ({ npc }) => {
  const handleNPCInteraction = () => {
    // TODO: Open dialogue interface
    console.log(`Interacting with ${npc.name}`);
  };

  return (
    <motion.div
      className="npc-marker"
      style={{
        left: `${npc.position.x}%`,
        top: `${npc.position.y}%`
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      onClick={handleNPCInteraction}
    >
      <img src={`/assets/images/npcs/${npc.sprite}`} alt={npc.name} />
      <div className="npc-nameplate">{npc.name}</div>
    </motion.div>
  );
};

const EncounterMarker: React.FC<{ encounter: Encounter }> = ({ encounter }) => {
  const handleEncounter = () => {
    console.log(`Triggering encounter: ${encounter.id}`);
  };

  return (
    <motion.div
      className="encounter-marker"
      style={{
        left: `${encounter.position.x}%`,
        top: `${encounter.position.y}%`
      }}
      whileHover={{ scale: 1.05 }}
      onClick={handleEncounter}
    >
      <div className="encounter-icon">!</div>
    </motion.div>
  );
};

const TransitionPortal: React.FC<{ transition: Transition }> = ({ transition }) => {
  const { transitionToScene } = useCampaignStore();

  const handleTransition = () => {
    transitionToScene(transition.to);
  };

  return (
    <motion.div
      className="transition-portal"
      style={{
        left: `${transition.position.x}%`,
        top: `${transition.position.y}%`
      }}
      whileHover={{ scale: 1.05 }}
      onClick={handleTransition}
    >
      <div className="portal-icon">→</div>
      <div className="portal-label">{transition.label}</div>
    </motion.div>
  );
}; 