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

interface ApiTransaction {
  id?: string;
  transaction_id: string;
  account_id: string;
  name: string;
  merchant_name?: string | null;
  amount: number;

  transaction_date?: string | null;
  date?: string | null;

  category?: string | string[] | null;

  personal_finance_primary?: string | null;
  personal_finance_detailed?: string | null;

  personal_finance_category?: {
    primary?: string | null;
    detailed?: string | null;
  } | null;

  pending?: boolean | null;
  iso_currency_code?: string | null;
}

interface ApiTransactionsResponse {
  success: boolean;
  count?: number;
  limit?: number;
  offset?: number;
  transactions?: ApiTransaction[];
  error?: string;
}

export interface TransactionsResponse {
  success: boolean;
  count: number;
  transactions: Transaction[];
}

function mapTransaction(
  transaction: ApiTransaction
): Transaction | null {
  const date =
    transaction.date ??
    transaction.transaction_date ??
    null;

  if (!date) {
    return null;
  }

  return {
    id: transaction.id,
    transaction_id: transaction.transaction_id,
    account_id: transaction.account_id,
    name: transaction.name,
    merchant_name: transaction.merchant_name ?? null,
    amount: Number(transaction.amount),
    date,
    category: transaction.category ?? null,

    personal_finance_category: {
      primary:
        transaction.personal_finance_category?.primary ??
        transaction.personal_finance_primary ??
        null,

      detailed:
        transaction.personal_finance_category?.detailed ??
        transaction.personal_finance_detailed ??
        null,
    },

    pending: transaction.pending ?? false,
    iso_currency_code:
      transaction.iso_currency_code ?? null,
  };
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

  const data =
    (await response.json()) as ApiTransactionsResponse;

  if (!response.ok) {
    throw new Error(
      data.error ??
        `Unable to load transactions: ${response.status}`
    );
  }

  if (!data.success) {
    throw new Error(
      data.error ??
        "Transaction request was unsuccessful"
    );
  }

  const transactions = (
    data.transactions ?? []
  )
    .map(mapTransaction)
    .filter(
      (
        transaction
      ): transaction is Transaction =>
        transaction !== null
    );

  return {
    success: true,
    count: data.count ?? transactions.length,
    transactions,
  };
}