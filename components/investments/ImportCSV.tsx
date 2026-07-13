"use client";

import Papa from "papaparse";

type Props = {
  onImport: (rows: any[]) => void;
};

export default function ImportCSV({
  onImport,
}: Props) {

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = e.target.files?.[0];

    if (!file) return;

    Papa.parse(file, {

      header: true,

      complete(results) {

        onImport(results.data);

      },

    });

  }

  return (

    <label className="cursor-pointer rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700">

      📄 Import CSV

      <input
        type="file"
        accept=".csv"
        hidden
        onChange={handleFile}
      />

    </label>

  );

}