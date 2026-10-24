import { AmortizationRow, AmortizationSchedule, CurrencyCode, LoanParameters } from '../types';

/**
 * Calculates standard monthly annuity payment (French amortization system)
 */
export function calculateAnnuityPayment(principal: number, monthlyRateDecimal: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRateDecimal <= 0) return principal / months;

  const factor = Math.pow(1 + monthlyRateDecimal, months);
  return (principal * monthlyRateDecimal * factor) / (factor - 1);
}

/**
 * Converts monthly nominal rate to Annual Effective Rate (E.A.)
 */
export function monthlyToAnnualEffective(monthlyRatePercent: number): number {
  const r = monthlyRatePercent / 100;
  return (Math.pow(1 + r, 12) - 1) * 100;
}

/**
 * Converts Annual Effective Rate (E.A.) to monthly nominal rate
 */
export function annualEffectiveToMonthly(annualRatePercent: number): number {
  const ea = annualRatePercent / 100;
  return (Math.pow(1 + ea, 1 / 12) - 1) * 100;
}

/**
 * Adds months to a date preserving the day of month where possible
 */
export function addMonthsToDate(baseDateStr: string, monthsToAdd: number): string {
  const parts = baseDateStr.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  const targetDate = new Date(year, month + monthsToAdd, day);
  
  // Format as DD/MM/YYYY
  const dd = String(targetDate.getDate()).padStart(2, '0');
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  const yyyy = targetDate.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Formats a number to currency with financial parentheses for negative values
 */
export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'COP',
  useAccountingNegative = true
): string {
  const isNegative = value < -0.0001;
  const absValue = Math.abs(Math.round(value));

  // Determine currency symbol and separator
  let formatted = '';
  if (currency === 'COP') {
    // Colombian style: dots for thousands, e.g., $100.000.000
    formatted = `$${absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  } else if (currency === 'USD') {
    formatted = `$${absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  } else if (currency === 'EUR') {
    formatted = `€${absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  } else {
    formatted = `$${absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  if (isNegative) {
    return useAccountingNegative ? `(${formatted})` : `-${formatted}`;
  }
  return formatted;
}

/**
 * Generates the full amortization schedule and summary statistics
 */
export function generateAmortizationSchedule(params: LoanParameters): AmortizationSchedule {
  const { amount, months, monthlyRate, paymentMode, customPayment, disbursementDate, extraPayments = [] } = params;

  const rDecimal = Math.max(0, monthlyRate) / 100;
  const standardPayment = calculateAnnuityPayment(amount, rDecimal, months);
  const firstMonthInterest = amount * rDecimal;

  const targetMonthlyPayment = paymentMode === 'manual' ? customPayment : standardPayment;
  const isNegativeAmortization = targetMonthlyPayment < firstMonthInterest;

  const extraPaymentsMap = new Map<number, number>();
  extraPayments.forEach((ep) => {
    extraPaymentsMap.set(ep.period, (extraPaymentsMap.get(ep.period) || 0) + ep.amount);
  });

  const rows: AmortizationRow[] = [];
  let currentBalance = amount;
  let totalInterestPaid = 0;
  let totalPaid = 0;
  let totalPrincipalPaid = 0;
  let totalExtraPaid = 0;
  let payoffPeriod: number | null = null;

  // Max periods to compute: exactly 'months' (capped at 600), or until paid off if amortizing
  const maxPeriods = Math.min(600, Math.max(1, months));

  for (let period = 1; period <= maxPeriods; period++) {
    if (currentBalance <= 0.01 && !isNegativeAmortization) {
      if (payoffPeriod === null) payoffPeriod = period - 1;
      break;
    }

    const beginningBalance = currentBalance;
    const interest = beginningBalance * rDecimal;
    const extraPayment = extraPaymentsMap.get(period) || 0;

    let payment = targetMonthlyPayment;
    let principal = 0;
    let endingBalance = 0;

    if (isNegativeAmortization) {
      // Payment does not cover interest.
      // Principal = payment - interest (negative value)
      // Ending balance = beginning balance - principal = beginning balance + (interest - payment)
      principal = payment - interest;
      endingBalance = beginningBalance - principal - extraPayment;
      totalInterestPaid += interest;
      totalPaid += payment + extraPayment;
      totalPrincipalPaid += principal;
      totalExtraPaid += extraPayment;
      currentBalance = endingBalance;
    } else {
      // Viable repayment
      const balanceWithInterest = beginningBalance + interest;

      if (payment >= balanceWithInterest) {
        // Last payment adjustment
        payment = balanceWithInterest;
        principal = beginningBalance;
        endingBalance = 0;
        payoffPeriod = period;
      } else {
        principal = payment - interest;
        endingBalance = Math.max(0, beginningBalance - principal - extraPayment);
        if (endingBalance <= 0) {
          payoffPeriod = period;
        }
      }

      totalInterestPaid += interest;
      totalPaid += payment + extraPayment;
      totalPrincipalPaid += principal;
      totalExtraPaid += extraPayment;
      currentBalance = endingBalance;
    }

    const dateStr = addMonthsToDate(disbursementDate, period);

    rows.push({
      period,
      date: dateStr,
      beginningBalance,
      payment,
      interest,
      principal,
      extraPayment,
      endingBalance: Math.max(0, endingBalance),
    });

    // If fully paid off, stop generating further rows
    if (endingBalance <= 0.01 && !isNegativeAmortization) {
      break;
    }
  }

  // Derive human-readable years and remaining months
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let statusMessage = '';
  let statusType: 'danger' | 'success' | 'warning' = 'success';

  if (isNegativeAmortization) {
    statusType = 'danger';
    statusMessage = '⚠ La cuota no cubre los intereses del primer mes: la deuda nunca se paga';
  } else if (targetMonthlyPayment === firstMonthInterest) {
    statusType = 'warning';
    statusMessage = '⚠ La cuota solo cubre los intereses: el capital nunca disminuye';
  } else {
    statusType = 'success';
    if (payoffPeriod && payoffPeriod < months) {
      statusMessage = `✓ Crédito liquidado con éxito en la cuota ${payoffPeriod} (${Math.floor(payoffPeriod / 12)} años y ${payoffPeriod % 12} meses)`;
    } else {
      statusMessage = `✓ Crédito viable: se amortiza completamente en ${months} meses`;
    }
  }

  return {
    rows,
    firstMonthInterest,
    calculatedStandardPayment: standardPayment,
    actualMonthlyPayment: targetMonthlyPayment,
    totalInterestPaid,
    totalPaid,
    totalPrincipalPaid,
    totalExtraPaid,
    isNegativeAmortization,
    statusMessage,
    statusType,
    payoffPeriod: isNegativeAmortization ? null : (payoffPeriod ?? months),
    years,
    remainingMonths,
  };
}
