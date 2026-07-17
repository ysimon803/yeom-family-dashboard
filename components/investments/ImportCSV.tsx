"use client";

import Papa, { type ParseResult } from "papaparse";

type CsvRow = Record<string, string>;

type Props = {
  onImport: (rows: CsvRow[]) => void;
};

export default function ImportCSV({
  onImport,
}: Props) {
  function handleFile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,

      complete(results: ParseResult<CsvRow>) {
        onImport(results.data);
      },

      error(error) {
        console.error("CSV import failed:", error);
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