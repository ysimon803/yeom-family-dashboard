import { supabase } from "@/lib/supabase";
import { getNetWorthSummary } from "@/services/api/netWorth";

export interface NetWorthHistoryPoint {
  id: string;
  snapshotDate: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

interface NetWorthHistoryRow {
  id: string;
  snapshot_date: string;
  assets: number | string | null;
  liabilities:
    | number
    | string
    | null;
  net_worth:
    | number
    | string
    | null;
}

function toNumber(
  value:
    | number
    | string
    | null
): number {
  if (
    typeof value === "number"
  ) {
    return Number.isFinite(value)
      ? value
      : 0;
  }

  if (
    typeof value === "string"
  ) {
    const parsedValue =
      Number(value);

    return Number.isFinite(
      parsedValue
    )
      ? parsedValue
      : 0;
  }

  return 0;
}

function mapHistoryRow(
  row: NetWorthHistoryRow
): NetWorthHistoryPoint {
  return {
    id: row.id,
    snapshotDate:
      row.snapshot_date,
    assets: toNumber(
      row.assets
    ),
    liabilities: toNumber(
      row.liabilities
    ),
    netWorth: toNumber(
      row.net_worth
    ),
  };
}

function getMonthStartDate(
  date = new Date()
): string {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}-01`;
}

function getHistoryStartDate(
  months: number
): string {
  const date = new Date();

  date.setDate(1);

  date.setMonth(
    date.getMonth() -
      Math.max(
        months - 1,
        0
      )
  );

  return getMonthStartDate(
    date
  );
}

export async function saveCurrentNetWorthSnapshot(): Promise<void> {
  const summary =
    await getNetWorthSummary();

  const snapshotDate =
    getMonthStartDate();

  const { error } =
    await supabase
      .from(
        "net_worth_history"
      )
      .upsert(
        {
          snapshot_date:
            snapshotDate,
          assets:
            summary.assets,
          liabilities:
            summary.liabilities,
          net_worth:
            summary.netWorth,
          updated_at:
            new Date().toISOString(),
        },
        {
          onConflict:
            "snapshot_date",
        }
      );

  if (error) {
    throw new Error(
      `Unable to save net worth snapshot: ${error.message}`
    );
  }
}

export async function getNetWorthHistory(
  months = 12
): Promise<
  NetWorthHistoryPoint[]
> {
  const startDate =
    getHistoryStartDate(
      months
    );

  const { data, error } =
    await supabase
      .from(
        "net_worth_history"
      )
      .select(
        `
          id,
          snapshot_date,
          assets,
          liabilities,
          net_worth
        `
      )
      .gte(
        "snapshot_date",
        startDate
      )
      .order(
        "snapshot_date",
        {
          ascending: true,
        }
      );

  if (error) {
    throw new Error(
      `Unable to load net worth history: ${error.message}`
    );
  }

  const rows =
    (data ??
      []) as NetWorthHistoryRow[];

  return rows.map(
    mapHistoryRow
  );
}

export async function getNetWorthTrend(
  months = 12
): Promise<
  NetWorthHistoryPoint[]
> {
  await saveCurrentNetWorthSnapshot();

  return getNetWorthHistory(
    months
  );
}