import React from 'react';
import { motion } from 'framer-motion';
import { PartyPanel } from './PartyPanel';
import { InteractionPanel } from './InteractionPanel';
import { SceneRenderer } from '../campaign/SceneRenderer';

interface SplitScreenLayoutProps {
  children?: React.ReactNode;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({ children }) => {
  return (
    <div className="split-screen-layout">
      {/* Left Panel - Party */}
      <motion.div 
        className="party-panel-container"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <PartyPanel />
      </motion.div>

      {/* Center - Main Scene */}
      <div className="main-scene-container">
        <SceneRenderer />
        {children}
      </div>

      {/* Right Panel - Interactions */}
      <motion.div 
        className="interaction-panel-container"
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <InteractionPanel />
      </motion.div>
    </div>
  );
}; 