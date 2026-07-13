export function calculateGoalProgress(
  current: number,
  target: number
) {
  if (target === 0) return 0;

  return Math.min(
    (current / target) * 100,
    100
  );
}

export function remainingAmount(
  current: number,
  target: number
) {
  return Math.max(
    target - current,
    0
  );
}