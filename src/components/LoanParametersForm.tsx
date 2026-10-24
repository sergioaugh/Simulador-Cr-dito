import React from 'react';
import { Calculator, Calendar, DollarSign, Percent, Clock, PlusCircle, RotateCcw } from 'lucide-react';
import { LoanParameters } from '../types';
import { annualEffectiveToMonthly, formatCurrency, monthlyToAnnualEffective } from '../utils/amortization';

interface LoanParametersFormProps {
  params: LoanParameters;
  onChange: (updated: LoanParameters) => void;
  calculatedPayment: number;
  onOpenExtraPaymentsModal: () => void;
  onResetDefaults: () => void;
}

export const LoanParametersForm: React.FC<LoanParametersFormProps> = ({
  params,
  onChange,
  calculatedPayment,
  onOpenExtraPaymentsModal,
  onResetDefaults,
}) => {
  // Amount presets for rapid testing
  const amountPresets = [20000000, 50000000, 100000000, 200000000, 500000000];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    onChange({ ...params, amount: Math.max(0, num) });
  };

  const handleMonthsChange = (val: number) => {
    const safeMonths = Math.min(600, Math.max(1, val));
    onChange({ ...params, months: safeMonths });
  };

  const handleMonthlyRateChange = (val: number) => {
    const monthly = Math.max(0, val);
    const ea = monthlyToAnnualEffective(monthly);
    onChange({
      ...params,
      monthlyRate: monthly,
      annualEffectiveRate: parseFloat(ea.toFixed(2)),
    });
  };

  const handleEARateChange = (val: number) => {
    const ea = Math.max(0, val);
    const monthly = annualEffectiveToMonthly(ea);
    onChange({
      ...params,
      annualEffectiveRate: ea,
      monthlyRate: parseFloat(monthly.toFixed(2)),
    });
  };

  const handleCustomPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    onChange({ ...params, customPayment: Math.max(0, num) });
  };

  const years = Math.floor(params.months / 12);
  const remainingMonths = params.months % 12;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Header with notice matching Excel yellow cells */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Parámetros del Crédito</h2>
          <p className="text-xs text-amber-700 bg-amber-50/80 px-2 py-1 rounded inline-block mt-1 font-medium border border-amber-200/60">
            Los campos resaltados corresponden a los datos editables de la plantilla original
          </p>
        </div>
        <button
          onClick={onResetDefaults}
          title="Restablecer valores del archivo de ejemplo"
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2 py-1 rounded border border-slate-200 hover:bg-slate-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer ejemplo</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Monto del crédito */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Monto del crédito
            </label>
            <span className="text-xs font-mono font-medium text-slate-600">
              {formatCurrency(params.amount, params.currency)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              $
            </span>
            <input
              type="text"
              value={params.amount === 0 ? '' : params.amount.toLocaleString('es-CO')}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold font-mono text-blue-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {amountPresets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onChange({ ...params, amount: val })}
                className={`text-xs px-2.5 py-1 rounded-md font-mono transition-colors ${
                  params.amount === val
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ${val / 1000000}M
              </button>
            ))}
          </div>
        </div>

        {/* Plazo del crédito */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              Plazo del crédito
            </label>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {years > 0 ? `${years} año${years > 1 ? 's' : ''}` : ''}
              {remainingMonths > 0 ? ` y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}` : ''}
              {years === 0 && remainingMonths === 0 ? '0 meses' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-1">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={params.months}
                  onChange={(e) => handleMonthsChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 text-sm font-semibold font-mono text-blue-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  meses
                </span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center">
              <input
                type="range"
                min="12"
                max="600"
                step="12"
                value={params.months}
                onChange={(e) => handleMonthsChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>1 año (12m)</span>
            <span>20 años (240m)</span>
            <span>50 años (600m)</span>
          </div>
        </div>

        {/* Tasas de interés */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-blue-600" />
              Tasa de interés
            </label>
            <span className="text-xs text-slate-500">Nominal mensual y Efectiva anual</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="block text-xs font-medium text-slate-600 mb-1">
                Tasa nominal mensual (%)
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50"
                  value={params.monthlyRate}
                  onChange={(e) => handleMonthlyRateChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-semibold font-mono text-blue-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  % m.v.
                </span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-600 mb-1">
                Equivalente Efectiva Anual (E.A.)
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="150"
                  value={params.annualEffectiveRate}
                  onChange={(e) => handleEARateChange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm font-semibold font-mono text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                  % E.A.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modalidad de Cuota: Calculada vs Personalizada */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" />
              Modalidad de cuota mensual
            </label>
          </div>

          {/* Segmented control */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => onChange({ ...params, paymentMode: 'calculated' })}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                params.paymentMode === 'calculated'
                  ? 'bg-white text-blue-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cuota calculada (Amortiza a 0)
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...params, paymentMode: 'manual' })}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                params.paymentMode === 'manual'
                  ? 'bg-white text-blue-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cuota personalizada (Libre)
            </button>
          </div>

          {params.paymentMode === 'manual' ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  Valor ingresado manualmente:
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ ...params, customPayment: Math.round(calculatedPayment) })}
                  className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Usar cuota ideal ({formatCurrency(calculatedPayment, params.currency)})
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="text"
                  value={params.customPayment === 0 ? '' : params.customPayment.toLocaleString('es-CO')}
                  onChange={handleCustomPaymentChange}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold font-mono text-blue-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500">
                Puedes digitar una cuota menor a los intereses para ver cómo incrementa la deuda (como en la plantilla) o mayor para amortizar antes.
              </p>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-800 font-medium block">
                  Cuota fija calculada para pagar en {params.months} meses:
                </span>
                <span className="text-lg font-bold font-mono text-blue-900">
                  {formatCurrency(calculatedPayment, params.currency)}
                </span>
              </div>
              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                Sistema Francés
              </span>
            </div>
          )}
        </div>

        {/* Fecha de desembolso */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            Fecha de desembolso
          </label>
          <input
            type="date"
            value={params.disbursementDate}
            onChange={(e) => onChange({ ...params, disbursementDate: e.target.value })}
            className="w-full px-3 py-2 text-sm font-semibold font-mono text-blue-900 bg-amber-50/50 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Abonos extraordinarios trigger */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onOpenExtraPaymentsModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Gestionar abonos extraordinarios a capital</span>
            {params.extraPayments.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-blue-600 text-white font-bold rounded-full">
                {params.extraPayments.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
