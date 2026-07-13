export function calculateRSUValue(
  shares: number,
  currentPrice: number
) {
  return shares * currentPrice;
}

export function calculateRSUTax(
  gross: number,
  taxRate: number
) {
  return gross * taxRate / 100;
}

export function calculateRSUNet(
  gross: number,
  taxRate: number
) {
  return gross - calculateRSUTax(gross, taxRate);
}