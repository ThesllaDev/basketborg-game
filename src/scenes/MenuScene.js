import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { TEXT_CONTENT } from "../utils/textContent";
import { settings } from "../utils/settings";
import { transitionScene } from "../utils/sceneTransitions";
import { getTextStyles } from "../utils/textStyles";
import { setupKeyboardNavigation } from "../utils/keyboardNavigation";
import { updateSelection } from "../utils/textSelection";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    this.load.audio("whistle", "/sounds/whistle.wav");
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const { width, height } = this.scale;

    const TEXT_STYLES = getTextStyles(width);

    this.menuOptions = TEXT_CONTENT.menu.options;
    this.optionTexts = [];
    this.selectedIndex = 0;

    const title = this.add
      .text(width / 2, 60, TEXT_CONTENT.menu.title, TEXT_STYLES.title)
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        160,
        TEXT_CONTENT.menu.instruction,
        TEXT_STYLES.instruction
      )
      .setOrigin(0.5);

    if (settings.voiceEnabled) {
      speakSequence([
        TEXT_CONTENT.menu.title,
        TEXT_CONTENT.menu.instruction,
        ...this.menuOptions,
      ]);
    }

    this.menuOptions.forEach((option, index) => {
      const text = this.add
        .text(width / 2, height / 2 + index * 60, option, {
          fontSize: "48px",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true, ariaLabel: option })
        .on("pointerdown", () => {
          this.executeOption(option);
        })
        .on("pointerover", () => {
          this.selectedIndex = index;
          updateSelection(this.optionTexts, this.selectedIndex, {}, this);
          if (settings.voiceEnabled) speak(option);
        });

      this.optionTexts.push(text);
    });

    setupKeyboardNavigation(this, this.menuOptions, {
      onNavigate: (selectedIndex) => {
        updateSelection(this.optionTexts, selectedIndex, {}, this);
        if (settings.voiceEnabled) speak(this.menuOptions[selectedIndex]);
      },
      onSelect: (selectedIndex) => {
        this.executeOption(this.menuOptions[selectedIndex]);
      },
    });
  }

  executeOption(option) {
    switch (option) {
      case "Play":
        transitionScene(this, "TrainingScene");
        break;
      case "Voice: On":
      case "Voice: Off":
        settings.voiceEnabled = !settings.voiceEnabled;
        this.menuOptions[1] = settings.voiceEnabled
          ? "Voice: On"
          : "Voice: Off";
        this.optionTexts[1].setText(this.menuOptions[1]);
        if (settings.voiceEnabled) speak(this.menuOptions[1]);
        break;
      case "About":
        transitionScene(this, "AboutScene");
        break;
    }
  }
}
