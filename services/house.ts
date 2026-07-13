export function calculateMonthlyMortgage(
  loanAmount: number,
  interestRate: number,
  years: number = 30
) {

  const monthlyRate =
    interestRate / 100 / 12;


  const numberOfPayments =
    years * 12;


  if (monthlyRate === 0) {

    return loanAmount / numberOfPayments;

  }


  return (
    loanAmount *
    (
      monthlyRate *
      Math.pow(
        1 + monthlyRate,
        numberOfPayments
      )
    )
    /
    (
      Math.pow(
        1 + monthlyRate,
        numberOfPayments
      ) - 1
    )
  );

}



export function calculatePropertyTax(
  homePrice: number,
  taxRate: number
) {

  return (
    homePrice *
    (taxRate / 100)
    /
    12
  );

}



export function calculateMonthlyInsurance(
  yearlyInsurance: number
) {

  return yearlyInsurance / 12;

}



export function calculateMonthlyHOA(
  yearlyHOA: number
) {

  return yearlyHOA / 12;

}



export function calculateHousingCost({

  homePrice,

  downPayment,

  interestRate,

  propertyTaxRate,

  insurance,

  hoa,

}: {

  homePrice:number;

  downPayment:number;

  interestRate:number;

  propertyTaxRate:number;

  insurance:number;

  hoa:number;

}) {


  const loanAmount =
    homePrice - downPayment;


  const mortgage =
    calculateMonthlyMortgage(
      loanAmount,
      interestRate
    );


  const tax =
    calculatePropertyTax(
      homePrice,
      propertyTaxRate
    );


  const monthlyInsurance =
    calculateMonthlyInsurance(
      insurance
    );


  const monthlyHoa =
    calculateMonthlyHOA(
      hoa
    );


  const total =
    mortgage +
    tax +
    monthlyInsurance +
    monthlyHoa;


  return {

    loanAmount,

    mortgage,

    tax,

    insurance:
      monthlyInsurance,

    hoa:
      monthlyHoa,

    total,

  };

}