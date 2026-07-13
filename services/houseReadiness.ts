export type ReadinessLevel =
  | "Excellent"
  | "Good"
  | "Risk";


export function calculateDownPaymentScore(
  current: number,
  target: number
) {

  if (target === 0) return 0;


  const percent =
    (current / target) * 100;


  if (percent >= 100) {

    return 40;

  }


  if (percent >= 75) {

    return 30;

  }


  if (percent >= 50) {

    return 20;

  }


  return 10;

}



export function calculateDTIScore(
  dti:number
) {


  if (dti < 30) {

    return 40;

  }


  if (dti < 43) {

    return 30;

  }


  return 15;

}



export function calculateCashFlowScore(
  remaining:number
) {


  if (remaining >= 5000) {

    return 20;

  }


  if (remaining >= 3000) {

    return 10;

  }


  return 5;

}



export function calculateReadinessLevel(
  score:number
):ReadinessLevel {


  if(score >= 90){

    return "Excellent";

  }


  if(score >= 70){

    return "Good";

  }


  return "Risk";

}



export function calculatePurchaseReadiness(
  downPaymentScore:number,
  dtiScore:number,
  cashFlowScore:number
){

  const score =
    downPaymentScore +
    dtiScore +
    cashFlowScore;


  return {

    score,

    level:
      calculateReadinessLevel(score),

  };

}