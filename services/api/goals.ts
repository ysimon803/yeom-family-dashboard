import { supabase } from "@/lib/supabase";

export interface FinancialGoal {
  id: number;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  priority: number;
  color: string;
  progress: number;
  remainingAmount: number;
  remainingMonths:
    | number
    | null;
  requiredMonthlySavings:
    | number
    | null;
  isCompleted: boolean;
}

interface FinancialGoalRow {
  id: number | string;
  name: string | null;
  category:
    | string
    | null;
  target_amount:
    | number
    | string
    | null;
  current_amount:
    | number
    | string
    | null;
  target_date:
    | string
    | null;
  priority:
    | number
    | string
    | null;
  color: string | null;
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

function clampPercentage(
  value: number
): number {
  return Math.min(
    Math.max(value, 0),
    100
  );
}

function getRemainingMonths(
  targetDate:
    | string
    | null
): number | null {
  if (!targetDate) {
    return null;
  }

  const target = new Date(
    `${targetDate}T00:00:00`
  );

  if (
    Number.isNaN(
      target.getTime()
    )
  ) {
    return null;
  }

  const today =
    new Date();

  const yearDifference =
    target.getFullYear() -
    today.getFullYear();

  const monthDifference =
    target.getMonth() -
    today.getMonth();

  const totalMonths =
    yearDifference * 12 +
    monthDifference;

  return Math.max(
    totalMonths,
    0
  );
}

function getRequiredMonthlySavings(
  remainingAmount: number,
  remainingMonths:
    | number
    | null
): number | null {
  if (
    remainingAmount <= 0
  ) {
    return 0;
  }

  if (
    remainingMonths ===
      null ||
    remainingMonths <= 0
  ) {
    return null;
  }

  return (
    remainingAmount /
    remainingMonths
  );
}

function mapGoalRow(
  row: FinancialGoalRow
): FinancialGoal {
  const targetAmount =
    toNumber(
      row.target_amount
    );

  const currentAmount =
    toNumber(
      row.current_amount
    );

  const priority =
    toNumber(
      row.priority
    );

  const progress =
    targetAmount > 0
      ? clampPercentage(
          (currentAmount /
            targetAmount) *
            100
        )
      : 0;

  const remainingAmount =
    Math.max(
      targetAmount -
        currentAmount,
      0
    );

  const remainingMonths =
    getRemainingMonths(
      row.target_date
    );

  const requiredMonthlySavings =
    getRequiredMonthlySavings(
      remainingAmount,
      remainingMonths
    );

  return {
    id: toNumber(row.id),
    name:
      row.name ??
      "Unnamed Goal",
    category:
      row.category ??
      "other",
    targetAmount,
    currentAmount,
    targetDate:
      row.target_date,
    priority,
    color:
      row.color ??
      "#2563eb",
    progress,
    remainingAmount,
    remainingMonths,
    requiredMonthlySavings,
    isCompleted:
      targetAmount > 0 &&
      currentAmount >=
        targetAmount,
  };
}

export async function getFinancialGoals(): Promise<
  FinancialGoal[]
> {
  const { data, error } =
    await supabase
      .from(
        "financial_goals"
      )
      .select(
        `
          id,
          name,
          category,
          target_amount,
          current_amount,
          target_date,
          priority,
          color
        `
      )
      .order(
        "priority",
        {
          ascending: true,
        }
      )
      .order(
        "created_at",
        {
          ascending: true,
        }
      );

  if (error) {
    throw new Error(
      `Unable to load financial goals: ${error.message}`
    );
  }

  const rows =
    (data ??
      []) as FinancialGoalRow[];

  return rows.map(
    mapGoalRow
  );
}

export async function updateFinancialGoalAmount(
  id: number,
  currentAmount: number
): Promise<FinancialGoal> {
  const safeCurrentAmount =
    Math.max(
      currentAmount,
      0
    );

  const { data, error } =
    await supabase
      .from(
        "financial_goals"
      )
      .update({
        current_amount:
          safeCurrentAmount,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
          id,
          name,
          category,
          target_amount,
          current_amount,
          target_date,
          priority,
          color
        `
      )
      .single();

  if (error) {
    throw new Error(
      `Unable to update financial goal: ${error.message}`
    );
  }

  return mapGoalRow(
    data as FinancialGoalRow
  );
}