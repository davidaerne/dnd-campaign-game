export interface ImagePrompt {
  id: string;
  category: string;
  title: string;
  prompt: string;
  filename: string;
  folder: string;
}

export interface GenerationOptions {
  size: '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  style: 'vivid' | 'natural';
}

export class OpenAIImageGenerator {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/images/generations';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(
    prompt: string,
    options: GenerationOptions = {
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    }
  ): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: options.size,
          quality: options.quality,
          style: options.style,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async downloadImage(imageUrl: string, filename: string): Promise<Blob> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  async generateAndDownload(
    prompt: string,
    filename: string,
    options?: GenerationOptions
  ): Promise<Blob> {
    const imageUrl = await this.generateImage(prompt, options);
    return this.downloadImage(imageUrl, filename);
  }
}

// Utility function to save blob as file
export const saveImageBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 