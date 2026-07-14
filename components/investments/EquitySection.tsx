import EquityCard from "./EquityCard";

type Props = {
  rsu: number;
  options: number;
};

export default function EquitySection({
  rsu,
  options,
}: Props) {

  return (

    <div className="grid grid-cols-2 gap-6">

      <EquityCard
        title="RSU"
        value={rsu}
      />

      <EquityCard
        title="Stock Options"
        value={options}
      />

    </div>

  );

}