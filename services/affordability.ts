export type AffordabilityStatus =
  | "Comfortable"
  | "Moderate"
  | "High";


export function calculateDTI(
  monthlyHousingCost: number,
  monthlyIncome: number
) {

  if (monthlyIncome === 0) {
    return 0;
  }


  return (
    monthlyHousingCost /
    monthlyIncome
  ) * 100;

}



export function getAffordabilityStatus(
  dti: number
): AffordabilityStatus {


  if (dti < 30) {

    return "Comfortable";

  }


  if (dti < 43) {

    return "Moderate";

  }


  return "High";

}



export function getAffordabilityMessage(
  status: AffordabilityStatus
) {


  switch(status) {


    case "Comfortable":

      return (
        "Your housing cost is within a comfortable range."
      );


    case "Moderate":

      return (
        "Your housing cost is manageable but requires budgeting."
      );


    case "High":

      return (
        "Your housing cost is high. Strong savings discipline is recommended."
      );


  }

}