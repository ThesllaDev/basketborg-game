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
    situations: [
      "There's only a few seconds left — it's now or never!",
      "Your teammate is calling for a pass.",
      "The defense looks weak on the left side.",
      "You're feeling the pressure, but you see an opening.",
      "The shot clock is about to expire!",
      "Crowd is getting louder — make your move!",
      "You spot an opportunity to dribble past.",
      "Coach yells: Trust your instincts!",
      "You hesitate for a split second — what will you do?",
      "You notice a mismatch you can exploit!",
    ],
    options: [
      { key: "passing", label: "Setting up the play and passing the ball" },
      { key: "shooting", label: "Mid-range shot" },
      { key: "shooting", label: "Long-range shot" },
      { key: "dribbling", label: "Dribble and layup" },
    ],
  },
  result: {
    title: "Final Score",
    success: (points, total) =>
      `Awesome! You nailed ${points} out of ${total} plays and took the win!`,
    failure: (points, total) =>
      `You made it through ${points} out of ${total} plays. Tough luck, but keep grinding and you'll get there!`,
    button: "Return to Menu",
  },
};
