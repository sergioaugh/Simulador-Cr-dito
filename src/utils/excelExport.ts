import * as XLSX from 'xlsx';
import { AmortizationSchedule, LoanParameters } from '../types';

/**
 * Exports the amortization simulation to an Excel file (.xlsx) matching the structure
 * and details of the template provided by the user.
 */
export function exportToExcel(params: LoanParameters, schedule: AmortizationSchedule): void {
  const { amount, months, monthlyRate, disbursementDate, paymentMode } = params;
  const {
    rows,
    years,
    remainingMonths,
    actualMonthlyPayment,
    totalInterestPaid,
    totalPaid,
    firstMonthInterest,
    statusMessage,
  } = schedule;

  // Format date display for disbursement
  const dateParts = disbursementDate.split('-');
  const formattedDisbursement = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

  // Build spreadsheet data rows
  const wsData: (string | number | null)[][] = [
    ['Simulación de crédito – Tabla de amortización (COP)', null, null, null, null, null, null],
    ['Generado desde el Simulador de Crédito Web. Compatible con Excel y Google Sheets.', null, null, null, null, null, null],
    [],
    ['Monto del crédito', amount, null, 'Plazo del crédito (meses)', months, null, null],
    [
      'Tasa de interés nominal mensual',
      `${monthlyRate.toFixed(2)}%`,
      null,
      'Plazo (años y meses)',
      `${years} años y ${remainingMonths} meses`,
      null,
      null,
    ],
    ['Cuota mensual', actualMonthlyPayment, null, 'Total intereses pagados', Math.round(totalInterestPaid), null, null],
    ['Fecha de desembolso', formattedDisbursement, null, 'Total pagado (capital + intereses)', Math.round(totalPaid), null, null],
    [null, null, null, 'Estado', statusMessage, null, null],
    ['Interés del 1.er mes:', Math.round(firstMonthInterest), null, 'Modo de cuota', paymentMode === 'manual' ? 'Manual libre' : 'Calculada fija (Sistema Francés)', null, null],
    [],
    ['N° cuota', 'Fecha de pago', 'Saldo inicial', 'Cuota', 'Interés', 'Abono a capital', 'Saldo final'],
  ];

  // Append amortization rows
  rows.forEach((r) => {
    wsData.push([
      r.period,
      r.date,
      Math.round(r.beginningBalance),
      Math.round(r.payment),
      Math.round(r.interest),
      Math.round(r.principal),
      Math.round(r.endingBalance),
    ]);
  });

  // Append footer notes
  wsData.push([]);
  wsData.push([
    'Notas: la tabla admite hasta 600 cuotas. La última cuota se ajusta automáticamente al saldo restante. Tasa mensual ingresada como porcentaje.',
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths for clean readability
  worksheet['!cols'] = [
    { wch: 12 }, // N° cuota / labels
    { wch: 18 }, // Fecha de pago / valores
    { wch: 18 }, // Saldo inicial
    { wch: 16 }, // Cuota
    { wch: 16 }, // Interés
    { wch: 18 }, // Abono a capital
    { wch: 20 }, // Saldo final
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Amortización');

  const fileName = `Simulacion_Credito_${params.amount}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Generates TSV (Tab-Separated Values) format of the table, perfect for pasting directly
 * into Google Sheets with 100% column formatting fidelity.
 */
export function generateGoogleSheetsTSV(params: LoanParameters, schedule: AmortizationSchedule): string {
  const lines: string[] = [];

  // Summary lines
  lines.push(`Simulación de crédito – Tabla de amortización (COP)\t\t\t\t\t\t`);
  lines.push(`Monto del crédito\t${Math.round(params.amount)}\t\tPlazo del crédito (meses)\t${params.months}`);
  lines.push(`Tasa nominal mensual\t${params.monthlyRate}%\t\tPlazo (años y meses)\t${schedule.years} años y ${schedule.remainingMonths} meses`);
  lines.push(`Cuota mensual\t${Math.round(schedule.actualMonthlyPayment)}\t\tTotal intereses\t${Math.round(schedule.totalInterestPaid)}`);
  lines.push(`Fecha de desembolso\t${params.disbursementDate}\t\tTotal pagado\t${Math.round(schedule.totalPaid)}`);
  lines.push(`Estado\t${schedule.statusMessage}`);
  lines.push(``);

  // Headers
  lines.push(`N° cuota\tFecha de pago\tSaldo inicial\tCuota\tInterés\tAbono a capital\tSaldo final`);

  // Rows
  schedule.rows.forEach((r) => {
    lines.push(
      `${r.period}\t${r.date}\t${Math.round(r.beginningBalance)}\t${Math.round(r.payment)}\t${Math.round(r.interest)}\t${Math.round(r.principal)}\t${Math.round(r.endingBalance)}`
    );
  });

  return lines.join('\n');
}
