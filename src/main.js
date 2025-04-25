import Phaser from "phaser";
import MenuScene from "./scenes/MenuScene";
import TrainingScene from "./scenes/TrainingScene";
import GameScene from "./scenes/GameScene";
import ResultScene from "./scenes/ResultScene";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scene: [MenuScene, TrainingScene, GameScene, ResultScene],
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
  },
};

new Phaser.Game(config);
