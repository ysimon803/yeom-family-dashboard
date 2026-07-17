export interface Transaction {
  id?: string;
  transaction_id: string;
  account_id: string;
  name: string;
  merchant_name?: string | null;
  amount: number;
  date: string;
  category?: string | string[] | null;

  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;

  pending?: boolean | null;
  iso_currency_code?: string | null;
}

export interface TransactionsResponse {
  success: boolean;
  count: number;
  transactions: Transaction[];
}

export async function getTransactions(
  limit = 10
): Promise<TransactionsResponse> {
  const response = await fetch(
    `/api/transactions?limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to load transactions: ${response.status}`
    );
  }

  const data =
    (await response.json()) as TransactionsResponse;

  if (!data.success) {
    throw new Error("Transaction request was unsuccessful");
  }

  return {
    success: true,
    count: data.count ?? data.transactions?.length ?? 0,
    transactions: data.transactions ?? [],
  };
}