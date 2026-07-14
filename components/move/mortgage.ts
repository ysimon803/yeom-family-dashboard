export function calculateMonthlyMortgage(
  price: number,
  downPercent: number,
  rate = 6,
  years = 30
) {

  const loan =
    price -
    price * (downPercent / 100);


  const monthlyRate =
    rate / 100 / 12;


  const payments =
    years * 12;


  const payment =
    loan *
    monthlyRate *
    Math.pow(
      1 + monthlyRate,
      payments
    ) /
    (
      Math.pow(
        1 + monthlyRate,
        payments
      ) - 1
    );


  return payment;

}