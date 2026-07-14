"use client";

type Goal = {
  title: string;
  current: number;
  target: number;
  icon: string;
};

type Props = {
  goals: Goal[];
};


export default function GoalProgress({
  goals,
}: Props) {

  return (

    <div className="grid grid-cols-2 gap-6">

      {goals.map((goal) => {

        const progress =
          Math.min(
            (goal.current / goal.target) * 100,
            100
          );


        return (

          <div
            key={goal.title}
            className="rounded-2xl bg-white p-8 shadow"
          >

            <h2 className="text-2xl font-bold">

              {goal.icon} {goal.title}

            </h2>


            <div className="mt-6 text-4xl font-bold text-blue-600">

              {progress.toFixed(1)}%

            </div>


            <div className="mt-6 h-4 rounded-full bg-slate-200">

              <div

                className="h-4 rounded-full bg-blue-600"

                style={{
                  width: `${progress}%`,
                }}

              />

            </div>


            <div className="mt-4 flex justify-between text-sm">

              <span>

                ${Math.round(
                  goal.current
                ).toLocaleString()}

              </span>


              <span>

                ${Math.round(
                  goal.target
                ).toLocaleString()}

              </span>


            </div>


          </div>

        );

      })}

    </div>

  );

}