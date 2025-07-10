# Animation Builder Utilities & Tools

## 🎬 Animation System Overview

### Philosophy: Subtle Immersion
The animation system focuses on **subtle enhancement** rather than flashy effects:
- **Ambient Atmospherics**: Gentle environmental animations that set mood
- **Responsive Interactions**: Smooth feedback for user actions
- **Contextual Effects**: Animations that support storytelling
- **Performance First**: Optimized for smooth gameplay across devices

## 🛠️ Animation Builder Tool Architecture

### Standalone Animation Builder App

```bash
# Separate utility app structure
animation-builder/
├── public/
│   ├── preview-assets/
│   ├── templates/
│   └── exports/
├── src/
│   ├── components/
│   │   ├── timeline/
│   │   ├── property-editor/
│   │   ├── preview/
│   │   └── export/
│   ├── hooks/
│   ├── utils/
│   └── presets/
└── package.json
```

### Core Animation Builder Component

```jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timeline } from './Timeline';
import { PropertyEditor } from './PropertyEditor';
import { PreviewCanvas } from './PreviewCanvas';
import { ExportManager } from './ExportManager';

const AnimationBuilder = () => {
  const [currentAnimation, setCurrentAnimation] = useState({
    name: 'New Animation',
    type: 'card_interaction',
    duration: 1.0,
    easing: 'easeInOut',
    keyframes: [
      { time: 0, properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 } },
      { time: 1, properties: { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 } }
    ],
    metadata: {
      category: 'ui',
      tags: ['card', 'hover'],
      description: 'Basic card interaction animation'
    }
  });

  const [selectedKeyframe, setSelectedKeyframe] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  return (
    <div className="animation-builder">
      {/* Header */}
      <div className="builder-header">
        <h1>D&D Animation Builder</h1>
        <div className="animation-info">
          <input 
            value={currentAnimation.name}
            onChange={(e) => updateAnimationName(e.target.value)}
            className="animation-name"
          />
          <select 
            value={currentAnimation.type}
            onChange={(e) => updateAnimationType(e.target.value)}
          >
            <option value="card_interaction">Card Interaction</option>
            <option value="scene_transition">Scene Transition</option>
            <option value="ambient_effect">Ambient Effect</option>
            <option value="combat_effect">Combat Effect</option>
            <option value="ui_feedback">UI Feedback</option>
          </select>
        </div>
      </div>

      <div className="builder-workspace">
        {/* Left Panel - Property Editor */}
        <div className="property-panel">
          <PropertyEditor 
            keyframe={currentAnimation.keyframes[selectedKeyframe]}
            onChange={(properties) => updateKeyframe(selectedKeyframe, properties)}
          />
          <AnimationPresets onSelect={loadPreset} />
        </div>

        {/* Center Panel - Preview */}
        <div className="preview-panel">
          <PreviewCanvas 
            animation={currentAnimation}
            isPlaying={isPlaying}
            onTimeUpdate={setSelectedKeyframe}
          />
          <div className="preview-controls">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={resetAnimation}>Reset</button>
            <button onClick={addKeyframe}>Add Keyframe</button>
          </div>
        </div>

        {/* Right Panel - Export */}
        <div className="export-panel">
          <Timeline 
            animation={currentAnimation}
            selectedKeyframe={selectedKeyframe}
            onKeyframeSelect={setSelectedKeyframe}
            onKeyframeAdd={addKeyframe}
            onKeyframeDelete={deleteKeyframe}
          />
          <ExportManager 
            animation={currentAnimation}
            format={exportFormat}
            onFormatChange={setExportFormat}
          />
        </div>
      </div>
    </div>
  );
};
```

### Property Editor Component

```jsx
const PropertyEditor = ({ keyframe, onChange }) => {
  const [activeProperty, setActiveProperty] = useState('transform');

  const propertyGroups = {
    transform: ['x', 'y', 'scale', 'rotation', 'skewX', 'skewY'],
    appearance: ['opacity', 'backgroundColor', 'borderRadius'],
    filters: ['blur', 'brightness', 'contrast', 'saturate'],
    custom: ['boxShadow', 'textShadow', 'borderColor']
  };

  return (
    <div className="property-editor">
      <div className="property-tabs">
        {Object.keys(propertyGroups).map(group => (
          <button
            key={group}
            className={`tab ${activeProperty === group ? 'active' : ''}`}
            onClick={() => setActiveProperty(group)}
          >
            {group.charAt(0).toUpperCase() + group.slice(1)}
          </button>
        ))}
      </div>

      <div className="property-controls">
        {propertyGroups[activeProperty].map(property => (
          <PropertyControl
            key={property}
            property={property}
            value={keyframe.properties[property]}
            onChange={(value) => onChange({
              ...keyframe.properties,
              [property]: value
            })}
          />
        ))}
      </div>

      <div className="easing-controls">
        <label>Easing:</label>
        <EasingSelector 
          value={keyframe.easing}
          onChange={(easing) => onChange({
            ...keyframe.properties,
            easing
          })}
        />
      </div>
    </div>
  );
};

const PropertyControl = ({ property, value, onChange }) => {
  const getControlType = (prop) => {
    const numericProps = ['x', 'y', 'scale', 'rotation', 'opacity', 'blur'];
    const colorProps = ['backgroundColor', 'borderColor'];
    
    if (numericProps.includes(prop)) return 'number';
    if (colorProps.includes(prop)) return 'color';
    return 'text';
  };

  const controlType = getControlType(property);

  return (
    <div className="property-control">
      <label>{property}:</label>
      {controlType === 'number' && (
        <div className="number-control">
          <input
            type="range"
            min={property === 'opacity' ? 0 : -100}
            max={property === 'opacity' ? 1 : 100}
            step={property === 'opacity' ? 0.01 : 1}
            value={value || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
          />
          <input
            type="number"
            value={value || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="number-input"
          />
        </div>
      )}
      {controlType === 'color' && (
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};
```

### Animation Presets Library

```javascript
// Animation presets for common D&D game interactions
const animationPresets = {
  // Card Animations
  cardHover: {
    name: 'Card Hover Effect',
    type: 'card_interaction',
    duration: 0.2,
    keyframes: [
      { time: 0, properties: { scale: 1, y: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' } },
      { time: 1, properties: { scale: 1.05, y: -5, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' } }
    ],
    easing: 'easeOut'
  },

  cardPlay: {
    name: 'Card Play Animation',
    type: 'card_interaction',
    duration: 0.6,
    keyframes: [
      { time: 0, properties: { scale: 1, rotation: 0, opacity: 1 } },
      { time: 0.3, properties: { scale: 1.2, rotation: 5, opacity: 0.8 } },
      { time: 1, properties: { scale: 0, rotation: 180, opacity: 0 } }
    ],
    easing: 'easeInOut'
  },

  cardDraw: {
    name: 'Card Draw Animation',
    type: 'card_interaction',
    duration: 0.5,
    keyframes: [
      { time: 0, properties: { scale: 0, y: 100, opacity: 0, rotation: -10 } },
      { time: 0.7, properties: { scale: 1.1, y: -10, opacity: 0.9, rotation: 2 } },
      { time: 1, properties: { scale: 1, y: 0, opacity: 1, rotation: 0 } }
    ],
    easing: 'backOut'
  },

  // Scene Transitions
  sceneSlideIn: {
    name: 'Scene Slide Transition',
    type: 'scene_transition',
    duration: 1.0,
    keyframes: [
      { time: 0, properties: { x: -100, opacity: 0 } },
      { time: 1, properties: { x: 0, opacity: 1 } }
    ],
    easing: 'easeInOut'
  },

  sceneFadeIn: {
    name: 'Scene Fade Transition',
    type: 'scene_transition',
    duration: 0.8,
    keyframes: [
      { time: 0, properties: { opacity: 0, scale: 0.95 } },
      { time: 1, properties: { opacity: 1, scale: 1 } }
    ],
    easing: 'easeOut'
  },

  // Ambient Effects
  gentleFloat: {
    name: 'Gentle Floating',
    type: 'ambient_effect',
    duration: 3.0,
    loop: true,
    keyframes: [
      { time: 0, properties: { y: 0, rotation: 0 } },
      { time: 0.5, properties: { y: -10, rotation: 1 } },
      { time: 1, properties: { y: 0, rotation: 0 } }
    ],
    easing: 'easeInOut'
  },

  magicalGlow: {
    name: 'Magical Glow Effect',
    type: 'ambient_effect',
    duration: 2.0,
    loop: true,
    keyframes: [
      { time: 0, properties: { boxShadow: '0 0 5px rgba(255,215,0,0.3)' } },
      { time: 0.5, properties: { boxShadow: '0 0 20px rgba(255,215,0,0.8)' } },
      { time: 1, properties: { boxShadow: '0 0 5px rgba(255,215,0,0.3)' } }
    ],
    easing: 'easeInOut'
  },

  // Combat Effects
  damageShake: {
    name: 'Damage Shake',
    type: 'combat_effect',
    duration: 0.6,
    keyframes: [
      { time: 0, properties: { x: 0 } },
      { time: 0.1, properties: { x: -10 } },
      { time: 0.2, properties: { x: 10 } },
      { time: 0.3, properties: { x: -8 } },
      { time: 0.4, properties: { x: 8 } },
      { time: 0.5, properties: { x: -4 } },
      { time: 0.6, properties: { x: 4 } },
      { time: 1, properties: { x: 0 } }
    ],
    easing: 'linear'
  },

  healingPulse: {
    name: 'Healing Pulse',
    type: 'combat_effect',
    duration: 1.0,
    keyframes: [
      { time: 0, properties: { scale: 1, opacity: 1, backgroundColor: 'rgba(0,255,0,0)' } },
      { time: 0.3, properties: { scale: 1.1, opacity: 0.8, backgroundColor: 'rgba(0,255,0,0.3)' } },
      { time: 0.6, properties: { scale: 1.05, opacity: 0.9, backgroundColor: 'rgba(0,255,0,0.1)' } },
      { time: 1, properties: { scale: 1, opacity: 1, backgroundColor: 'rgba(0,255,0,0)' } }
    ],
    easing: 'easeOut'
  },

  // UI Feedback
  buttonPress: {
    name: 'Button Press Feedback',
    type: 'ui_feedback',
    duration: 0.15,
    keyframes: [
      { time: 0, properties: { scale: 1 } },
      { time: 0.5, properties: { scale: 0.95 } },
      { time: 1, properties: { scale: 1 } }
    ],
    easing: 'easeInOut'
  }
};
```

### Export Manager

```jsx
const ExportManager = ({ animation, format, onFormatChange }) => {
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    minifyOutput: false,
    includePreview: true
  });

  const exportFormats = {
    json: {
      extension: '.json',
      description: 'JSON format for React/Framer Motion',
      exporter: exportToFramerMotion
    },
    css: {
      extension: '.css',
      description: 'CSS Keyframes',
      exporter: exportToCSSKeyframes
    },
    lottie: {
      extension: '.json',
      description: 'Lottie JSON format',
      exporter: exportToLottie
    },
    preset: {
      extension: '.js',
      description: 'JavaScript preset object',
      exporter: exportToJSPreset
    }
  };

  const handleExport = () => {
    const exporter = exportFormats[format].exporter;
    const exportedData = exporter(animation, exportOptions);
    
    downloadFile(
      exportedData,
      `${animation.name}${exportFormats[format].extension}`,
      format === 'json' ? 'application/json' : 'text/plain'
    );
  };

  return (
    <div className="export-manager">
      <h3>Export Animation</h3>
      
      <div className="export-format">
        <label>Format:</label>
        <select value={format} onChange={(e) => onFormatChange(e.target.value)}>
          {Object.entries(exportFormats).map(([key, config]) => (
            <option key={key} value={key}>
              {config.description}
            </option>
          ))}
        </select>
      </div>

      <div className="export-options">
        <label>
          <input
            type="checkbox"
            checked={exportOptions.includeMetadata}
            onChange={(e) => setExportOptions({
              ...exportOptions,
              includeMetadata: e.target.checked
            })}
          />
          Include Metadata
        </label>
        <label>
          <input
            type="checkbox"
            checked={exportOptions.minifyOutput}
            onChange={(e) => setExportOptions({
              ...exportOptions,
              minifyOutput: e.target.checked
            })}
          />
          Minify Output
        </label>
      </div>

      <button onClick={handleExport} className="export-button">
        Export Animation
      </button>

      <div className="export-preview">
        <h4>Preview:</h4>
        <pre className="code-preview">
          {JSON.stringify(animation, null, 2).substring(0, 300)}...
        </pre>
      </div>
    </div>
  );
};

// Export utility functions
const exportToFramerMotion = (animation, options) => {
  const output = {
    name: animation.name,
    type: animation.type,
    animation: {
      duration: animation.duration,
      ease: animation.easing,
      keyframes: animation.keyframes.reduce((acc, frame) => {
        acc[frame.time] = frame.properties;
        return acc;
      }, {})
    }
  };

  if (options.includeMetadata) {
    output.metadata = animation.metadata;
  }

  return JSON.stringify(output, null, options.minifyOutput ? 0 : 2);
};

const exportToCSSKeyframes = (animation, options) => {
  const keyframeSteps = animation.keyframes.map(frame => {
    const percentage = Math.round(frame.time * 100);
    const properties = Object.entries(frame.properties)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');
    
    return `${percentage}% {\n${properties}\n}`;
  }).join('\n\n');

  return `@keyframes ${animation.name.replace(/\s+/g, '_')} {
${keyframeSteps}
}

.${animation.name.replace(/\s+/g, '-').toLowerCase()} {
  animation: ${animation.name.replace(/\s+/g, '_')} ${animation.duration}s ${animation.easing};
}`;
};
```

## 🚀 Animation Builder Deployment

### Standalone Builder App Setup

```bash
# Create the animation builder as a separate app
npx create-react-app dnd-animation-builder --template typescript
cd dnd-animation-builder

# Install dependencies
npm install framer-motion
npm install react-color react-draggable
npm install @monaco-editor/react  # For code editing
npm install file-saver            # For file downloads

# Optional: Advanced features
npm install three @react-three/fiber  # For 3D preview
npm install lottie-web              # For Lottie export
```

### Integration with Main Game

```javascript
// In the main D&D game, import animations created by the builder
class AnimationLibrary {
  constructor() {
    this.animations = new Map();
    this.loadBuiltAnimations();
  }

  async loadBuiltAnimations() {
    // Load animations created by the builder tool
    const animationFiles = [
      '/animations/card_interactions.json',
      '/animations/scene_transitions.json',
      '/animations/combat_effects.json'
    ];

    for (const file of animationFiles) {
      try {
        const response = await fetch(file);
        const animations = await response.json();
        this.mergeAnimations(animations);
      } catch (error) {
        console.warn(`Failed to load animation file: ${file}`, error);
      }
    }
  }

  getAnimation(name) {
    return this.animations.get(name);
  }

  playAnimation(element, animationName, options = {}) {
    const animation = this.getAnimation(animationName);
    if (!animation) {
      console.warn(`Animation not found: ${animationName}`);
      return;
    }

    // Apply the animation using Framer Motion or CSS
    return this.applyAnimation(element, animation, options);
  }
}

// Usage in game components
const GameCard = ({ card, onPlay }) => {
  const animationLibrary = useAnimationLibrary();

  return (
    <motion.div
      className="game-card"
      onHoverStart={() => animationLibrary.playAnimation('card', 'cardHover')}
      onTap={() => animationLibrary.playAnimation('card', 'cardPlay')}
    >
      {/* Card content */}
    </motion.div>
  );
};
```

This animation builder system provides you with:

1. **Standalone Animation Builder**: A separate app for creating and testing animations
2. **Visual Timeline Editor**: Drag-and-drop keyframe editing
3. **Real-time Preview**: See animations as you build them
4. **Multiple Export Formats**: JSON, CSS, Lottie compatibility
5. **Preset Library**: Common D&D game animations ready to use
6. **Integration System**: Easy importing into your main game

The builder emphasizes **subtle, atmospheric animations** that enhance the D&D experience without being distracting, and provides a scalable system for creating custom animations as your game grows! 