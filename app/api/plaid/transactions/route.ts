import { NextResponse } from "next/server";
import type {
  Transaction,
  TransactionsSyncRequest,
} from "plaid";

import { plaidClient } from "@/services/plaid/client";
import { supabaseAdmin } from "@/services/supabase/admin";

const PLAID_USER_ID = "wealthos-primary-user";
const MAX_SYNC_RESTARTS = 3;

type PlaidItemRow = {
  item_id: string;
  access_token: string;
  institution_name: string | null;
  transactions_cursor: string | null;
};

type RemovedTransaction = {
  transaction_id: string;
};

type SyncResult = {
  added: Transaction[];
  modified: Transaction[];
  removed: RemovedTransaction[];
  nextCursor: string;
  requestId: string | null;
};

type PlaidErrorShape = {
  response?: {
    data?: {
      error_code?: string;
      error_message?: string;
      request_id?: string;
    };
  };
};

function getPlaidError(error: unknown) {
  const plaidError = error as PlaidErrorShape;

  return {
    errorCode:
      plaidError.response?.data?.error_code ?? null,

    errorMessage:
      plaidError.response?.data?.error_message ?? null,

    requestId:
      plaidError.response?.data?.request_id ?? null,
  };
}

function toDatabaseTransaction(
  transaction: Transaction,
  item: PlaidItemRow,
) {
  return {
    user_id: PLAID_USER_ID,

    transaction_id: transaction.transaction_id,
    account_id: transaction.account_id,
    item_id: item.item_id,

    institution_name:
      item.institution_name ?? "Connected Institution",

    name: transaction.name,
    merchant_name: transaction.merchant_name,

    amount: transaction.amount,

    iso_currency_code: transaction.iso_currency_code,
    unofficial_currency_code:
      transaction.unofficial_currency_code,

    transaction_date: transaction.date,
    authorized_date: transaction.authorized_date,

    transaction_datetime: transaction.datetime,
    authorized_datetime:
      transaction.authorized_datetime,

    pending: transaction.pending,
    pending_transaction_id:
      transaction.pending_transaction_id,

    payment_channel: transaction.payment_channel,

    category: transaction.category,
    category_id: transaction.category_id,

    personal_finance_primary:
      transaction.personal_finance_category?.primary ??
      null,

    personal_finance_detailed:
      transaction.personal_finance_category?.detailed ??
      null,

    personal_finance_confidence:
      transaction.personal_finance_category
        ?.confidence_level ?? null,

    logo_url: transaction.logo_url,
    website: transaction.website,

    is_removed: false,
    updated_at: new Date().toISOString(),
  };
}

async function fetchTransactionChanges(
  item: PlaidItemRow,
): Promise<SyncResult> {
  /*
   * Plaid may return
   * TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION
   * if transactions change while multiple pages are loading.
   *
   * In that situation, restart from the cursor that existed
   * before the pagination loop began.
   */
  for (
    let attempt = 1;
    attempt <= MAX_SYNC_RESTARTS;
    attempt += 1
  ) {
    const startingCursor =
      item.transactions_cursor ?? undefined;

    let cursor = startingCursor;
    let hasMore = true;
    let requestId: string | null = null;

    const added: Transaction[] = [];
    const modified: Transaction[] = [];
    const removed: RemovedTransaction[] = [];

    try {
      while (hasMore) {
        const request: TransactionsSyncRequest = {
          access_token: item.access_token,
          cursor,
          count: 500,
        };

        const response =
          await plaidClient.transactionsSync(request);

        added.push(...response.data.added);
        modified.push(...response.data.modified);
        removed.push(...response.data.removed);

        cursor = response.data.next_cursor;
        hasMore = response.data.has_more;
        requestId = response.data.request_id;
      }

      if (!cursor) {
        throw new Error(
          "Plaid did not return a transactions cursor.",
        );
      }

      return {
        added,
        modified,
        removed,
        nextCursor: cursor,
        requestId,
      };
    } catch (error: unknown) {
      const plaidError = getPlaidError(error);

      const shouldRestart =
        plaidError.errorCode ===
        "TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION";

      if (
        shouldRestart &&
        attempt < MAX_SYNC_RESTARTS
      ) {
        console.warn(
          [
            "Plaid transactions changed during pagination.",
            `Restarting sync attempt ${attempt + 1}.`,
          ].join(" "),
        );

        continue;
      }

      throw error;
    }
  }

  throw new Error(
    "Transactions synchronization restart limit reached.",
  );
}

async function saveTransactions(
  transactions: Transaction[],
  item: PlaidItemRow,
) {
  if (transactions.length === 0) {
    return;
  }

  const rows = transactions.map((transaction) =>
    toDatabaseTransaction(transaction, item),
  );

  const { error } = await supabaseAdmin
    .from("plaid_transactions")
    .upsert(rows, {
      onConflict: "transaction_id",
      ignoreDuplicates: false,
    });

  if (error) {
    throw new Error(
      `Failed to upsert transactions: ${error.message}`,
    );
  }
}

async function markRemovedTransactions(
  removed: RemovedTransaction[],
  item: PlaidItemRow,
) {
  if (removed.length === 0) {
    return;
  }

  const transactionIds = removed.map(
    (transaction) => transaction.transaction_id,
  );

  const { error } = await supabaseAdmin
    .from("plaid_transactions")
    .update({
      is_removed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", PLAID_USER_ID)
    .eq("item_id", item.item_id)
    .in("transaction_id", transactionIds);

  if (error) {
    throw new Error(
      `Failed to mark removed transactions: ${error.message}`,
    );
  }
}

async function saveCursor(
  itemId: string,
  nextCursor: string,
) {
  const { error } = await supabaseAdmin
    .from("plaid_items")
    .update({
      transactions_cursor: nextCursor,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", PLAID_USER_ID)
    .eq("item_id", itemId);

  if (error) {
    throw new Error(
      `Failed to save transactions cursor: ${error.message}`,
    );
  }
}

export async function POST() {
  try {
    const { data, error } = await supabaseAdmin
      .from("plaid_items")
      .select(
        `
          item_id,
          access_token,
          institution_name,
          transactions_cursor
        `,
      )
      .eq("user_id", PLAID_USER_ID)
      .eq("status", "active");

    if (error) {
      throw new Error(
        `Failed to load Plaid Items: ${error.message}`,
      );
    }

    const items = (data ?? []) as PlaidItemRow[];

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active Plaid Items were found.",
        totalItems: 0,
        totalAdded: 0,
        totalModified: 0,
        totalRemoved: 0,
        items: [],
      });
    }

    /*
     * Process Items one at a time.
     *
     * This is slower than Promise.all, but it provides clearer
     * error handling while the integration is being built.
     */
    const results = [];

    for (const item of items) {
      const syncResult =
        await fetchTransactionChanges(item);

      /*
       * Added and modified transactions use the same upsert
       * operation. transaction_id is the conflict target.
       */
      await saveTransactions(
        [
          ...syncResult.added,
          ...syncResult.modified,
        ],
        item,
      );

      await markRemovedTransactions(
        syncResult.removed,
        item,
      );

      /*
       * Save the cursor only after transaction database changes
       * have succeeded.
       */
      await saveCursor(
        item.item_id,
        syncResult.nextCursor,
      );

      results.push({
        itemId: item.item_id,

        institutionName:
          item.institution_name ??
          "Connected Institution",

        previousCursor:
          item.transactions_cursor ?? null,

        nextCursor: syncResult.nextCursor,
        requestId: syncResult.requestId,

        added: syncResult.added.length,
        modified: syncResult.modified.length,
        removed: syncResult.removed.length,
      });
    }

    return NextResponse.json({
      success: true,

      totalItems: results.length,

      totalAdded: results.reduce(
        (total, result) => total + result.added,
        0,
      ),

      totalModified: results.reduce(
        (total, result) => total + result.modified,
        0,
      ),

      totalRemoved: results.reduce(
        (total, result) => total + result.removed,
        0,
      ),

      items: results,
    });
  } catch (error: unknown) {
    console.error(
      "Plaid transaction synchronization failed:",
      error,
    );

    const plaidError = getPlaidError(error);

    return NextResponse.json(
      {
        success: false,
        error:
          plaidError.errorMessage ??
          (error instanceof Error
            ? error.message
            : "Transaction synchronization failed."),

        plaidErrorCode: plaidError.errorCode,
        plaidRequestId: plaidError.requestId,
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Use POST to synchronize Plaid transactions.",
    },
    {
      status: 405,
      headers: {
        Allow: "POST",
      },
    },
  );
}