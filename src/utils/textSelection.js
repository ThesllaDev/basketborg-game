export function updateSelection(
  optionTexts,
  selectedIndex,
  styles = {},
  scene
) {
  const {
    selectedColor = "#eb6339",
    normalColor = "#FFFFFF",
    fontStyle = "bold",
    scaleSelected = 1.2,
    scaleNormal = 1,
  } = styles;

  optionTexts.forEach((text, index) => {
    if (index === selectedIndex) {
      text.setStyle({ color: selectedColor, fontStyle });
      scene.tweens.add({
        targets: text,
        scale: scaleSelected,
        duration: 150,
        ease: "Power2",
      });
    } else {
      text.setStyle({ color: normalColor, fontStyle: "normal" });
      scene.tweens.add({
        targets: text,
        scale: scaleNormal,
        duration: 150,
        ease: "Power2",
      });
    }
  });
}
