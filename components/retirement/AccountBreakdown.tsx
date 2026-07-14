type Account = {
  name: string;
  balance: number;
};

type Props = {
  accounts: Account[];
};

export default function AccountBreakdown({
  accounts,
}: Props) {

  const total =
    accounts.reduce(
      (sum, item) =>
        sum + item.balance,
      0
    );


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        📊 Retirement Account Breakdown
      </h2>


      <div className="mt-8 space-y-4">

        {accounts.map((account) => (

          <div
            key={account.name}
            className="flex justify-between border-b py-3"
          >

            <span className="font-semibold">
              {account.name}
            </span>


            <span className="font-bold text-blue-600">

              ${Math.round(
                account.balance
              ).toLocaleString()}

            </span>


          </div>

        ))}


        <div className="mt-6 flex justify-between text-xl">

          <span className="font-bold">
            Total
          </span>

          <span className="font-bold text-green-600">

            ${Math.round(
              total
            ).toLocaleString()}

          </span>

        </div>


      </div>

    </div>

  );

}