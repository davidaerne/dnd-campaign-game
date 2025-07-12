# 🎨 D&D Image Generation Manager

## Overview

The D&D Campaign Studio now includes an integrated **OpenAI Image Generator** that connects to your OpenAI account and automatically generates all the visual assets needed for your D&D campaigns. This feature reads from your existing ChatGPT prompts and creates organized, properly-named image files.

## Features

### 🔌 OpenAI Integration
- Direct connection to your OpenAI API account
- Uses DALL-E 3 for high-quality image generation
- Secure local API key storage (never sent to our servers)

### 📝 Automated Prompt Management
- Automatically parses 29 detailed ChatGPT prompts from your project
- Organizes prompts by category (Scenes, NPCs, Cards, UI, Items, Creatures, World)
- Generates appropriate filenames and folder structures

### 🎯 Intelligent Asset Organization
- **Scenes**: Backgrounds for different campaign locations
- **NPCs**: Character portraits and sprites
- **Cards**: Action cards, spells, and items
- **UI**: Interface elements and decorative assets
- **Items**: Equipment, weapons, and consumables
- **Creatures**: Monsters and creatures for encounters
- **World**: Environmental elements and decorations

### ⚙️ Customizable Generation Options
- **Size Options**: Square (1024x1024), Landscape (1792x1024), Portrait (1024x1792)
- **Quality**: Standard or HD (higher cost)
- **Style**: Vivid or Natural
- **Batch Processing**: Generate multiple images at once

## Getting Started

### 1. Obtain OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy the key (starts with `sk-`)

### 2. Access the Image Generator
1. Start your D&D Campaign Studio app
2. Click the **🎨 Image Generator** tab in the navigation
3. Enter your OpenAI API key in the secure input field

### 3. Generate Images
1. **Select Category**: Choose specific categories or "All Categories"
2. **Select Prompts**: Check individual prompts or use "Select All"
3. **Configure Options**: Set size, quality, and style preferences
4. **Generate**: Click "Generate Selected" to start the process

### 4. Download and Organize
- Images automatically download to your Downloads folder
- Files are named according to category and content (e.g., `scenes_tavern_interior.png`)
- Manually move files to your project's `public/assets/images/` folders

## File Organization

The generator creates files organized by category:

```
public/assets/images/
├── scenes/          # Background scenes
├── npcs/            # Character portraits
├── cards/           # Action cards and spells
├── ui/              # Interface elements
├── items/           # Equipment and consumables
├── creatures/       # Monsters and creatures
└── world/           # Environmental elements
```

## Usage Tips

### 💰 Cost Management
- **Standard Quality**: ~$0.040 per image
- **HD Quality**: ~$0.080 per image
- Start with a few test images to verify prompts
- Use "Standard" quality for initial iterations

### 🎯 Prompt Selection
- Start with essential assets (scenes, main NPCs)
- Generate UI elements last (they're easier to create manually)
- Test different size options for different use cases

### 🔄 Iteration Process
1. Generate a small batch (5-10 images)
2. Review quality and style consistency
3. Adjust generation options if needed
4. Generate remaining assets in batches

## Troubleshooting

### Common Issues

**API Key Errors**
- Verify your OpenAI API key is correct
- Check that your OpenAI account has available credits
- Ensure your API key has image generation permissions

**Generation Failures**
- Some prompts may be rejected for content policy violations
- Try regenerating individual failed images
- Check the browser console for detailed error messages

**Download Issues**
- Ensure pop-ups are enabled for downloads
- Check your Downloads folder for generated files
- Large batches may take time to process

### Rate Limiting
- OpenAI has rate limits for API usage
- The generator includes 1-second delays between requests
- For large batches, consider splitting into smaller groups

## Integration with Campaign Game

### Manual Integration Steps
1. Generate images using the Image Generator
2. Move downloaded files to appropriate folders in `public/assets/images/`
3. Update your campaign JSON files to reference the new image paths
4. Test images in your campaign scenes

### Future Enhancements
- Automatic file placement in project folders
- Direct integration with campaign JSON files
- Batch renaming and organization tools
- Preview before download functionality

## Example Workflow

1. **Planning**: Review the 29 available prompts
2. **Essential Assets**: Generate tavern, shop, and key NPC images
3. **Atmosphere**: Add creature and world element images
4. **Polish**: Generate UI elements and decorative assets
5. **Integration**: Place files in asset folders and update campaigns

## Security & Privacy

- ✅ API keys stored locally in browser only
- ✅ Keys never transmitted to our servers
- ✅ Generated images owned by you
- ✅ No data collection or tracking
- ✅ Works entirely client-side

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify your OpenAI API key and account status
3. Review the troubleshooting section above
4. Report bugs via GitHub issues

---

**Ready to bring your D&D campaigns to life with AI-generated art!** 🐉✨ 