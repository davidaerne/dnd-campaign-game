# Sample JSON Campaign Files

## 🗂️ TypeScript Types (types/campaign.ts)

```typescript
// Campaign and Scene Types
export interface Campaign {
  campaignId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: string;
  playerLevels: [number, number];
  scenes: Scene[];
  globalData: GlobalData;
}

export interface Scene {
  id: string;
  type: 'town' | 'exploration' | 'combat' | 'dungeon' | 'social' | 'puzzle';
  title: string;
  background: string;
  music?: string;
  description: string;
  npcs?: NPC[];
  encounters?: Encounter[];
  interactions?: Interaction[];
  transitions: Transition[];
  requiredItems?: string[];
  completionConditions?: CompletionCondition[];
}

export interface NPC {
  id: string;
  name: string;
  position: { x: number; y: number };
  sprite: string;
  dialogue: DialogueTree;
  shop?: Shop;
  questGiver?: boolean;
  relationship: number;
}

export interface DialogueTree {
  greeting: string;
  nodes: DialogueNode[];
  farewell?: string;
}

export interface DialogueNode {
  id: string;
  text: string;
  conditions?: Condition[];
  choices: DialogueChoice[];
  consequences?: Consequence[];
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNode?: string;
  requirements?: Requirement[];
  consequences?: Consequence[];
}

export interface Shop {
  type: 'general_goods' | 'weapons' | 'armor' | 'magical_items' | 'potions' | 'inn';
  name: string;
  inventory: ShopItem[];
  buybackRate: number;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
}

export interface Encounter {
  id: string;
  type: 'combat' | 'skill_check' | 'discovery' | 'trap';
  triggerChance: number;
  position: { x: number; y: number };
  data: any;
}

export interface Transition {
  to: string;
  trigger: 'automatic' | 'quest_completed' | 'area_explored' | 'item_found' | 'choice_made';
  position: { x: number; y: number };
  label: string;
  requirements?: Requirement[];
}
```

## 📜 Sample Campaign: "The Missing Merchant"

### goblin-cave-rescue.json
```json
{
  "campaignId": "missing_merchant",
  "title": "The Missing Merchant",
  "description": "A wealthy merchant has gone missing on the road to Greenhill. The party must investigate his disappearance and rescue him from goblin bandits.",
  "difficulty": "beginner",
  "estimatedDuration": "2-3 hours",
  "playerLevels": [1, 3],
  "scenes": [
    {
      "id": "crossroads_tavern",
      "type": "town",
      "title": "The Crossroads Tavern",
      "background": "tavern_interior.jpg",
      "music": "peaceful_tavern.mp3",
      "description": "A cozy tavern at the crossroads where travelers often stop for rest and information. The warm firelight flickers across worried faces.",
      "npcs": [
        {
          "id": "tavern_keeper",
          "name": "Brom Ironhand",
          "position": { "x": 35, "y": 60 },
          "sprite": "dwarf_innkeeper.png",
          "relationship": 0,
          "dialogue": {
            "greeting": "Welcome, travelers! You look like capable folk. Perhaps you can help with our troubles?",
            "nodes": [
              {
                "id": "main_quest",
                "text": "A merchant named Gareth was supposed to arrive three days ago with supplies for the village. His caravan never showed up. The road's been dangerous lately with goblin raids.",
                "choices": [
                  {
                    "id": "accept_quest",
                    "text": "We'll find this merchant and bring him back safely.",
                    "nextNode": "quest_details",
                    "consequences": [
                      { "type": "add_quest", "value": "rescue_merchant" },
                      { "type": "relationship_change", "value": 1 }
                    ]
                  },
                  {
                    "id": "ask_reward",
                    "text": "What's in it for us?",
                    "nextNode": "reward_discussion"
                  },
                  {
                    "id": "decline",
                    "text": "We're not interested in your problems.",
                    "nextNode": "disappointed",
                    "consequences": [
                      { "type": "relationship_change", "value": -1 }
                    ]
                  }
                ]
              },
              {
                "id": "quest_details",
                "text": "Gareth was traveling with a wagon full of winter supplies. He should have taken the main road through Darkwood. Here, take this - it might help you track him.",
                "choices": [
                  {
                    "id": "take_item",
                    "text": "Thank you for the help.",
                    "consequences": [
                      { "type": "add_item", "value": "tracking_scroll" }
                    ]
                  }
                ]
              },
              {
                "id": "reward_discussion",
                "text": "The village can pool together 200 gold pieces, and you can keep anything you recover from the goblins. Gareth is also known to be generous to his rescuers.",
                "choices": [
                  {
                    "id": "accept_reward",
                    "text": "That sounds fair. We'll take the job.",
                    "nextNode": "quest_details",
                    "consequences": [
                      { "type": "add_quest", "value": "rescue_merchant" }
                    ]
                  }
                ]
              }
            ]
          },
          "shop": {
            "type": "inn",
            "name": "The Crossroads Tavern",
            "buybackRate": 0.5,
            "inventory": [
              { "id": "healing_potion", "name": "Healing Potion", "price": 50, "quantity": 3, "rarity": "common" },
              { "id": "travelers_rations", "name": "Traveler's Rations", "price": 10, "quantity": 10, "rarity": "common" },
              { "id": "rope_hemp", "name": "Hemp Rope (50 ft)", "price": 15, "quantity": 2, "rarity": "common" },
              { "id": "torch", "name": "Torch", "price": 2, "quantity": 20, "rarity": "common" }
            ]
          }
        },
        {
          "id": "local_guard",
          "name": "Captain Marcus",
          "position": { "x": 70, "y": 40 },
          "sprite": "human_guard.png",
          "relationship": 0,
          "dialogue": {
            "greeting": "I've been expecting adventurers like you. These goblin raids are getting out of hand.",
            "nodes": [
              {
                "id": "goblin_info",
                "text": "The goblins have been more organized lately. Someone or something is leading them. They've set up camp somewhere in the Darkwood, but we haven't been able to locate it exactly.",
                "choices": [
                  {
                    "id": "ask_tactics",
                    "text": "What can you tell us about their tactics?",
                    "nextNode": "tactics_info"
                  },
                  {
                    "id": "ask_location",
                    "text": "Any idea where in the Darkwood they might be?",
                    "nextNode": "location_info"
                  }
                ]
              },
              {
                "id": "tactics_info",
                "text": "They favor ambush tactics, usually attacking from dense brush. Watch for tripwires and pit traps. Their archers will try to stay hidden while warriors charge.",
                "choices": [
                  {
                    "id": "thank_captain",
                    "text": "Thanks for the warning."
                  }
                ]
              },
              {
                "id": "location_info",
                "text": "There's an old cave system near the northern part of the forest. If I were setting up a bandit camp, that's where I'd do it. Look for the twin oak trees - the cave entrance should be nearby.",
                "choices": [
                  {
                    "id": "note_location",
                    "text": "We'll check there first.",
                    "consequences": [
                      { "type": "add_note", "value": "cave_location_hint" }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ],
      "transitions": [
        {
          "to": "darkwood_entrance",
          "trigger": "quest_completed",
          "position": { "x": 90, "y": 30 },
          "label": "Head to Darkwood Forest",
          "requirements": [
            { "type": "has_quest", "value": "rescue_merchant" }
          ]
        }
      ]
    },
    {
      "id": "darkwood_entrance",
      "type": "exploration",
      "title": "Darkwood Forest - Main Path",
      "background": "dark_forest_path.jpg",
      "music": "mysterious_forest.mp3",
      "description": "The main road winds through the dense Darkwood Forest. Thick canopy blocks most sunlight, creating an perpetual twilight. The silence is unnerving.",
      "encounters": [
        {
          "id": "wagon_wreckage",
          "type": "discovery",
          "triggerChance": 1.0,
          "position": { "x": 40, "y": 50 },
          "data": {
            "description": "You find the remains of a merchant wagon, overturned and ransacked. Deep gouges in the wood suggest weapon damage.",
            "investigation_dc": 12,
            "success_result": "You find goblin tracks leading north toward the hills, and traces of blood on the ground - but not enough to suggest fatal wounds.",
            "items_found": ["torn_ledger", "broken_wheel"],
            "clue": "merchant_taken_alive"
          }
        },
        {
          "id": "goblin_patrol",
          "type": "combat",
          "triggerChance": 0.7,
          "position": { "x": 60, "y": 40 },
          "data": {
            "description": "A goblin patrol emerges from the underbrush, weapons drawn!",
            "enemies": [
              { "type": "goblin_warrior", "count": 2, "hp": 7, "ac": 15 },
              { "type": "goblin_archer", "count": 1, "hp": 6, "ac": 13 }
            ],
            "terrain": "forest",
            "special_conditions": ["difficult_terrain", "partial_cover"]
          }
        },
        {
          "id": "mysterious_shrine",
          "type": "discovery",
          "triggerChance": 0.3,
          "position": { "x": 20, "y": 70 },
          "data": {
            "description": "Hidden among the trees is an ancient shrine to a forgotten forest deity. Moss covers intricate carvings.",
            "religion_dc": 15,
            "success_result": "The shrine radiates faint magical energy. You sense it might offer protection to those who show respect.",
            "blessing": "forest_protection",
            "blessing_effect": "Advantage on Stealth checks in forest terrain for 24 hours"
          }
        }
      ],
      "transitions": [
        {
          "to": "goblin_cave_exterior",
          "trigger": "area_explored",
          "position": { "x": 80, "y": 20 },
          "label": "Follow the Trail North",
          "requirements": [
            { "type": "has_clue", "value": "merchant_taken_alive" }
          ]
        },
        {
          "to": "crossroads_tavern",
          "trigger": "choice_made",
          "position": { "x": 10, "y": 90 },
          "label": "Return to Tavern"
        }
      ]
    },
    {
      "id": "goblin_cave_exterior",
      "type": "dungeon",
      "title": "Goblin Cave - Entrance",
      "background": "cave_entrance_forest.jpg",
      "music": "ominous_cave.mp3",
      "description": "You've found the goblin lair - a natural cave entrance between two massive oak trees, just as Captain Marcus described. Crude fortifications block the entrance.",
      "encounters": [
        {
          "id": "cave_guards",
          "type": "combat",
          "triggerChance": 1.0,
          "position": { "x": 50, "y": 45 },
          "data": {
            "description": "Two goblin guards notice your approach and raise the alarm!",
            "enemies": [
              { "type": "goblin_warrior", "count": 2, "hp": 7, "ac": 15 },
              { "type": "goblin_boss", "count": 1, "hp": 21, "ac": 17 }
            ],
            "terrain": "rocky",
            "special_conditions": ["fortified_position"],
            "tactics": "Guards will attempt to retreat into the cave to warn others if combat goes poorly"
          }
        }
      ],
      "interactions": [
        {
          "type": "skill_check",
          "skill": "stealth",
          "dc": 14,
          "success": "You successfully sneak past the guards and find a side entrance to the cave",
          "failure": "Your approach is noticed - combat is unavoidable",
          "position": { "x": 75, "y": 60 }
        },
        {
          "type": "skill_check",
          "skill": "investigation",
          "dc": 12,
          "success": "You spot a hidden path that leads to a rear entrance of the cave system",
          "failure": "The only way forward is through the main entrance",
          "position": { "x": 30, "y": 70 }
        }
      ],
      "transitions": [
        {
          "to": "goblin_cave_interior",
          "trigger": "area_explored",
          "position": { "x": 50, "y": 30 },
          "label": "Enter the Cave"
        }
      ]
    },
    {
      "id": "goblin_cave_interior",
      "type": "dungeon",
      "title": "Goblin Cave - Main Chamber",
      "background": "cave_interior_torches.jpg",
      "music": "dungeon_atmosphere.mp3",
      "description": "The cave opens into a large chamber lit by torches. You can hear voices echoing from deeper within - and possibly cries for help.",
      "npcs": [
        {
          "id": "captured_merchant",
          "name": "Gareth the Merchant",
          "position": { "x": 70, "y": 80 },
          "sprite": "human_merchant_tied.png",
          "relationship": 0,
          "dialogue": {
            "greeting": "Thank the gods! Are you here to rescue me?",
            "nodes": [
              {
                "id": "rescue_dialogue",
                "text": "The goblins have been holding me for ransom, but their leader has other plans. There's something unnatural about him - his eyes glow with malice.",
                "choices": [
                  {
                    "id": "ask_about_leader",
                    "text": "Tell us about this leader.",
                    "nextNode": "leader_info"
                  },
                  {
                    "id": "focus_escape",
                    "text": "We need to get you out of here now.",
                    "nextNode": "escape_plan"
                  }
                ]
              },
              {
                "id": "leader_info",
                "text": "He calls himself Grimfang. Larger than the other goblins, and he wears a strange amulet that pulses with dark energy. I think he's being influenced by something evil.",
                "choices": [
                  {
                    "id": "note_amulet",
                    "text": "We'll deal with him. Let's get you free.",
                    "consequences": [
                      { "type": "add_clue", "value": "evil_amulet" }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ],
      "encounters": [
        {
          "id": "final_boss_battle",
          "type": "combat",
          "triggerChance": 1.0,
          "position": { "x": 40, "y": 40 },
          "data": {
            "description": "Grimfang emerges from the shadows, his amulet glowing with malevolent energy. 'You will not leave this place alive!'",
            "enemies": [
              { 
                "type": "grimfang_boss", 
                "count": 1, 
                "hp": 32, 
                "ac": 16,
                "special_abilities": ["dark_amulet", "goblin_command", "fearsome_presence"]
              },
              { "type": "goblin_warrior", "count": 3, "hp": 7, "ac": 15 }
            ],
            "terrain": "cave",
            "special_conditions": ["dim_light", "uneven_ground"],
            "boss_mechanics": {
              "phase_1": "Normal combat with minions",
              "phase_2": "At 50% health, amulet activates - fear effect and damage boost",
              "victory_condition": "Defeat Grimfang or destroy the amulet"
            }
          }
        }
      ],
      "transitions": [
        {
          "to": "campaign_conclusion",
          "trigger": "quest_completed",
          "position": { "x": 50, "y": 90 },
          "label": "Escape with the Merchant",
          "requirements": [
            { "type": "npc_rescued", "value": "captured_merchant" },
            { "type": "enemy_defeated", "value": "grimfang_boss" }
          ]
        }
      ]
    },
    {
      "id": "campaign_conclusion",
      "type": "social",
      "title": "Heroes' Return",
      "background": "tavern_celebration.jpg",
      "music": "victory_celebration.mp3",
      "description": "You return to the Crossroads Tavern as heroes. The merchant is safe, the goblin threat is ended, and the village celebrates your success.",
      "npcs": [
        {
          "id": "grateful_merchant",
          "name": "Gareth the Merchant",
          "position": { "x": 40, "y": 60 },
          "sprite": "human_merchant_grateful.png",
          "relationship": 3,
          "dialogue": {
            "greeting": "I owe you my life! Please accept this reward as a token of my gratitude.",
            "nodes": [
              {
                "id": "reward_giving",
                "text": "Here's 300 gold pieces, and this magical ring I was carrying. It's yours now.",
                "choices": [
                  {
                    "id": "accept_graciously",
                    "text": "Thank you, Gareth. We're glad you're safe.",
                    "consequences": [
                      { "type": "add_gold", "value": 300 },
                      { "type": "add_item", "value": "ring_of_protection" },
                      { "type": "add_experience", "value": 500 }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "globalData": {
    "questItems": ["tracking_scroll", "torn_ledger", "evil_amulet"],
    "partyLevel": 2,
    "availableActions": ["combat", "dialogue", "exploration", "trading", "skill_checks"],
    "experienceRewards": {
      "goblin_warrior": 50,
      "goblin_archer": 25,
      "goblin_boss": 200,
      "grimfang_boss": 700,
      "quest_completion": 1000
    }
  }
}
```

## 📜 Shorter Sample Campaign: "Village Festival Mystery"

### village-mystery.json
```json
{
  "campaignId": "village_festival",
  "title": "The Festival Phantom",
  "description": "Strange occurrences plague the annual Harvest Festival. The party must investigate mysterious disappearances and uncover the truth.",
  "difficulty": "beginner",
  "estimatedDuration": "1-2 hours",
  "playerLevels": [1, 2],
  "scenes": [
    {
      "id": "festival_square",
      "type": "town",
      "title": "Festival Square",
      "background": "village_festival.jpg",
      "music": "festive_celebration.mp3",
      "description": "The village square bustles with festival activity. Colorful banners flutter in the breeze, but an undercurrent of worry is evident among the villagers.",
      "npcs": [
        {
          "id": "festival_organizer",
          "name": "Mayor Hendricks",
          "position": { "x": 50, "y": 40 },
          "sprite": "human_mayor.png",
          "relationship": 0,
          "dialogue": {
            "greeting": "Oh, thank goodness! Are you the investigators we sent for?",
            "nodes": [
              {
                "id": "mystery_intro",
                "text": "Three people have vanished during the festival preparations. They were here one moment, gone the next. No one saw them leave.",
                "choices": [
                  {
                    "id": "investigate",
                    "text": "We'll look into these disappearances.",
                    "nextNode": "investigation_start",
                    "consequences": [
                      { "type": "add_quest", "value": "festival_mystery" }
                    ]
                  }
                ]
              }
            ]
          }
        },
        {
          "id": "worried_baker",
          "name": "Martha the Baker",
          "position": { "x": 30, "y": 70 },
          "sprite": "human_baker_female.png",
          "relationship": 0,
          "dialogue": {
            "greeting": "My husband Tom was helping set up the pie booth yesterday evening. Now he's nowhere to be found!",
            "nodes": [
              {
                "id": "husband_details",
                "text": "He was carrying a tray of pies to the booth when I last saw him. Found the tray on the ground, pies scattered everywhere.",
                "choices": [
                  {
                    "id": "examine_scene",
                    "text": "Can you show us where this happened?",
                    "consequences": [
                      { "type": "add_clue", "value": "pie_booth_scene" }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ],
      "encounters": [
        {
          "id": "investigate_pie_booth",
          "type": "discovery",
          "triggerChance": 1.0,
          "position": { "x": 25, "y": 85 },
          "data": {
            "description": "The pie booth area shows signs of a struggle. Pies are scattered on the ground.",
            "investigation_dc": 10,
            "success_result": "You notice strange, luminescent residue on the ground leading toward the old mill.",
            "clue": "magical_trail"
          }
        }
      ],
      "transitions": [
        {
          "to": "old_mill",
          "trigger": "area_explored",
          "position": { "x": 85, "y": 60 },
          "label": "Follow the Trail to the Old Mill",
          "requirements": [
            { "type": "has_clue", "value": "magical_trail" }
          ]
        }
      ]
    },
    {
      "id": "old_mill",
      "type": "dungeon",
      "title": "The Abandoned Mill",
      "background": "old_windmill_interior.jpg",
      "music": "mysterious_tension.mp3",
      "description": "The old mill has been abandoned for years, but the magical trail leads directly inside. Strange lights flicker through the broken windows.",
      "npcs": [
        {
          "id": "apprentice_wizard",
          "name": "Kelvin the Apprentice",
          "position": { "x": 60, "y": 50 },
          "sprite": "human_wizard_young.png",
          "relationship": -1,
          "dialogue": {
            "greeting": "Stay back! I... I didn't mean for this to happen!",
            "nodes": [
              {
                "id": "confession",
                "text": "I was practicing teleportation magic for my master's test. The spell went wrong and started pulling people here instead of objects!",
                "choices": [
                  {
                    "id": "help_fix",
                    "text": "We can help you fix this. Where are the missing people?",
                    "nextNode": "reveal_location"
                  },
                  {
                    "id": "demand_answers",
                    "text": "You've caused enough trouble! Fix this now!",
                    "nextNode": "defensive_response"
                  }
                ]
              },
              {
                "id": "reveal_location",
                "text": "They're trapped in a magical pocket dimension. I can reverse the spell, but I need help stabilizing the magical energy.",
                "choices": [
                  {
                    "id": "assist_ritual",
                    "text": "Tell us what to do.",
                    "consequences": [
                      { "type": "start_ritual", "value": "rescue_ritual" }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ],
      "encounters": [
        {
          "id": "magical_rescue",
          "type": "skill_check",
          "triggerChance": 1.0,
          "position": { "x": 50, "y": 30 },
          "data": {
            "description": "You must help stabilize the magical energies to rescue the trapped villagers.",
            "skill_required": "arcana",
            "dc": 12,
            "success": "The spell succeeds! The missing villagers materialize safely in the mill.",
            "failure": "The magic becomes unstable - you'll need to try a different approach.",
            "alternative_skills": ["investigation", "religion"]
          }
        }
      ],
      "transitions": [
        {
          "to": "festival_resolution",
          "trigger": "quest_completed",
          "position": { "x": 40, "y": 80 },
          "label": "Return to the Festival",
          "requirements": [
            { "type": "ritual_completed", "value": "rescue_ritual" }
          ]
        }
      ]
    },
    {
      "id": "festival_resolution",
      "type": "social",
      "title": "Festival Saved",
      "background": "village_festival_evening.jpg",
      "music": "peaceful_resolution.mp3",
      "description": "The festival continues with all villagers safely returned. The young wizard has learned a valuable lesson about practicing magic responsibly.",
      "npcs": [
        {
          "id": "grateful_mayor",
          "name": "Mayor Hendricks",
          "position": { "x": 50, "y": 50 },
          "sprite": "human_mayor_happy.png",
          "relationship": 2,
          "dialogue": {
            "greeting": "The festival is saved! Please, enjoy the celebration as our honored guests.",
            "nodes": [
              {
                "id": "reward_ceremony",
                "text": "Here's a small reward from the village treasury, and please take these festival treats!",
                "choices": [
                  {
                    "id": "accept_reward",
                    "text": "Thank you for your hospitality.",
                    "consequences": [
                      { "type": "add_gold", "value": 100 },
                      { "type": "add_item", "value": "festival_treats" },
                      { "type": "add_experience", "value": 200 }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    }
  ],
  "globalData": {
    "questItems": ["magical_residue", "apprentice_spellbook"],
    "partyLevel": 1,
    "availableActions": ["dialogue", "exploration", "skill_checks"],
    "experienceRewards": {
      "quest_completion": 300,
      "peaceful_resolution": 100
    }
  }
}
``` 