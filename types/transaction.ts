export type Transaction = {
  id: number;

  date: string;

  category: string;

  description: string;

  amount: number;

  type: "income" | "expense";
};