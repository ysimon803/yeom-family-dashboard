type Props = {
  currentYear: number;
  targetYear: number;
};

export default function MoveTimeline({
  currentYear,
  targetYear,
}: Props) {

  const years = [];

  for (let year = currentYear; year <= targetYear; year++) {
    years.push(year);
  }

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        🗓️ Move Timeline
      </h2>

      <div className="mt-8 flex justify-between">

        {years.map((year) => (

          <div
            key={year}
            className="flex flex-col items-center"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">

              {year}

            </div>

            <div className="mt-3 text-sm">

              {year === targetYear
                ? "Move"
                : "Planning"}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}