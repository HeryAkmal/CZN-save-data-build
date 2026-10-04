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
};
