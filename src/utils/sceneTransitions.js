export function transitionScene(scene, nextSceneKey, data = {}) {
  scene.cameras.main.fadeOut(500, 0, 0, 0);
  scene.cameras.main.once("camerafadeoutcomplete", () => {
    scene.scene.start(nextSceneKey, data);
  });
}
