import React, { useState } from 'react';

interface ActionCard {
  id: string;
  name: string;
  category: 'offense' | 'defense' | 'tactics' | 'monster-only';
  description: string;
  icon: string;
  color: string;
}

interface CharacterCard {
  id: string;
  name: string;
  type: 'npc' | 'character' | 'monster';
  image: string;
  description: string;
}

const TestCardViewer: React.FC = () => {
  const [selectedCardType, setSelectedCardType] = useState<'action' | 'character'>('action');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample action cards based on user's requirements
  const actionCards: ActionCard[] = [
    // Offense Cards
    { id: 'strike', name: 'Strike', category: 'offense', description: 'The creature attacks with a melee weapon.', icon: '⚔️', color: 'bg-red-600' },
    { id: 'slash', name: 'Slash', category: 'offense', description: 'The creature makes a sweeping strike.', icon: '🗡️', color: 'bg-red-600' },
    { id: 'claw', name: 'Claw', category: 'offense', description: 'The creature attacks with its sharp claws.', icon: '🐾', color: 'bg-red-600' },
    { id: 'bite', name: 'Bite', category: 'offense', description: 'The creature bites with its sharp teeth.', icon: '🦷', color: 'bg-red-600' },
    { id: 'throw', name: 'Throw', category: 'offense', description: 'The creature throws a weapon or object.', icon: '🪃', color: 'bg-red-600' },
    { id: 'fire-breath', name: 'Fire Breath', category: 'offense', description: 'The creature breathes fire (recharge 5-6).', icon: '🔥', color: 'bg-red-600' },
    { id: 'multiattack', name: 'Multiattack', category: 'offense', description: 'The creature makes multiple attacks.', icon: '⚡', color: 'bg-red-600' },
    { id: 'spell-blast', name: 'Spell Blast', category: 'offense', description: 'The creature casts a damaging spell.', icon: '✨', color: 'bg-red-600' },
    
    // Defense Cards
    { id: 'dodge', name: 'Dodge', category: 'defense', description: 'The creature evades incoming attacks.', icon: '🤸', color: 'bg-blue-600' },
    { id: 'parry', name: 'Parry', category: 'defense', description: 'The creature blocks with its weapon.', icon: '🛡️', color: 'bg-blue-600' },
    { id: 'brace', name: 'Brace', category: 'defense', description: 'The creature readies itself to endure blows.', icon: '🔒', color: 'bg-blue-600' },
    { id: 'retreat', name: 'Retreat', category: 'defense', description: 'The creature pulls away from combat.', icon: '🏃', color: 'bg-blue-600' },
    { id: 'hide', name: 'Hide', category: 'defense', description: 'The creature seeks cover to obscure itself.', icon: '👁️', color: 'bg-blue-600' },
    
    // Tactics & Utility Cards
    { id: 'grapple', name: 'Grapple', category: 'tactics', description: 'The creature tries to grab a foe.', icon: '🤼', color: 'bg-green-600' },
    { id: 'shove', name: 'Shove', category: 'tactics', description: 'The creature pushes a creature away.', icon: '👐', color: 'bg-green-600' },
    { id: 'dash', name: 'Dash', category: 'tactics', description: 'The creature moves swiftly.', icon: '💨', color: 'bg-green-600' },
    { id: 'disengage', name: 'Disengage', category: 'tactics', description: 'The creature moves without provoking attacks.', icon: '🔄', color: 'bg-green-600' },
    { id: 'teleport', name: 'Teleport', category: 'tactics', description: 'The creature magically changes its location.', icon: '🌀', color: 'bg-green-600' },
    { id: 'use-object', name: 'Use Object', category: 'tactics', description: 'The creature uses an item or device.', icon: '🎒', color: 'bg-green-600' },
    { id: 'help', name: 'Help', category: 'tactics', description: 'The creature aids another creature.', icon: '🤝', color: 'bg-green-600' },
    
    // Monster-Only Cards
    { id: 'recharge', name: 'Recharge Ability', category: 'monster-only', description: 'The creature reuses an expended trait.', icon: '🔄', color: 'bg-purple-600' },
    { id: 'legendary', name: 'Legendary Action', category: 'monster-only', description: 'The creature takes an extra action at end of another creature\'s turn.', icon: '👑', color: 'bg-purple-600' },
    { id: 'lair', name: 'Lair Action', category: 'monster-only', description: 'The creature uses its lair\'s power.', icon: '🏰', color: 'bg-purple-600' },
    { id: 'summon', name: 'Summon', category: 'monster-only', description: 'The creature calls forth others to its aid.', icon: '👥', color: 'bg-purple-600' },
    { id: 'frighten', name: 'Frighten', category: 'monster-only', description: 'The creature instills fear in its enemies.', icon: '😱', color: 'bg-purple-600' },
  ];

  // Sample character cards (placeholders for now)
  const characterCards: CharacterCard[] = [
    { id: 'goblin', name: 'Goblin Warrior', type: 'monster', image: '/api/placeholder/300/400', description: 'Small humanoid, chaotic evil' },
    { id: 'guard', name: 'Town Guard', type: 'npc', image: '/api/placeholder/300/400', description: 'Human guard, lawful neutral' },
    { id: 'wizard', name: 'Wizard Apprentice', type: 'npc', image: '/api/placeholder/300/400', description: 'Young spellcaster, neutral good' },
    { id: 'merchant', name: 'Captured Merchant', type: 'npc', image: '/api/placeholder/300/400', description: 'Human trader, neutral' },
  ];

  const categories = {
    all: 'All Cards',
    offense: 'Offense ⚔️',
    defense: 'Defense 🛡️',
    tactics: 'Tactics & Utility 🧠',
    'monster-only': 'Monster-Only 💀'
  };

  const characterTypes = {
    all: 'All Types',
    npc: 'NPCs',
    character: 'Characters', 
    monster: 'Monsters'
  };

  const filteredActionCards = selectedCategory === 'all' 
    ? actionCards 
    : actionCards.filter(card => card.category === selectedCategory);

  const filteredCharacterCards = selectedCategory === 'all'
    ? characterCards
    : characterCards.filter(card => card.type === selectedCategory);

  const ActionCardComponent = ({ card }: { card: ActionCard }) => (
    <div className={`${card.color} rounded-lg p-4 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">{card.name}</h3>
        <span className="text-2xl">{card.icon}</span>
      </div>
      <p className="text-sm opacity-90">{card.description}</p>
      <div className="mt-3 text-xs opacity-75 uppercase tracking-wide">
        {card.category.replace('-', ' ')}
      </div>
    </div>
  );

  const CharacterCardComponent = ({ card }: { card: CharacterCard }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
      <div className="aspect-[3/4] bg-gray-700 flex items-center justify-center">
        <span className="text-6xl">🎭</span>
        {/* Placeholder for generated image */}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white mb-2">{card.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{card.description}</p>
        <div className="text-xs text-amber-400 uppercase tracking-wide">
          {card.type}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-4">🃏 Test Card System</h1>
          <p className="text-lg text-gray-300">Test your generated images with the action card system</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            
            {/* Card Type Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSelectedCardType('action')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedCardType === 'action' 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Action Cards
              </button>
              <button
                onClick={() => setSelectedCardType('character')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  selectedCardType === 'character' 
                    ? 'bg-amber-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Character Cards
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-300">Filter:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {selectedCardType === 'action' ? (
                  Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))
                ) : (
                  Object.entries(characterTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))
                )}
              </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
              {selectedCardType === 'action' ? (
                <>Showing {filteredActionCards.length} action cards</>
              ) : (
                <>Showing {filteredCharacterCards.length} character cards</>
              )}
            </div>
          </div>
        </div>

        {/* Card Grid */}
        <div className={`grid gap-6 ${
          selectedCardType === 'action' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {selectedCardType === 'action' ? (
            filteredActionCards.map(card => (
              <ActionCardComponent key={card.id} card={card} />
            ))
          ) : (
            filteredCharacterCards.map(card => (
              <CharacterCardComponent key={card.id} card={card} />
            ))
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4">How to Use</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Action Cards</h3>
              <ul className="space-y-1 text-sm">
                <li>• <span className="text-red-400">Offense</span> - Attack actions for combat</li>
                <li>• <span className="text-blue-400">Defense</span> - Protective and evasive actions</li>
                <li>• <span className="text-green-400">Tactics</span> - Utility and positioning moves</li>
                <li>• <span className="text-purple-400">Monster-Only</span> - Special creature abilities</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Character Cards</h3>
              <ul className="space-y-1 text-sm">
                <li>• Replace placeholder images with AI-generated artwork</li>
                <li>• Test different card layouts and styles</li>
                <li>• Preview how images will look in your campaign</li>
                <li>• Organize by NPCs, Characters, and Monsters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCardViewer; 