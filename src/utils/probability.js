const chanceCache = new Map();

export function gaussianRandom(mean, stdDev) {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return (
    Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * stdDev + mean
  );
}

export function estimateChanceOfSuccess(statValue, samples = 1000) {
  if (chanceCache.has(statValue)) {
    return chanceCache.get(statValue);
  }

  let successCount = 0;

  for (let i = 0; i < samples; i++) {
    const roll =
      (Phaser.Math.Between(0, 100) + Phaser.Math.Between(0, 100)) / 2;
    if (statValue >= roll) {
      successCount++;
    }
  }

  const percentage = Math.round((successCount / samples) * 100);
  chanceCache.set(statValue, percentage);
  return percentage;
}
