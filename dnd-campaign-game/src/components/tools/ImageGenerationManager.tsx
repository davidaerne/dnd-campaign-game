import React, { useState, useEffect } from 'react';
import { OpenAIImageGenerator, ImagePrompt, GenerationOptions, saveImageBlob } from '../../services/openaiImageGenerator';

interface SimplifiedPrompt {
  id: string;
  type: 'character' | 'background';
  title: string;
  prompt: string;
  filename: string;
  recommendedSize: string;
}

interface GenerationStatus {
  [key: string]: 'idle' | 'generating' | 'downloading' | 'completed' | 'error';
}

interface GenerationProgress {
  current: number;
  total: number;
  currentPrompt: string;
}

const ImageGenerationManager: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({});
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'character' | 'background'>('all');
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid'
  });

  // Simplified prompts focused on just what's needed
  const simplifiedPrompts: SimplifiedPrompt[] = [
    // Character Cards (Portrait 1024x1792)
    {
      id: 'goblin-warrior',
      type: 'character',
      title: 'Goblin Warrior',
      prompt: 'Create a goblin warrior character for D&D combat. Small humanoid with green skin, pointed ears, wearing crude leather armor. Carries a rusty short sword and small shield. Looks cunning and aggressive but not too threatening. Fantasy monster art style suitable for a character card. Portrait orientation, full body view, detailed but clean art style.',
      filename: 'goblin_warrior.png',
      recommendedSize: '1024x1792'
    },
    {
      id: 'town-guard',
      type: 'character',
      title: 'Town Guard Captain',
      prompt: 'Create a human male guard captain character. He wears practical chain mail armor with a tabard showing simple heraldry. Has a sword at his side and looks experienced but not battle-scarred. Reliable and professional appearance. Dark hair, clean-shaven or light beard. Portrait orientation, full body view, suitable for NPC character card.',
      filename: 'town_guard_captain.png',
      recommendedSize: '1024x1792'
    },
    {
      id: 'wizard-apprentice',
      type: 'character',
      title: 'Wizard Apprentice',
      prompt: 'Create a young human male wizard apprentice character. Wears simple robes with minor magical accessories like a component pouch. Looks nervous and guilty, has made a mistake with magic. Young adult, bookish appearance, holds a simple staff or wand. Expression shows regret and worry. Fantasy wizard aesthetic but clearly inexperienced. Portrait orientation, full body view.',
      filename: 'wizard_apprentice.png',
      recommendedSize: '1024x1792'
    },
    {
      id: 'merchant',
      type: 'character',
      title: 'Captured Merchant',
      prompt: 'Create a human male merchant character who appears to have been a prisoner but maintains dignity. Slightly disheveled clothing that was once fine quality. Has rope marks on wrists but is unbound. Grateful but shaken expression. Middle-aged, well-fed appearance suggesting successful trade. Portrait orientation, full body view.',
      filename: 'captured_merchant.png',
      recommendedSize: '1024x1792'
    },
    {
      id: 'dwarf-innkeeper',
      type: 'character',
      title: 'Dwarf Innkeeper',
      prompt: 'Create a friendly dwarf innkeeper character in fantasy D&D style. He has a magnificent braided beard, kind eyes, and wears a leather apron over simple brown clothes. He should look welcoming and trustworthy. Holds a wooden mug. Warm, earthy colors. Portrait orientation, full body view, detailed but clean art style.',
      filename: 'dwarf_innkeeper.png',
      recommendedSize: '1024x1792'
    },
    
    // Background Images (Landscape 1792x1024)
    {
      id: 'tavern-interior',
      type: 'background',
      title: 'Cozy Tavern Interior',
      prompt: 'Create a warm, inviting medieval tavern interior. The scene shows wooden tables and chairs scattered around a large common room. A massive stone fireplace dominates one wall with a roaring fire casting dancing shadows. Heavy wooden beams support the ceiling. Warm yellow and orange lighting from lanterns and candles creates a cozy atmosphere. The bar area is visible in the background with kegs and bottles. Medieval fantasy art style, detailed but not cluttered.',
      filename: 'tavern_interior.png',
      recommendedSize: '1792x1024'
    },
    {
      id: 'forest-path',
      type: 'background',
      title: 'Dark Forest Path',
      prompt: 'Create a mysterious forest path winding through ancient trees. Thick canopy blocks most sunlight, creating dappled shadows on the forest floor. The path is clearly visible but disappears into darkness ahead. Massive oak and pine trees tower on both sides. Thick undergrowth and ferns line the path. The atmosphere should feel mysterious but not threatening. Fantasy art style with rich greens and browns.',
      filename: 'forest_path.png',
      recommendedSize: '1792x1024'
    },
    {
      id: 'cave-entrance',
      type: 'background',
      title: 'Cave Entrance',
      prompt: 'Create a cave entrance nestled between two massive oak trees in a forest setting. The cave mouth is dark and foreboding, with rough stone walls visible inside. Crude wooden fortifications and barriers suggest goblin occupation - sharpened stakes, rope barriers, and primitive warning signs. The forest around is dense with thick undergrowth. Ominous but not horror-themed.',
      filename: 'cave_entrance.png',
      recommendedSize: '1792x1024'
    },
    {
      id: 'village-square',
      type: 'background',
      title: 'Village Festival Square',
      prompt: 'Create a charming medieval village square decorated for a harvest festival. Colorful banners and bunting stretch between timber-framed buildings. Market stalls with bright awnings display pies, crafts, and produce. A central well serves as the focal point. Cobblestone streets, flower boxes in windows, and bundles of wheat as decorations. Cheerful and inviting with warm afternoon lighting.',
      filename: 'village_square.png',
      recommendedSize: '1792x1024'
    },
    {
      id: 'alchemist-shop',
      type: 'background',
      title: 'Alchemist Shop Interior',
      prompt: 'Create an alchemist shop interior with shelves lined with colorful bottles and vials. A large work table in the center has bubbling potions, ancient books, and alchemical equipment. Arched windows let in natural light. Stone walls, wooden shelves, and hanging herbs create a magical atmosphere. Warm candlelight illuminates the space. Fantasy medieval aesthetic.',
      filename: 'alchemist_shop.png',
      recommendedSize: '1792x1024'
    }
  ];

  const filteredPrompts = selectedType === 'all' 
    ? simplifiedPrompts 
    : simplifiedPrompts.filter(p => p.type === selectedType);

  const handleSelectPrompt = (promptId: string) => {
    const newSelected = new Set(selectedPrompts);
    if (newSelected.has(promptId)) {
      newSelected.delete(promptId);
    } else {
      newSelected.add(promptId);
    }
    setSelectedPrompts(newSelected);
  };

  const handleSelectAllByType = (type: 'character' | 'background') => {
    const typePrompts = simplifiedPrompts.filter(p => p.type === type);
    const typeIds = typePrompts.map(p => p.id);
    const newSelected = new Set(selectedPrompts);
    
    const allSelected = typeIds.every(id => newSelected.has(id));
    if (allSelected) {
      typeIds.forEach(id => newSelected.delete(id));
    } else {
      typeIds.forEach(id => newSelected.add(id));
    }
    setSelectedPrompts(newSelected);
  };

  const handleGenerateSelected = async () => {
    if (!apiKey.trim()) {
      alert('Please enter your OpenAI API key');
      return;
    }

    if (selectedPrompts.size === 0) {
      alert('Please select at least one prompt');
      return;
    }

    setIsGenerating(true);
    const generator = new OpenAIImageGenerator(apiKey);
    const selectedPromptList = simplifiedPrompts.filter(p => selectedPrompts.has(p.id));
    
    setGenerationProgress({
      current: 0,
      total: selectedPromptList.length,
      currentPrompt: ''
    });

    for (let i = 0; i < selectedPromptList.length; i++) {
      const prompt = selectedPromptList[i];
      
      setGenerationProgress({
        current: i + 1,
        total: selectedPromptList.length,
        currentPrompt: prompt.title
      });

      try {
        setGenerationStatus(prev => ({ ...prev, [prompt.id]: 'generating' }));
        
        // Set appropriate size based on type
        const options = {
          ...generationOptions,
          size: prompt.type === 'character' ? '1024x1792' as const : '1792x1024' as const
        };
        
        const imageBlob = await generator.generateAndDownload(
          prompt.prompt,
          prompt.filename,
          options
        );

        setGenerationStatus(prev => ({ ...prev, [prompt.id]: 'downloading' }));
        
        // Save the image
        saveImageBlob(imageBlob, prompt.filename);
        
        setGenerationStatus(prev => ({ ...prev, [prompt.id]: 'completed' }));
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error generating image for ${prompt.title}:`, error);
        setGenerationStatus(prev => ({ ...prev, [prompt.id]: 'error' }));
      }
    }

    setIsGenerating(false);
    setGenerationProgress(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating': return '🎨';
      case 'downloading': return '⬇️';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⭕';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating': return 'text-blue-500';
      case 'downloading': return 'text-purple-500';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const characterPrompts = simplifiedPrompts.filter(p => p.type === 'character');
  const backgroundPrompts = simplifiedPrompts.filter(p => p.type === 'background');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-4">🎨 AI Image Generator</h1>
          <p className="text-lg text-gray-300">Generate character cards and background images for your D&D campaign</p>
        </div>

        {/* API Key Configuration */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-amber-300 flex items-center">
            <span className="mr-2">🔑</span>
            OpenAI API Configuration
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="password"
              placeholder="Enter your OpenAI API key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
            />
            <button
              onClick={() => setApiKey('')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
            >
              Clear
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            🔒 Your API key is stored locally and never sent to our servers. Get your key from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
              OpenAI API Keys
            </a>
          </p>
        </div>

        {/* Generation Options */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-amber-300 flex items-center">
            <span className="mr-2">⚙️</span>
            Generation Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Quality</label>
              <select
                value={generationOptions.quality}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, quality: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              >
                <option value="standard">Standard (~$0.04/image)</option>
                <option value="hd">HD (~$0.08/image)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Style</label>
              <select
                value={generationOptions.style}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, style: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
              >
                <option value="vivid">Vivid (More Creative)</option>
                <option value="natural">Natural (More Realistic)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Auto-Size</label>
              <div className="bg-gray-700 px-3 py-2 rounded-lg text-sm">
                <div className="text-green-400">✓ Characters: 1024x1792</div>
                <div className="text-green-400">✓ Backgrounds: 1792x1024</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {generationProgress && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-amber-300">⏳ Generation Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Generating: {generationProgress.currentPrompt}</span>
                <span>{generationProgress.current} / {generationProgress.total}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Character Cards Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-amber-300 flex items-center">
              <span className="mr-2">🎭</span>
              Character Cards ({characterPrompts.length})
            </h2>
            <button
              onClick={() => handleSelectAllByType('character')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-sm"
            >
              {characterPrompts.every(p => selectedPrompts.has(p.id)) ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characterPrompts.map(prompt => (
              <div
                key={prompt.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPrompts.has(prompt.id)
                    ? 'border-amber-500 bg-amber-900/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleSelectPrompt(prompt.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${getStatusColor(generationStatus[prompt.id] || 'idle')}`}>
                      {getStatusIcon(generationStatus[prompt.id] || 'idle')}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{prompt.title}</h3>
                      <p className="text-xs text-gray-400">{prompt.recommendedSize}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPrompts.has(prompt.id)}
                    onChange={() => handleSelectPrompt(prompt.id)}
                    className="w-5 h-5 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Images Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-amber-300 flex items-center">
              <span className="mr-2">🏞️</span>
              Background Images ({backgroundPrompts.length})
            </h2>
            <button
              onClick={() => handleSelectAllByType('background')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-sm"
            >
              {backgroundPrompts.every(p => selectedPrompts.has(p.id)) ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backgroundPrompts.map(prompt => (
              <div
                key={prompt.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPrompts.has(prompt.id)
                    ? 'border-amber-500 bg-amber-900/20'
                    : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                }`}
                onClick={() => handleSelectPrompt(prompt.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${getStatusColor(generationStatus[prompt.id] || 'idle')}`}>
                      {getStatusIcon(generationStatus[prompt.id] || 'idle')}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{prompt.title}</h3>
                      <p className="text-xs text-gray-400">{prompt.recommendedSize}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPrompts.has(prompt.id)}
                    onChange={() => handleSelectPrompt(prompt.id)}
                    className="w-5 h-5 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={handleGenerateSelected}
            disabled={isGenerating || selectedPrompts.size === 0}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg transition-all font-semibold text-lg shadow-lg"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">🎨</span>
                Generating...
              </span>
            ) : (
              `Generate Selected Images (${selectedPrompts.size})`
            )}
          </button>
          {selectedPrompts.size > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Estimated cost: ${(selectedPrompts.size * (generationOptions.quality === 'hd' ? 0.08 : 0.04)).toFixed(2)}
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-amber-400 mb-4">💡 Tips for Best Results</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold mb-2 text-white">Character Cards</h3>
              <ul className="space-y-1 text-sm">
                <li>• Portrait format perfect for card layouts</li>
                <li>• Use for NPCs, monsters, and player characters</li>
                <li>• Start with 2-3 test images to check quality</li>
                <li>• Generated at 1024x1792 for crisp card display</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-white">Background Images</h3>
              <ul className="space-y-1 text-sm">
                <li>• Landscape format ideal for scene backgrounds</li>
                <li>• Use for taverns, forests, caves, and towns</li>
                <li>• Generated at 1792x1024 for wide scenes</li>
                <li>• Can be cropped or resized as needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationManager; 