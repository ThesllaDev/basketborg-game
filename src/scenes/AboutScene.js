import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { settings } from "../utils/settings";
import { TEXT_CONTENT } from "../utils/textContent";
import { transitionScene } from "../utils/sceneTransitions";
import { getTextStyles } from "../utils/textStyles";
import { setupKeyboardNavigation } from "../utils/keyboardNavigation";
import { updateSelection } from "../utils/textSelection";

export default class AboutScene extends Phaser.Scene {
  constructor() {
    super({ key: "AboutScene" });
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const { width, height } = this.scale;
    const TEXT_STYLES = getTextStyles(width);

    const titleTextContent = TEXT_CONTENT.about.title;
    const descriptionTextContent = TEXT_CONTENT.about.description;
    const buttonTextContent = TEXT_CONTENT.about.button;

    this.add
      .text(width / 2, 60, titleTextContent, TEXT_STYLES.title)
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height / 2,
        descriptionTextContent,
        TEXT_STYLES.instruction
      )
      .setOrigin(0.5);

    const button = this.add
      .text(width / 2, height - 100, buttonTextContent, {
        fontSize: "28px",
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true, ariaLabel: buttonTextContent })
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
      speakSequence([titleTextContent, descriptionTextContent], () => {
        speak(buttonTextContent);
      });
    }
  }
}
