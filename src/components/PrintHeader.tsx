import React from 'react';
import { AmortizationSchedule, LoanParameters } from '../types';
import { formatCurrency } from '../utils/amortization';

interface PrintHeaderProps {
  params: LoanParameters;
  schedule: AmortizationSchedule;
}

export const PrintHeader: React.FC<PrintHeaderProps> = ({ params, schedule }) => {
  return (
    <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Simulación de Crédito – Tabla de Amortización
          </h1>
          <p className="text-xs text-slate-600">
            Documento de simulación financiera proyectada (Moneda: {params.currency})
          </p>
        </div>
        <div className="text-right text-xs text-slate-600">
          <span>Fecha de emisión: {new Date().toLocaleDateString('es-CO')}</span>
          <br />
          <span>Desembolso: {params.disbursementDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-300 text-xs">
        <div>
          <span className="text-slate-500 block">Monto solicitado:</span>
          <strong className="font-mono text-sm text-slate-900">
            {formatCurrency(params.amount, params.currency)}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block">Plazo del crédito:</span>
          <strong className="text-slate-900">
            {params.months} meses ({schedule.years} años y {schedule.remainingMonths} meses)
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block">Tasa de interés:</span>
          <strong className="text-slate-900">
            {params.monthlyRate}% m.v. ({params.annualEffectiveRate}% E.A.)
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block">Cuota mensual:</span>
          <strong className="font-mono text-sm text-blue-900">
            {formatCurrency(schedule.actualMonthlyPayment, params.currency)}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-3 border-x border-b border-slate-300 text-xs">
        <div>
          <span className="text-slate-500 block">Total intereses a pagar:</span>
          <strong className="font-mono text-slate-900">
            {formatCurrency(schedule.totalInterestPaid, params.currency)}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block">Total general proyectado:</span>
          <strong className="font-mono text-slate-900">
            {formatCurrency(schedule.totalPaid, params.currency)}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block">Estado del crédito:</span>
          <strong className={schedule.isNegativeAmortization ? 'text-red-700' : 'text-emerald-700'}>
            {schedule.statusMessage}
          </strong>
        </div>
      </div>
    </div>
  );
};
