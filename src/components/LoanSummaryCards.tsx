import React from 'react';
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { AmortizationSchedule, LoanParameters } from '../types';
import { formatCurrency } from '../utils/amortization';

interface LoanSummaryCardsProps {
  params: LoanParameters;
  schedule: AmortizationSchedule;
}

export const LoanSummaryCards: React.FC<LoanSummaryCardsProps> = ({ params, schedule }) => {
  const {
    isNegativeAmortization,
    statusMessage,
    firstMonthInterest,
    actualMonthlyPayment,
    calculatedStandardPayment,
    totalPaid,
    totalInterestPaid,
    payoffPeriod,
  } = schedule;

  // Calculate percentage of principal vs interest in total payment
  const principalShare = totalPaid > 0 ? (params.amount / totalPaid) * 100 : 0;
  const interestShare = totalPaid > 0 ? (totalInterestPaid / totalPaid) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Primary Status Banner */}
      {isNegativeAmortization ? (
        <div className="p-4 sm:p-5 bg-red-50/90 border border-red-200 rounded-xl text-red-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm sm:text-base font-bold text-red-900">
                  {statusMessage}
                </h3>
                <span className="text-xs font-mono font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded w-fit">
                  Amortización Negativa
                </span>
              </div>
              <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                El interés del primer mes es de{' '}
                <strong className="font-mono">{formatCurrency(firstMonthInterest, params.currency)}</strong>,
                pero la cuota ingresada es de solo{' '}
                <strong className="font-mono">{formatCurrency(actualMonthlyPayment, params.currency)}</strong>.
                La diferencia de{' '}
                <strong className="font-mono">
                  {formatCurrency(firstMonthInterest - actualMonthlyPayment, params.currency)}
                </strong>{' '}
                se suma al saldo inicial, provocando que la deuda aumente indefinidamente.
              </p>
              <div className="pt-1 flex flex-wrap gap-4 text-xs font-medium text-red-800">
                <span>
                  • Cuota mínima para no incrementar deuda:{' '}
                  <strong className="font-mono">{formatCurrency(firstMonthInterest, params.currency)}</strong>
                </span>
                <span>
                  • Cuota ideal para pagar en {params.months} meses:{' '}
                  <strong className="font-mono">{formatCurrency(calculatedStandardPayment, params.currency)}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 bg-emerald-50/90 border border-emerald-200 rounded-xl text-emerald-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-emerald-900">
                {statusMessage}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-700">
                La cuota cubre holgadamente los intereses y amortiza capital mensualmente hasta cancelar la deuda
                en la cuota <strong className="font-mono">{payoffPeriod ?? params.months}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Key Financial Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Pagado */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total pagado proyectado</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(totalPaid, params.currency)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Capital + Intereses
          </span>
        </div>

        {/* Total Intereses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total intereses pagados</span>
          <div className={`text-lg sm:text-xl font-bold font-mono mt-1 ${isNegativeAmortization ? 'text-amber-700' : 'text-slate-900'}`}>
            {formatCurrency(totalInterestPaid, params.currency)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {isNegativeAmortization ? 'Cálculo a 600 meses' : `${interestShare.toFixed(1)}% del total`}
          </span>
        </div>

        {/* Interés del 1.er Mes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Interés del 1.er mes</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(firstMonthInterest, params.currency)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Tasa {params.monthlyRate}% mensual
          </span>
        </div>

        {/* Cuota Mensual Aplicada */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Cuota mensual aplicada</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-blue-700 mt-1">
            {formatCurrency(actualMonthlyPayment, params.currency)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {params.paymentMode === 'manual' ? 'Cuota manual libre' : 'Cuota fija calculada'}
          </span>
        </div>
      </div>

      {/* Visual Amortization Proportion Bar */}
      {!isNegativeAmortization && totalPaid > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Desglose del pago total</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block"></span>
                Capital: {principalShare.toFixed(1)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block"></span>
                Intereses: {interestShare.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${Math.min(100, Math.max(0, principalShare))}%` }}
              className="bg-blue-600 h-full transition-all duration-300"
              title={`Capital: ${formatCurrency(params.amount, params.currency)}`}
            />
            <div
              style={{ width: `${Math.min(100, Math.max(0, interestShare))}%` }}
              className="bg-amber-500 h-full transition-all duration-300"
              title={`Intereses: ${formatCurrency(totalInterestPaid, params.currency)}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
