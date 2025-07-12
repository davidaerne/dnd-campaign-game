import React, { useState, useEffect } from 'react';
import { OpenAIImageGenerator, ImagePrompt, GenerationOptions, saveImageBlob } from '../../services/openaiImageGenerator';
import { PromptParser } from '../../services/promptParser';

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
  const [prompts, setPrompts] = useState<ImagePrompt[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({});
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid'
  });

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const loadedPrompts = await PromptParser.loadPrompts();
      setPrompts(loadedPrompts);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const categories = PromptParser.getCategories(prompts);
  const filteredPrompts = selectedCategory === 'all' 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);

  const handleSelectPrompt = (promptId: string) => {
    const newSelected = new Set(selectedPrompts);
    if (newSelected.has(promptId)) {
      newSelected.delete(promptId);
    } else {
      newSelected.add(promptId);
    }
    setSelectedPrompts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedPrompts.size === filteredPrompts.length) {
      setSelectedPrompts(new Set());
    } else {
      setSelectedPrompts(new Set(filteredPrompts.map(p => p.id)));
    }
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
    const selectedPromptList = prompts.filter(p => selectedPrompts.has(p.id));
    
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
        
        const imageBlob = await generator.generateAndDownload(
          prompt.prompt,
          prompt.filename,
          generationOptions
        );

        setGenerationStatus(prev => ({ ...prev, [prompt.id]: 'downloading' }));
        
        // Save the image
        saveImageBlob(imageBlob, prompt.filename);
        
        setGenerationStatus(prev => ({ ...prev, [prompt.id]: 'completed' }));
        
        // Add a small delay to avoid rate limiting
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

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-amber-400">
        🎨 D&D Image Generation Manager
      </h1>

      {/* API Key Input */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-amber-300">OpenAI API Configuration</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="password"
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={() => setApiKey('')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Your API key is stored locally and never sent to our servers. Get your key from: 
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline ml-1">
            OpenAI API Keys
          </a>
        </p>
      </div>

      {/* Generation Options */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-amber-300">Generation Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <select
              value={generationOptions.size}
              onChange={(e) => setGenerationOptions(prev => ({ ...prev, size: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="1024x1024">Square (1024x1024)</option>
              <option value="1792x1024">Landscape (1792x1024)</option>
              <option value="1024x1792">Portrait (1024x1792)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quality</label>
            <select
              value={generationOptions.quality}
              onChange={(e) => setGenerationOptions(prev => ({ ...prev, quality: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="standard">Standard</option>
              <option value="hd">HD (Higher Cost)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Style</label>
            <select
              value={generationOptions.style}
              onChange={(e) => setGenerationOptions(prev => ({ ...prev, style: e.target.value as any }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="vivid">Vivid</option>
              <option value="natural">Natural</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {generationProgress && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-300">Generation Progress</h2>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Generating: {generationProgress.currentPrompt}</span>
              <span>{generationProgress.current} / {generationProgress.total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(generationProgress.current / generationProgress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Categories ({prompts.length})</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category} ({prompts.filter(p => p.category === category).length})
                </option>
              ))}
            </select>
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {selectedPrompts.size === filteredPrompts.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <button
            onClick={handleGenerateSelected}
            disabled={isGenerating || selectedPrompts.size === 0}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors font-semibold"
          >
            {isGenerating ? 'Generating...' : `Generate Selected (${selectedPrompts.size})`}
          </button>
        </div>
      </div>

      {/* Prompts List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-amber-300">
          Image Prompts ({filteredPrompts.length})
        </h2>
        <div className="space-y-3">
          {filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedPrompts.has(prompt.id)
                  ? 'border-amber-500 bg-amber-900/20'
                  : 'border-gray-600 bg-gray-700 hover:border-gray-500'
              }`}
              onClick={() => handleSelectPrompt(prompt.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl ${getStatusColor(generationStatus[prompt.id] || 'idle')}`}>
                      {getStatusIcon(generationStatus[prompt.id] || 'idle')}
                    </span>
                    <h3 className="font-semibold text-white">{prompt.title}</h3>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded-full">
                      {prompt.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{prompt.prompt}</p>
                  <p className="text-xs text-gray-400">
                    Filename: {prompt.filename} • Folder: {prompt.folder}
                  </p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={selectedPrompts.has(prompt.id)}
                    onChange={() => handleSelectPrompt(prompt.id)}
                    className="w-5 h-5 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-400">
        <p className="text-sm">
          💡 Tip: Images will be automatically downloaded to your Downloads folder. 
          You can then organize them into your app's assets directory.
        </p>
      </div>
    </div>
  );
};

export default ImageGenerationManager; 