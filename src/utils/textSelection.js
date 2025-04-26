export function updateSelection(optionTexts, selectedIndex, styles = {}) {
  const {
    selectedColor = "#eb6339",
    normalColor = "#FFFFFF",
    fontStyle = "bold",
  } = styles;

  optionTexts.forEach((text, index) => {
    if (index === selectedIndex) {
      text.setStyle({ color: selectedColor, fontStyle });
    } else {
      text.setStyle({ color: normalColor, fontStyle: "normal" });
    }
  });
}
