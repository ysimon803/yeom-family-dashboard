import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  SpendingAnalysisResult,
  SpendingInsight,
} from "@/services/ai/spendingAnalyzer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SpendingAdviceRequest {
  analysis?: SpendingAnalysisResult;
  analysisMonth?: string;
}

export interface SpendingAdviceResponse {
  success: boolean;
  advice?: {
    headline: string;
    summary: string;
    recommendations: string[];
  };
  error?: string;
}

interface GeneratedAdvice {
  headline: string;
  summary: string;
  recommendations: string[];
}

function formatCurrency(
  amount: number,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(
  value: number,
): string {
  return `${value.toFixed(1)}%`;
}

function sanitizeInsight(
  insight: SpendingInsight,
) {
  return {
    type: insight.type,
    title: insight.title,
    description: insight.description,
    category: insight.category ?? null,
    percentageChange:
      insight.percentageChange ?? null,
    amount: insight.amount ?? null,
  };
}

function buildAnalysisPrompt(
  analysis: SpendingAnalysisResult,
  analysisMonth?: string,
): string {
  const highestCategory =
    analysis.highestSpendingCategory;

  const analysisPayload = {
    analysisMonth:
      analysisMonth ?? "Current analysis month",

    totalSpending: formatCurrency(
      analysis.totalSpending,
    ),

    previousTotalSpending:
      formatCurrency(
        analysis.previousTotalSpending,
      ),

    spendingChangePercentage:
      formatPercentage(
        analysis.spendingChangePercentage,
      ),

    savingsAmount: formatCurrency(
      analysis.savingsAmount,
    ),

    savingsRate: formatPercentage(
      analysis.savingsRate,
    ),

    highestSpendingCategory:
      highestCategory
        ? {
            category:
              highestCategory.category,
            currentAmount:
              formatCurrency(
                highestCategory.currentAmount,
              ),
            previousAmount:
              formatCurrency(
                highestCategory.previousAmount ??
                  0,
              ),
            budgetAmount:
              formatCurrency(
                highestCategory.budgetAmount ??
                  0,
              ),
          }
        : null,

    overBudgetCategories:
      analysis.overBudgetCategories.map(
        (category) => ({
          category: category.category,
          currentAmount:
            formatCurrency(
              category.currentAmount,
            ),
          budgetAmount:
            formatCurrency(
              category.budgetAmount ?? 0,
            ),
        }),
      ),

    insights: analysis.insights
      .slice(0, 8)
      .map(sanitizeInsight),
  };

  return `
You are the AI financial advisor inside a personal finance application called WealthOS.

Analyze the provided monthly spending information and produce a concise household financial briefing.

Requirements:

1. Do not invent transactions, income, budgets, goals, or financial facts.
2. Use only the supplied analysis.
3. Do not provide tax, legal, investment, or credit guarantees.
4. Do not describe the user as irresponsible.
5. Keep the tone calm, practical, and supportive.
6. Focus on spending control, budget awareness, and savings opportunities.
7. The headline must be one short sentence.
8. The summary must be two or three short sentences.
9. Return exactly three practical recommendations.
10. Recommendations should be specific to the provided numbers whenever possible.
11. Do not use markdown.
12. Return valid JSON only.

Return this exact structure:

{
  "headline": "string",
  "summary": "string",
  "recommendations": [
    "string",
    "string",
    "string"
  ]
}

Monthly spending analysis:

${JSON.stringify(analysisPayload, null, 2)}
`.trim();
}

function extractJsonObject(
  text: string,
): string {
  const trimmedText = text.trim();

  if (
    trimmedText.startsWith("```") &&
    trimmedText.endsWith("```")
  ) {
    return trimmedText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  const firstBrace =
    trimmedText.indexOf("{");

  const lastBrace =
    trimmedText.lastIndexOf("}");

  if (
    firstBrace >= 0 &&
    lastBrace > firstBrace
  ) {
    return trimmedText.slice(
      firstBrace,
      lastBrace + 1,
    );
  }

  return trimmedText;
}

function isGeneratedAdvice(
  value: unknown,
): value is GeneratedAdvice {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Partial<GeneratedAdvice>;

  return (
    typeof candidate.headline ===
      "string" &&
    candidate.headline.trim().length >
      0 &&
    typeof candidate.summary ===
      "string" &&
    candidate.summary.trim().length >
      0 &&
    Array.isArray(
      candidate.recommendations,
    ) &&
    candidate.recommendations.length >
      0 &&
    candidate.recommendations.every(
      (recommendation) =>
        typeof recommendation ===
          "string" &&
        recommendation.trim().length >
          0,
    )
  );
}

function normalizeAdvice(
  advice: GeneratedAdvice,
): GeneratedAdvice {
  return {
    headline: advice.headline
      .trim()
      .slice(0, 180),

    summary: advice.summary
      .trim()
      .slice(0, 700),

    recommendations:
      advice.recommendations
        .map((recommendation) =>
          recommendation
            .trim()
            .slice(0, 300),
        )
        .filter(Boolean)
        .slice(0, 3),
  };
}

function validateAnalysis(
  analysis: unknown,
): analysis is SpendingAnalysisResult {
  if (
    typeof analysis !== "object" ||
    analysis === null
  ) {
    return false;
  }

  const candidate =
    analysis as Partial<SpendingAnalysisResult>;

  return (
    typeof candidate.totalSpending ===
      "number" &&
    Number.isFinite(
      candidate.totalSpending,
    ) &&
    typeof candidate.previousTotalSpending ===
      "number" &&
    Number.isFinite(
      candidate.previousTotalSpending,
    ) &&
    typeof candidate.spendingChangePercentage ===
      "number" &&
    Number.isFinite(
      candidate.spendingChangePercentage,
    ) &&
    typeof candidate.savingsAmount ===
      "number" &&
    Number.isFinite(
      candidate.savingsAmount,
    ) &&
    typeof candidate.savingsRate ===
      "number" &&
    Number.isFinite(
      candidate.savingsRate,
    ) &&
    Array.isArray(
      candidate.overBudgetCategories,
    ) &&
    Array.isArray(candidate.insights)
  );
}

export async function POST(
  request: Request,
) {
  try {
    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json<SpendingAdviceResponse>(
        {
          success: false,
          error:
            "OPENAI_API_KEY is not configured.",
        },
        {
          status: 503,
        },
      );
    }

    let body: SpendingAdviceRequest;

    try {
      body =
        (await request.json()) as SpendingAdviceRequest;
    } catch {
      return NextResponse.json<SpendingAdviceResponse>(
        {
          success: false,
          error:
            "The request body must contain valid JSON.",
        },
        {
          status: 400,
        },
      );
    }

    if (!validateAnalysis(body.analysis)) {
      return NextResponse.json<SpendingAdviceResponse>(
        {
          success: false,
          error:
            "A valid spending analysis is required.",
        },
        {
          status: 400,
        },
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    const response =
      await openai.responses.create({
        model: "gpt-5-mini",

        input: buildAnalysisPrompt(
          body.analysis,
          body.analysisMonth,
        ),

        max_output_tokens: 700,
      });

    const outputText =
      response.output_text?.trim();

    if (!outputText) {
      throw new Error(
        "OpenAI returned an empty response.",
      );
    }

    let parsedAdvice: unknown;

    try {
      parsedAdvice = JSON.parse(
        extractJsonObject(outputText),
      );
    } catch {
      throw new Error(
        "OpenAI returned an invalid response format.",
      );
    }

    if (!isGeneratedAdvice(parsedAdvice)) {
      throw new Error(
        "OpenAI returned incomplete financial advice.",
      );
    }

    const normalizedAdvice =
      normalizeAdvice(parsedAdvice);

    if (
      normalizedAdvice.recommendations
        .length === 0
    ) {
      throw new Error(
        "OpenAI did not return any recommendations.",
      );
    }

    return NextResponse.json<SpendingAdviceResponse>(
      {
        success: true,
        advice: normalizedAdvice,
      },
    );
  } catch (error) {
    console.error(
      "Spending advice generation failed:",
      error,
    );

    return NextResponse.json<SpendingAdviceResponse>(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate AI financial advice.",
      },
      {
        status: 500,
      },
    );
  }
}