export function calculateMortgagePayment(
  loanAmount: number,
  annualRate: number,
  years = 30
) {
  const monthlyRate = annualRate / 100 / 12;

  const payments = years * 12;

  if (monthlyRate === 0) {
    return loanAmount / payments;
  }

  return (
    loanAmount *
    (
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        payments
      )
    ) /
    (
      Math.pow(
        1 + monthlyRate,
        payments
      ) - 1
    )
  );
}

export function calculatePropertyTax(
  homePrice: number,
  taxRate: number
) {
  return homePrice * taxRate / 100 / 12;
}

export function calculateInsurance(
  yearlyInsurance: number
) {
  return yearlyInsurance / 12;
}

export function calculateHOA(
  yearlyHOA: number
) {
  return yearlyHOA / 12;
}