export type HousingCost = {
  payment: number;
  propertyTax: number;
  insurance: number;
  hoa: number;
  pmi: number;
  total: number;
};

export function calculateHousingCost(
  price: number,
  rate: number,
  downPercent: number
): HousingCost {

  const loan =
    price * (1 - downPercent / 100);

  const payment =
    (loan * (rate / 100 / 12)) /
    (1 -
      Math.pow(
        1 + rate / 100 / 12,
        -360
      ));

  const propertyTax =
    price * 0.018 / 12;

  const insurance =
    price * 0.004 / 12;

  const hoa = 75;

  const pmi =
    downPercent >= 20
      ? 0
      : loan * 0.005 / 12;

  return {

    payment,

    propertyTax,

    insurance,

    hoa,

    pmi,

    total:
      payment +
      propertyTax +
      insurance +
      hoa +
      pmi,

  };

}