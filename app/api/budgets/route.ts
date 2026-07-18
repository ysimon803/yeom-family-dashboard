import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface BudgetRequestBody {
  id?: unknown;
  category?: unknown;
  monthly_limit?: unknown;
  warning_percent?: unknown;
}

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not configured"
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured"
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function normalizeCategory(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeMonthlyLimit(
  value: unknown
): number | null {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100) / 100;
}

function normalizeWarningPercent(
  value: unknown
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return 80;
  }

  const percentage = Number(value);

  if (
    !Number.isFinite(percentage) ||
    percentage < 1 ||
    percentage > 100
  ) {
    return null;
  }

  return Math.round(percentage);
}

function normalizeId(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

/**
 * GET /api/budgets
 *
 * Returns all budget categories.
 */
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("budgets")
      .select(
        "id, category, monthly_limit, warning_percent, created_at"
      )
      .order("category", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      budgets: data ?? [],
    });
  } catch (error) {
    console.error("GET /api/budgets failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load budgets",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/budgets
 *
 * Creates a new budget.
 */
export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as BudgetRequestBody;

    const category = normalizeCategory(
      body.category
    );

    const monthlyLimit = normalizeMonthlyLimit(
      body.monthly_limit
    );

    const warningPercent =
      normalizeWarningPercent(
        body.warning_percent
      );

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (monthlyLimit === null) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Monthly limit must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }

    if (warningPercent === null) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Warning percentage must be between 1 and 100",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    const {
      data: existingBudget,
      error: existingBudgetError,
    } = await supabase
      .from("budgets")
      .select("id")
      .ilike("category", category)
      .maybeSingle();

    if (existingBudgetError) {
      throw existingBudgetError;
    }

    if (existingBudget) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A budget with this category already exists",
        },
        {
          status: 409,
        }
      );
    }

    const { data, error } = await supabase
      .from("budgets")
      .insert({
        category,
        monthly_limit: monthlyLimit,
        warning_percent: warningPercent,
      })
      .select(
        "id, category, monthly_limit, warning_percent, created_at"
      )
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        budget: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/budgets failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create budget",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PATCH /api/budgets
 *
 * Updates an existing budget.
 */
export async function PATCH(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as BudgetRequestBody;

    const id = normalizeId(body.id);

    const category = normalizeCategory(
      body.category
    );

    const monthlyLimit = normalizeMonthlyLimit(
      body.monthly_limit
    );

    const warningPercent =
      normalizeWarningPercent(
        body.warning_percent
      );

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Budget ID is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (monthlyLimit === null) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Monthly limit must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }

    if (warningPercent === null) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Warning percentage must be between 1 and 100",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    const {
      data: duplicateBudget,
      error: duplicateError,
    } = await supabase
      .from("budgets")
      .select("id")
      .ilike("category", category)
      .neq("id", id)
      .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (duplicateBudget) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A budget with this category already exists",
        },
        {
          status: 409,
        }
      );
    }

    const { data, error } = await supabase
      .from("budgets")
      .update({
        category,
        monthly_limit: monthlyLimit,
        warning_percent: warningPercent,
      })
      .eq("id", id)
      .select(
        "id, category, monthly_limit, warning_percent, created_at"
      )
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Budget was not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      budget: data,
    });
  } catch (error) {
    console.error(
      "PATCH /api/budgets failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update budget",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE /api/budgets?id=<budget-id>
 *
 * Deletes an existing budget.
 */
export async function DELETE(
  request: NextRequest
) {
  try {
    const id = normalizeId(
      request.nextUrl.searchParams.get("id")
    );

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Budget ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", id)
      .select("id, category")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Budget was not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      deletedBudget: data,
    });
  } catch (error) {
    console.error(
      "DELETE /api/budgets failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete budget",
      },
      {
        status: 500,
      }
    );
  }
}