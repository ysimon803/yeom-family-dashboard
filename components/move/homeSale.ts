export function calculateHomeSaleProceeds({

  currentValue,

  mortgage,

  annualGrowth = 3,

  sellingCostPercent = 6,

}: {

  currentValue:number;

  mortgage:number;

  annualGrowth?:number;

  sellingCostPercent?:number;

}) {


  let value = currentValue;



  for(
    let year = 2026;
    year < 2028;
    year++
  ){

    value *=
      1 + annualGrowth / 100;

  }



  const sellingCost =

    value *
    (sellingCostPercent / 100);



  return (

    value
    -
    sellingCost
    -
    mortgage

  );

}