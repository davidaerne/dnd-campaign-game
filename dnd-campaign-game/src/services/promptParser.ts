import { ImagePrompt } from './openaiImageGenerator';

export class PromptParser {
  private static readonly PROMPT_CATEGORIES = {
    'Scene Backgrounds': 'scenes',
    'NPC Characters': 'npcs',
    'Action Cards': 'cards',
    'UI Elements': 'ui',
    'Items & Equipment': 'items',
    'Creatures & Monsters': 'creatures',
    'World Elements': 'world'
  };

  static parsePromptsFromMarkdown(markdownContent: string): ImagePrompt[] {
    const prompts: ImagePrompt[] = [];
    const lines = markdownContent.split('\n');
    
    let currentCategory = '';
    let currentPrompt = '';
    let currentTitle = '';
    let promptCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for category headers
      if (line.startsWith('## ') && line.includes('Generation Prompts')) {
        currentCategory = line.replace('## ', '').replace(' Generation Prompts', '').trim();
        continue;
      }

      // Check for numbered prompts (e.g., "1. **Tavern Interior**")
      const promptMatch = line.match(/^(\d+)\.\s\*\*(.*?)\*\*/);
      if (promptMatch && currentCategory) {
        // Save previous prompt if exists
        if (currentPrompt && currentTitle) {
          prompts.push(this.createImagePrompt(
            currentCategory,
            currentTitle,
            currentPrompt,
            promptCounter++
          ));
        }
        
        currentTitle = promptMatch[2];
        currentPrompt = '';
        continue;
      }

      // Collect prompt content (non-empty lines after the title)
      if (line && !line.startsWith('#') && !line.startsWith('**') && currentTitle) {
        currentPrompt += (currentPrompt ? ' ' : '') + line;
      }
    }

    // Don't forget the last prompt
    if (currentPrompt && currentTitle && currentCategory) {
      prompts.push(this.createImagePrompt(
        currentCategory,
        currentTitle,
        currentPrompt,
        promptCounter++
      ));
    }

    return prompts;
  }

  private static createImagePrompt(
    category: string,
    title: string,
    prompt: string,
    index: number
  ): ImagePrompt {
    const categoryKey = this.PROMPT_CATEGORIES[category as keyof typeof this.PROMPT_CATEGORIES] || 'misc';
    const filename = this.generateFilename(title, categoryKey);
    
    return {
      id: `${categoryKey}_${index}`,
      category,
      title,
      prompt: prompt.trim(),
      filename,
      folder: categoryKey
    };
  }

  private static generateFilename(title: string, category: string): string {
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    return `${category}_${cleanTitle}.png`;
  }

  // Load prompts from the markdown file in the public directory
  static async loadPrompts(): Promise<ImagePrompt[]> {
    try {
      const response = await fetch('/chatgpt-image-generation-prompts.md');
      if (!response.ok) {
        throw new Error('Failed to load prompts file');
      }
      const markdownContent = await response.text();
      return this.parsePromptsFromMarkdown(markdownContent);
    } catch (error) {
      console.error('Error loading prompts:', error);
      return [];
    }
  }

  // Get prompts by category
  static getPromptsByCategory(prompts: ImagePrompt[]): Record<string, ImagePrompt[]> {
    return prompts.reduce((acc, prompt) => {
      if (!acc[prompt.category]) {
        acc[prompt.category] = [];
      }
      acc[prompt.category].push(prompt);
      return acc;
    }, {} as Record<string, ImagePrompt[]>);
  }

  // Get unique categories
  static getCategories(prompts: ImagePrompt[]): string[] {
    return Array.from(new Set(prompts.map(p => p.category)));
  }
} 