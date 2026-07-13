export function calculateAverageCost(
  shares: number,
  totalCost: number
) {
  if (shares === 0) return 0;

  return totalCost / shares;
}

export function calculateGain(
  currentValue: number,
  totalCost: number
) {
  return currentValue - totalCost;
}

export function calculateReturn(
  gain: number,
  totalCost: number
) {
  if (totalCost === 0) return 0;

  return (gain / totalCost) * 100;
}