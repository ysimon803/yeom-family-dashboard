type Props = {
  title: string;
  balance: number;
};

export default function AccountCard({
  title,
  balance,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <p className="text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-blue-600">
        ${Math.round(balance).toLocaleString()}
      </h2>

    </div>
  );
}