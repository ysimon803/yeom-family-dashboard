type Props = {
  retirementAssets: number;
  withdrawalRate?: number;
  socialSecurity?: number;
};

export default function RetirementIncome({
  retirementAssets,
  withdrawalRate = 4,
  socialSecurity = 3000,
}: Props) {

  const portfolioIncome =
    retirementAssets *
    (withdrawalRate / 100) /
    12;


  const totalIncome =
    portfolioIncome +
    socialSecurity;


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🏖️ Retirement Income Simulation
      </h2>


      <div className="mt-8 space-y-4">


        <div className="flex justify-between">

          <span>
            Portfolio Withdrawal (4%)
          </span>

          <span className="font-bold">

            ${Math.round(
              portfolioIncome
            ).toLocaleString()}/mo

          </span>

        </div>



        <div className="flex justify-between">

          <span>
            Social Security Estimate
          </span>

          <span className="font-bold">

            ${socialSecurity.toLocaleString()}/mo

          </span>

        </div>



        <hr />



        <div className="flex justify-between text-xl">

          <span className="font-bold">
            Total Monthly Income
          </span>


          <span className="font-bold text-green-600">

            ${Math.round(
              totalIncome
            ).toLocaleString()}/mo

          </span>


        </div>


      </div>


    </div>

  );

}