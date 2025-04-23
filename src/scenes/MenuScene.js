export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 - 100, "🏀 Basketborg Game 🤖", {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 20, "Pressione ENTER para jogar", {
        fontSize: "18px",
        fontFamily: "Arial",
        color: "#cccccc",
      })
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-ENTER", () => {
      this.scene.start("GameScene");
    });
  }
}
