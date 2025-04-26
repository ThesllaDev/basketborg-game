import Phaser from "phaser";
import { speak, speakSequence } from "../utils/speak";
import { TEXT_CONTENT } from "../utils/textContent";
import { settings } from "../utils/settings";
import { gaussianRandom, estimateChanceOfSuccess } from "../utils/probability";
import { transitionScene } from "../utils/sceneTransitions";
import { getTextStyles } from "../utils/textStyles";
import { setupKeyboardNavigation } from "../utils/keyboardNavigation";
import { updateSelection } from "../utils/textSelection";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.selectedIndex = 0;
    this.currentDecision = 0;
    this.totalDecisions = 10;
    this.points = 0;
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

    const { width, height } = this.scale;
    const TEXT_STYLES = getTextStyles(width);

    this.options = TEXT_CONTENT.game.options;

    this.add
      .text(width / 2, 60, TEXT_CONTENT.game.title, TEXT_STYLES.title)
      .setOrigin(0.5);

    this.currentSituation = this.getRandomSituation();

    this.situationText = this.add
      .text(
        width / 2,
        119,
        this.getSituationDisplayText(),
        TEXT_STYLES.instruction
      )
      .setOrigin(0.5);

    this.optionTexts = [];

    this.options.forEach((option, index) => {
      const stat = this.stats[option.key];
      const estimatedSuccess = estimateChanceOfSuccess(stat);
      const labelWithChance = `${option.label}: ${estimatedSuccess}% chance of success`;

      const text = this.add
        .text(width / 2, height / 2 + index * 60, labelWithChance, {
          fontSize: "32px",
          wordWrap: { width: width - 80 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true, ariaLabel: option.label })
        .on("pointerdown", () => {
          this.evaluateDecision(option.key, option.label);
        })
        .on("pointerover", () => {
          this.selectedIndex = index;
          updateSelection(this.optionTexts, this.selectedIndex, {}, this);
          if (settings.voiceEnabled) speak(option.label);
        });

      this.optionTexts.push(text);
    });

    if (settings.voiceEnabled) {
      this.speakSituationAndOptions();
    }

    setupKeyboardNavigation(this, this.options, {
      onNavigate: (selectedIndex) => {
        updateSelection(this.optionTexts, selectedIndex, {}, this);
        if (settings.voiceEnabled) speak(this.options[selectedIndex].label);
      },
      onSelect: (selectedIndex) => {
        const selected = this.options[selectedIndex];
        this.evaluateDecision(selected.key, selected.label);
      },
    });
  }

  getRandomSituation() {
    const situations = TEXT_CONTENT.game.situations;
    const randomIndex = Phaser.Math.Between(0, situations.length - 1);
    return situations[randomIndex];
  }

  getSituationDisplayText() {
    return `Play ${this.currentDecision + 1} of ${this.totalDecisions}: ${
      this.currentSituation
    }`;
  }

  speakSituationAndOptions() {
    const fullSpeech = [
      this.getSituationDisplayText(),
      ...this.options.map((opt) => {
        const chance = estimateChanceOfSuccess(this.stats[opt.key]);
        return `${opt.label}, ${chance}% chance of success`;
      }),
    ];
    speakSequence(fullSpeech);
  }

  evaluateDecision(statKey, decisionLabel) {
    const statValue = this.stats[statKey];
    const roll = gaussianRandom(statValue, 15);
    const success = roll >= 50;

    if (success) {
      this.points += 1;
    }

    this.currentDecision++;

    if (this.currentDecision >= this.totalDecisions) {
      const victory = this.points >= 5;
      if (settings.voiceEnabled) {
        speak(`You completed the plays.`, () => {
          transitionScene(this, "ResultScene", {
            success: victory,
            points: this.points,
            total: this.totalDecisions,
          });
        });
      } else {
        transitionScene(this, "ResultScene", {
          success: victory,
          points: this.points,
          total: this.totalDecisions,
        });
      }
    } else {
      this.currentSituation = this.getRandomSituation();
      this.situationText.setText(this.getSituationDisplayText());
      if (settings.voiceEnabled) {
        this.speakSituationAndOptions();
      }
    }
  }
}
