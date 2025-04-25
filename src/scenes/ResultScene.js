import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { settings } from "../utils/settings";
import { TEXT_CONTENT } from "../utils/textContent";

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: "ResultScene" });
  }

  create(data) {
    const { width, height } = this.scale;
    const { success, decision } = data;

    const titleTextContent = TEXT_CONTENT.result.title;
    const resultTextContent = success
      ? TEXT_CONTENT.result.success(decision)
      : TEXT_CONTENT.result.failure(decision);
    const buttonTextContent = TEXT_CONTENT.result.button;

    this.add
      .text(width / 2, 60, titleTextContent, {
        fontSize: "40px",
        color: "#FFFFFF",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, resultTextContent, {
        fontSize: "28px",
        color: "#FFFFFF",
        wordWrap: { width: width - 100 },
        align: "center",
      })
      .setOrigin(0.5);

    const button = this.add
      .text(width / 2, height - 100, buttonTextContent, {
        fontSize: "28px",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MenuScene"));

    this.input.keyboard.on("keydown", (event) => {
      if (event.code === "Enter" || event.code === "Space") {
        this.scene.start("MenuScene");
      }
    });

    if (settings.voiceEnabled) {
      speakSequence([titleTextContent, resultTextContent], () => {
        this.sound.play("whistle");
        setTimeout(() => {
          speak(buttonTextContent);
        }, 1500);
      });
    } else {
      this.sound.play("whistle");
    }
  }
}
