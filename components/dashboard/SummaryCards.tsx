type Props = {
  netWorth: number;
  assets: number;
  investments: number;
  cash: number;
};

export default function SummaryCards({
  netWorth,
  assets,
  investments,
  cash,
}: Props) {
  return (
    <div className="grid grid-cols-4 gap-6">

      <Card
        title="Net Worth"
        value={netWorth}
        color="text-blue-600"
      />

      <Card
        title="Assets"
        value={assets}
        color="text-green-600"
      />

      <Card
        title="Investments"
        value={investments}
        color="text-purple-600"
      />

      <Card
        title="Cash"
        value={cash}
        color="text-orange-600"
      />

    </div>
  );
}

function Card({
  title,
  value,
  color,
}:{
  title:string;
  value:number;
  color:string;
}){

  return(

    <div className="rounded-2xl bg-white p-6 shadow">

      <div className="text-slate-500">
        {title}
      </div>

      <div className={`mt-4 text-4xl font-bold ${color}`}>
        ${value.toLocaleString()}
      </div>

    </div>

  )

}