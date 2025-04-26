import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { settings } from "../utils/settings";
import { TEXT_CONTENT } from "../utils/textContent";
import { transitionScene } from "../utils/sceneTransitions";
import { getTextStyles } from "../utils/textStyles";
import { setupKeyboardNavigation } from "../utils/keyboardNavigation";
import { updateSelection } from "../utils/textSelection";

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: "ResultScene" });
  }

  create(data) {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const { width, height } = this.scale;
    const TEXT_STYLES = getTextStyles(width);
    const { success, decision } = data;

    const titleTextContent = TEXT_CONTENT.result.title;
    const resultTextContent = success
      ? TEXT_CONTENT.result.success(decision)
      : TEXT_CONTENT.result.failure(decision);
    const buttonTextContent = TEXT_CONTENT.result.button;

    this.add
      .text(width / 2, 60, titleTextContent, TEXT_STYLES.title)
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2, resultTextContent, TEXT_STYLES.instruction)
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
      .on("pointerover", () => {
        updateSelection([button], 0, {}, this);
        if (settings.voiceEnabled) speak(buttonTextContent);
      })
      .on("pointerout", () => {
        button.setStyle({ backgroundColor: "#ffffff" });
        this.tweens.add({
          targets: button,
          scale: 1,
          duration: 150,
          ease: "Power2",
        });
      })
      .on("pointerdown", () => {
        transitionScene(this, "MenuScene");
      });

    this.selectedIndex = 0;

    setupKeyboardNavigation(this, [button], {
      onNavigate: () => {
        updateSelection([button], 0, {}, this);
        if (settings.voiceEnabled) speak(buttonTextContent);
      },
      onSelect: () => {
        transitionScene(this, "MenuScene");
      },
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

    if (success) {
      this.showConfetti();
    }
  }

  showConfetti() {
    const emitter = this.add.particles(0, 0, "confetti", {
      x: { min: 0, max: this.scale.width },
      y: 0,
      speedY: { min: 200, max: 500 },
      speedX: { min: -100, max: 100 },
      lifespan: 3000,
      scale: { start: 0.6, end: 0 },
      rotate: { min: -180, max: 180 },
      angle: { min: 260, max: 280 },
      quantity: 12,
      blendMode: "ADD",
    });

    this.time.delayedCall(3500, () => emitter.stop());
  }
}
