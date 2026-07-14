type Props = {
  title: string;
  total: number;
};

export default function CategoryCard({
  title,
  total,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-6 shadow">

      <p className="text-slate-500">

        {title}

      </p>

      <h2 className="mt-3 text-3xl font-bold text-green-600">

        ${Math.round(total).toLocaleString()}

      </h2>

    </div>

  );

}