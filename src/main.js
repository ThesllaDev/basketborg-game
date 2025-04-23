import Phaser from "phaser";
import MenuScene from "./scenes/MenuScene";

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  scene: [MenuScene],
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
