import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { TEXT_CONTENT } from "../utils/textContent";
import { settings } from "../utils/settings";
import { transitionScene } from "../utils/sceneTransitions";
import { getTextStyles } from "../utils/textStyles";
import { setupKeyboardNavigation } from "../utils/keyboardNavigation";
import { updateSelection } from "../utils/textSelection";

export default class TrainingScene extends Phaser.Scene {
  constructor() {
    super({ key: "TrainingScene" });
    this.stats = {
      passing: 30,
      shooting: 30,
      dribbling: 30,
    };
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const { width, height } = this.scale;
    const TEXT_STYLES = getTextStyles(width);

    this.add
      .text(width / 2, 60, TEXT_CONTENT.training.title, TEXT_STYLES.title)
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        110,
        TEXT_CONTENT.training.instruction,
        TEXT_STYLES.instruction
      )
      .setOrigin(0.5);

    this.statTexts = {};
    const keys = Object.keys(this.stats);
    keys.forEach((stat, i) => {
      this.statTexts[stat] = this.add
        .text(width / 2, 180 + i * 40, this.getStatText(stat), {
          fontSize: "28px",
          color: "#FFFFFF",
        })
        .setOrigin(0.5);
    });

    this.options = TEXT_CONTENT.training.options;
    this.optionTexts = [];
    this.selectedIndex = 0;

    this.options.forEach((option, index) => {
      const text = this.add
        .text(width / 2, 360 + index * 60, option.label, {
          fontSize: "36px",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.handleOption(option.key);
        })
        .on("pointerover", () => {
          this.selectedIndex = index;
          updateSelection(this.optionTexts, this.selectedIndex, {}, this);
          if (settings.voiceEnabled) speak(option.label);
        });

      this.optionTexts.push(text);
    });

    if (settings.voiceEnabled) {
      speakSequence([
        TEXT_CONTENT.training.title,
        TEXT_CONTENT.training.instruction,
        ...keys.map((k) => this.getStatText(k)),
        ...this.options.map((opt) => opt.label),
      ]);
    }

    setupKeyboardNavigation(this, this.options, {
      onNavigate: (selectedIndex) => {
        updateSelection(this.optionTexts, selectedIndex, {}, this);
        if (settings.voiceEnabled) speak(this.options[selectedIndex].label);
      },
      onSelect: (selectedIndex) => {
        this.handleOption(this.options[selectedIndex].key);
      },
    });
  }

  getStatText(stat) {
    return `${TEXT_CONTENT.training.stats[stat]}: ${this.stats[stat]}%`;
  }

  train(stat) {
    if (this.stats[stat] < 60) {
      this.stats[stat] += 10;
      this.statTexts[stat].setText(this.getStatText(stat));
      if (settings.voiceEnabled) speak(this.getStatText(stat));
    } else {
      if (settings.voiceEnabled)
        speak(
          `${TEXT_CONTENT.training.stats[stat]} is already at maximum: 60%`
        );
    }
  }

  handleOption(key) {
    if (key === "startGame") {
      if (settings.voiceEnabled) speak("Going to the game");
      transitionScene(this, "GameScene", { stats: this.stats });
    } else {
      this.train(key);
    }
  }
}
