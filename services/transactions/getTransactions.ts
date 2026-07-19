import type { Transaction } from "@/types/transaction";

type PlaidTransaction = {
  transaction_id: string;
  transaction_date: string;
  amount: number;
  name: string | null;
  merchant_name: string | null;
  personal_finance_primary: string | null;
  category: string[] | null;
  pending: boolean;
  is_removed: boolean;
};

type TransactionsApiResponse = {
  success: boolean;
  transactions?: PlaidTransaction[];
  error?: string;
};

function createNumericId(
  transactionId: string,
  index: number
): number {
  let hash = 0;

  for (
    let position = 0;
    position < transactionId.length;
    position += 1
  ) {
    hash =
      (hash * 31 +
        transactionId.charCodeAt(position)) |
      0;
  }

  const positiveHash = Math.abs(hash);

  return positiveHash || index + 1;
}

function getCategory(
  transaction: PlaidTransaction
): string {
  if (transaction.personal_finance_primary) {
    return transaction.personal_finance_primary;
  }

  if (
    Array.isArray(transaction.category) &&
    transaction.category.length > 0
  ) {
    return transaction.category[0];
  }

  return "Uncategorized";
}

function getDescription(
  transaction: PlaidTransaction
): string {
  return (
    transaction.merchant_name ??
    transaction.name ??
    "Unknown Transaction"
  );
}

function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export async function getTransactions(): Promise<Transaction[]> {
  const baseUrl = getApiBaseUrl();

  const response = await fetch(
    `${baseUrl}/api/transactions?limit=500`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const result =
    (await response.json()) as TransactionsApiResponse;

  if (!response.ok || !result.success) {
    throw new Error(
      result.error ??
        "Unable to load Plaid transactions."
    );
  }

  const plaidTransactions =
    result.transactions ?? [];

  const transactions = plaidTransactions
    .filter(
      (transaction) =>
        !transaction.is_removed &&
        !transaction.pending
    )
    .map(
      (
        transaction,
        index
      ): Transaction => ({
        id: createNumericId(
          transaction.transaction_id,
          index
        ),

        date: transaction.transaction_date,

        category: getCategory(transaction),

        description:
          getDescription(transaction),

        amount: Math.abs(
          Number(transaction.amount)
        ),

        type:
          Number(transaction.amount) >= 0
            ? "expense"
            : "income",
      })
    )
    .sort(
      (first, second) =>
        new Date(second.date).getTime() -
        new Date(first.date).getTime()
    );

  return transactions;
}