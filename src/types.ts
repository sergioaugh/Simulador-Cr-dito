export type CurrencyCode = 'COP' | 'USD' | 'EUR' | 'MXN';

export interface ExtraPayment {
  period: number;
  amount: number;
  description?: string;
}

export interface LoanParameters {
  amount: number;
  months: number;
  rateType: 'monthly_nominal' | 'annual_effective';
  monthlyRate: number; // in percentage, e.g., 0.70 for 0.70%
  annualEffectiveRate: number; // in percentage, e.g., 8.73%
  paymentMode: 'calculated' | 'manual';
  customPayment: number;
  disbursementDate: string; // YYYY-MM-DD
  currency: CurrencyCode;
  extraPayments: ExtraPayment[];
}

export interface AmortizationRow {
  period: number;
  date: string; // DD/MM/YYYY
  beginningBalance: number;
  payment: number;
  interest: number;
  principal: number; // can be negative if payment < interest
  extraPayment: number;
  endingBalance: number;
}

export interface AmortizationSchedule {
  rows: AmortizationRow[];
  firstMonthInterest: number;
  calculatedStandardPayment: number;
  actualMonthlyPayment: number;
  totalInterestPaid: number;
  totalPaid: number;
  totalPrincipalPaid: number;
  totalExtraPaid: number;
  isNegativeAmortization: boolean;
  statusMessage: string;
  statusType: 'danger' | 'success' | 'warning';
  payoffPeriod: number | null;
  years: number;
  remainingMonths: number;
}
