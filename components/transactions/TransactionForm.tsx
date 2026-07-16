"use client";

type Props = {
  date: string;
  setDate: (value: string) => void;

  type: string;
  setType: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  amount: string;
  setAmount: (value: string) => void;
};

export default function TransactionForm({
  date,
  setDate,
  type,
  setType,
  category,
  setCategory,
  description,
  setDescription,
  amount,
  setAmount,
}: Props) {
  return (
    <div className="space-y-5">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full rounded-xl border p-3"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded-xl border p-3"
      />
    </div>
  );
}