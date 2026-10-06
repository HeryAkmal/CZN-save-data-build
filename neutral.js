const NEUTRAL = {
  negotiate: {
    name: "Negotiate",
    cost: 1,
    type: "Skill",
    icon: "skill",
    tags: ["Retain / Exhaust"],
    text: "2 Morale<br />2 Morale to all enemies",
    epiphanies: {
      draw: {
        text: "2 Morale<br />2 Morale to all enemies<br />Draw 2",
      },
    },
  },
  "spore-harvester": {
    name: "Spore Harvester",
    cost: 0,
    type: "Skill",
    icon: "skill",
    tags: ["Retain / Exhaust"],
    text: "Incinerate: Create 2 Contaminated Spore<br />Retain: Create 1 Contaminated Spore",
    epiphanies: {
      draw: {
        text: "Incinerate: Create 2 Contaminated Spore<br />Retain: Create 1 Contaminated Spore<br />Draw 1",
      },
    },
  },
  persona: {
    name: "Persona",
    cost: 1,
    type: "Skill",
    icon: "skill",
    tags: ["Unique / Exhaust 2"],
    text: "250% Shield<br/>Move 1 random Attack Card(s) of this unit from Graveyard to hand",
  },
  "one-with-all": {
    name: "One With All",
    cost: "🛇",
    type: "Skill",
    icon: "skill",
    tags: ["Finale / Exhaust"],
    text: "Select and proc 1 card(s) in hand, Draw Pile, or Discard Pile<br/>For 1 turn, when each of Damage, Shield, and Heal has been activated through cards, remove Unactivable",
  },
};
