export type FinancialProfile = {
  id: number;

  home_value: number;

  mortgage: number;

  cash: number;

  monthly_income: number;

  target_home_price: number;

  down_payment_percent: number;

  interest_rate: number;

  property_tax_rate: number;

  hoa: number;

  insurance: number;

  monthly_investment?: number;

  monthly_saving?: number;
};