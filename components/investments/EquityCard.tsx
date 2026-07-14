type Props = {
  title: string;
  value: number;
};

export default function EquityCard({
  title,
  value,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-6 shadow">

      <p className="text-slate-500">

        {title}

      </p>

      <h2 className="mt-3 text-3xl font-bold text-indigo-600">

        ${Math.round(value).toLocaleString()}

      </h2>

    </div>

  );

}