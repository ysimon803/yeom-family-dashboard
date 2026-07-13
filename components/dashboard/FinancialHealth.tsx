import {
  getTIExposure,
} from "@/lib/finance";

import {
  getHouseProgress,
} from "@/lib/calculations";

export default function FinancialHealth() {

  const ti = getTIExposure();

  const house = getHouseProgress();

  const emergency = 50;

  const retirement = 88;

  const overall = Math.round(
    (100 - ti / 2 + retirement + emergency + house) / 4
  );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold mb-6">
        📊 Financial Health
      </h2>

      <div className="text-center">

        <div className="text-6xl font-bold text-blue-600">
          {overall}
        </div>

        <div className="text-slate-500">
          Overall Score
        </div>

      </div>

      <div className="mt-8 space-y-4">

        <Row
          title="Retirement"
          value={`${retirement}/100`}
        />

        <Row
          title="House Goal"
          value={`${house.toFixed(0)}/100`}
        />

        <Row
          title="Emergency Fund"
          value={`${emergency}/100`}
        />

        <Row
          title="TI Diversification"
          value={`${(100-ti).toFixed(0)}/100`}
        />

      </div>

    </div>
  );
}

function Row({
  title,
  value,
}:{
  title:string;
  value:string;
}){

  return(
    <div className="flex justify-between">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  )

}