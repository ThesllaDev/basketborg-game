export const TEXT_CONTENT = {
  menu: {
    title: "Welcome to Basketborg Game",
    instruction:
      "Use the arrow keys to navigate and press enter or space to select.",
    options: ["Play", "Voice: On"],
  },
  training: {
    title: "Training Session",
    instruction: "Select a training option:",
    stats: {
      passing: "Passing",
      shooting: "Shooting",
      dribbling: "Dribbling",
    },
    options: [
      { key: "passing", label: "Train Pass" },
      { key: "shooting", label: "Train Shoot" },
      { key: "dribbling", label: "Train Dribble" },
      { key: "startGame", label: "Going to the game" },
    ],
  },
  game: {
		title: "Game Situation",
    situation:
      "There are only a few seconds left in the game and you already have possession of the ball, make your choice:",
    options: [
      { key: "passing", label: "Setting up the play and passing the ball" },
      { key: "shooting", label: "Mid-range shot" },
      { key: "shooting", label: "Long-range shot" },
      { key: "dribbling", label: "Dribble and layup" },
    ],
  },
};
