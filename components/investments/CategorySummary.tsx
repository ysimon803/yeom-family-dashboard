import CategoryCard from "./CategoryCard";

type Props = {
  grouped: Record<
    string,
    {
      balance: number;
    }[]
  >;
};

export default function CategorySummary({
  grouped,
}: Props) {

  return (

    <div className="grid grid-cols-3 gap-6">

      {Object.entries(grouped).map(
        ([category, items]) => {

          const total = items.reduce(
            (sum, item) => sum + item.balance,
            0
          );

          return (

            <CategoryCard
              key={category}
              title={category}
              total={total}
            />

          );

        }
      )}

    </div>

  );

}