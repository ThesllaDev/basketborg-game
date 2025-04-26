import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { TEXT_CONTENT } from "../utils/textContent";
import { settings } from "../utils/settings";
import { gaussianRandom, estimateChanceOfSuccess } from "../utils/probability";
import { transitionScene } from "../utils/sceneTransitions";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.selectedIndex = 0;
  }

  init(data) {
    this.stats = data.stats || {
      passing: 30,
      shooting: 30,
      dribbling: 30,
    };
  }

  create() {
    this.cameras.main.fadeIn(500, 0, 0, 0);

    const { width } = this.scale;

    const situationText = TEXT_CONTENT.game.situation;
    this.options = TEXT_CONTENT.game.options;

    this.add
      .text(width / 2, 60, TEXT_CONTENT.game.title, {
        fontSize: "60px",
        color: "#eb6339",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 110, situationText, {
        fontSize: "28px",
        color: "#FFFFFF",
        wordWrap: { width: width - 100 },
        align: "center",
      })
      .setOrigin(0.5);

    this.optionTexts = [];

    this.options.forEach((option, index) => {
      const stat = this.stats[option.key];
      const estimatedSuccess = estimateChanceOfSuccess(stat);
      const labelWithChance = `${option.label}: ${estimatedSuccess}% chance of success`;

      const text = this.add
        .text(width / 2, 200 + index * 60, labelWithChance, {
          fontSize: "32px",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.evaluateDecision(option.key, option.label);
        })
        .on("pointerover", () => {
          this.selectedIndex = index;
          this.updateSelection();
          if (settings.voiceEnabled) speak(option.label);
        });

      this.optionTexts.push(text);
    });

    this.updateSelection();

    if (settings.voiceEnabled) {
      const fullSpeech = [
        situationText,
        ...this.options.map((opt) => {
          const chance = estimateChanceOfSuccess(this.stats[opt.key]);
          return `${opt.label}, ${chance}% chance of success`;
        }),
      ];
      speakSequence(fullSpeech);
    }

    this.input.keyboard.on("keydown-UP", () => {
      this.selectedIndex = Phaser.Math.Wrap(
        this.selectedIndex - 1,
        0,
        this.options.length
      );
      this.updateSelection();
      if (settings.voiceEnabled) speak(this.options[this.selectedIndex].label);
    });

    this.input.keyboard.on("keydown-DOWN", () => {
      this.selectedIndex = Phaser.Math.Wrap(
        this.selectedIndex + 1,
        0,
        this.options.length
      );
      this.updateSelection();
      if (settings.voiceEnabled) speak(this.options[this.selectedIndex].label);
    });

    ["ENTER", "SPACE"].forEach((key) => {
      this.input.keyboard.on(`keydown-${key}`, () => {
        const selected = this.options[this.selectedIndex];
        this.evaluateDecision(selected.key, selected.label);
      });
    });
  }

  updateSelection() {
    this.optionTexts.forEach((text, index) => {
      if (index === this.selectedIndex) {
        text.setStyle({ color: "#eb6339", fontStyle: "bold" });
      } else {
        text.setStyle({ color: "#FFFFFF", fontStyle: "normal" });
      }
    });
  }

  evaluateDecision(statKey, decisionLabel) {
    const statValue = this.stats[statKey];
    const roll = gaussianRandom(statValue, 15);
    const success = roll >= 50;

    if (settings.voiceEnabled) {
      speak(`You chose: ${decisionLabel}`, () => {
        transitionScene(this, "ResultScene", {
          success,
          decision: decisionLabel,
        });
      });
    } else {
      transitionScene(this, "ResultScene", {
        success,
        decision: decisionLabel,
      });
    }
  }
}
