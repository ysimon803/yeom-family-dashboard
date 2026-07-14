import EquitySection from "./EquitySection";

type Props = {
  rsu: number;
  options: number;
};

export default function EquityDashboard({
  rsu,
  options,
}: Props) {

  return (

    <div className="space-y-6">

      <h2 className="text-2xl font-bold">

        Company Equity

      </h2>

      <EquitySection
        rsu={rsu}
        options={options}
      />

    </div>

  );

}