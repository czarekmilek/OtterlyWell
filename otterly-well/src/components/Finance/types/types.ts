export type FinanceType = "income" | "expense";

export interface FinanceCategory {
  id: string;
  user_id: string;
  name: string;
  type: FinanceType;
  created_at: string;
}

export interface FinanceTransaction {
  id: string;
  user_id: string;
  category_id: string | null;
  amount: number;
  type: FinanceType;
  date: string;
  title: string;
  description: string | null;
  created_at: string;
  finance_categories?: FinanceCategory | null;
}

export interface FinanceBudget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  month: number | null;
  year: number | null;
  created_at: string;
  finance_categories?: FinanceCategory | null;
}
