export interface RetirementAccount {
  id: string;

  name: string;

  value: number;

  category: string;
}

export interface House {
  currentValue: number;

  mortgage: number;

  equity: number;

  interestRate: number;
}