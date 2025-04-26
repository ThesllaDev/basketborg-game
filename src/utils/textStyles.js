export const getTextStyles = (width) => ({
  title: {
    font: "bold 60px Fira Code",
    color: "#eb6339",
    wordWrap: { width: width - 80 },
  },
  instruction: {
    font: "bold 36px Fira Code",
    color: "#AAAAAA",
    wordWrap: { width: width - 100 },
  },
  menuOption: { fontSize: "48px", color: "#FFFFFF" },
  selectedOption: {
    font: "bold 48px Fira Code",
    color: "#eb6339",
  },
});
