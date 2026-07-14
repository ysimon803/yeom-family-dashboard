"use client";

type Asset = {
  name: string;
  value: number;
};

type Props = {
  assets: Asset[];
};

export default function AssetSummary({
  assets,
}: Props) {

  const total =
    assets.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );


  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">
        📊 Asset Summary
      </h2>


      <div className="mt-8 space-y-4">


        {assets.map((asset) => (

          <div
            key={asset.name}
            className="flex justify-between border-b py-3"
          >

            <span className="font-semibold">

              {asset.name}

            </span>


            <span className="font-bold text-blue-600">

              ${Math.round(
                asset.value
              ).toLocaleString()}

            </span>


          </div>

        ))}


        <div className="mt-6 flex justify-between text-xl">

          <span className="font-bold">
            Total Assets
          </span>


          <span className="font-bold text-green-600">

            ${Math.round(
              total
            ).toLocaleString()}

          </span>


        </div>


      </div>


    </div>

  );

}