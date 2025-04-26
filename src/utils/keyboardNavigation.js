export function setupKeyboardNavigation(scene, options, callbacks) {
  const { onNavigate, onSelect } = callbacks;

  scene.input.keyboard.on("keydown-UP", () => {
    scene.selectedIndex = Phaser.Math.Wrap(
      scene.selectedIndex - 1,
      0,
      options.length
    );
    if (onNavigate) onNavigate(scene.selectedIndex);
  });

  scene.input.keyboard.on("keydown-DOWN", () => {
    scene.selectedIndex = Phaser.Math.Wrap(
      scene.selectedIndex + 1,
      0,
      options.length
    );
    if (onNavigate) onNavigate(scene.selectedIndex);
  });

  ["ENTER", "SPACE"].forEach((key) => {
    scene.input.keyboard.on(`keydown-${key}`, () => {
      if (onSelect) onSelect(scene.selectedIndex);
    });
  });
}
