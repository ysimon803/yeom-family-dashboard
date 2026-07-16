export type FinancialProfile = {
  id: number;

  // Profile
  full_name: string;
  email: string;
  timezone: string;
  currency: string;

  // Financial
  monthly_income: number;
  monthly_savings: number;
  emergency_fund: number;
  net_worth: number;

  // Investment
  retirement_assets: number;
  rsu_value: number;
  stock_option_value: number;
  cash: number;

  // House
  target_home_price: number;
  down_payment_percent: number;
  target_move_year: number;
};