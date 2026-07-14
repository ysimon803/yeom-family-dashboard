import type { Investment } from "@/types/investment";
import { calculateAllocation } from "@/services/investments/allocation";

type Props = {
  title: string;
  investments: Investment[];
};

export default function AccountGroup({
  title,
  investments,
}: Props) {

  const total = investments.reduce(
    (sum, item) => sum + item.balance,
    0
  );

  const allocation =
    calculateAllocation(investments);

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">

          {title}

        </h2>

        <span className="text-2xl font-bold text-blue-600">

          ${Math.round(total).toLocaleString()}

        </span>

      </div>

      <table className="mt-6 w-full">

        <thead>

          <tr className="border-b">

            <th className="py-3 text-left">
              Ticker
            </th>

            <th className="text-right">
              Balance
            </th>

            <th className="text-right">
              %
            </th>

          </tr>

        </thead>

        <tbody>

          {allocation.map((item) => (

            <tr
              key={item.id}
              className="border-b"
            >

              <td className="py-4">

                {item.ticker}

              </td>

              <td className="text-right">

                ${Math.round(item.balance).toLocaleString()}

              </td>

              <td className="text-right font-semibold">

                {item.allocation.toFixed(1)}%

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}