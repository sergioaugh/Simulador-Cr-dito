import React, { useState } from 'react';
import { X, Plus, Trash2, DollarSign, Calendar } from 'lucide-react';
import { ExtraPayment, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/amortization';

interface ExtraPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  extraPayments: ExtraPayment[];
  onUpdateExtraPayments: (payments: ExtraPayment[]) => void;
  currency: CurrencyCode;
  maxMonths: number;
}

export const ExtraPaymentsModal: React.FC<ExtraPaymentsModalProps> = ({
  isOpen,
  onClose,
  extraPayments,
  onUpdateExtraPayments,
  currency,
  maxMonths,
}) => {
  const [period, setPeriod] = useState<number>(12);
  const [amountStr, setAmountStr] = useState<string>('5000000');
  const [description, setDescription] = useState<string>('Abono extraordinario / Prima');

  if (!isOpen) return null;

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const rawVal = amountStr.replace(/\D/g, '');
    const num = rawVal ? parseInt(rawVal, 10) : 0;
    if (num <= 0) return;

    const newPayment: ExtraPayment = {
      period: Math.min(maxMonths, Math.max(1, period)),
      amount: num,
      description: description.trim() || 'Abono a capital',
    };

    // Sort by period
    const updated = [...extraPayments, newPayment].sort((a, b) => a.period - b.period);
    onUpdateExtraPayments(updated);

    // Reset inputs
    setAmountStr('');
    setDescription('');
  };

  const handleRemove = (index: number) => {
    const updated = extraPayments.filter((_, i) => i !== index);
    onUpdateExtraPayments(updated);
  };

  const totalExtra = extraPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Abonos Extraordinarios a Capital
            </h3>
            <p className="text-xs text-slate-500">
              Reduce el plazo o saldo aportando dinero extra en cuotas específicas
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Add Payment Form */}
          <form onSubmit={handleAddPayment} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Agregar nuevo abono
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  N° de Cuota (1 a {maxMonths})
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max={maxMonths}
                    value={period}
                    onChange={(e) => setPeriod(parseInt(e.target.value, 10) || 1)}
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">
                  Monto a abonar
                </label>
                <div className="relative">
                  <span className="text-xs font-semibold text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2">
                    $
                  </span>
                  <input
                    type="text"
                    value={amountStr ? parseInt(amountStr.replace(/\D/g, '') || '0', 10).toLocaleString('es-CO') : ''}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0"
                    className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                Concepto / Descripción (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Prima de mitad de año, ahorro, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar abono extraordinario</span>
            </button>
          </form>

          {/* List of Extra Payments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
              <span>Abonos programados ({extraPayments.length})</span>
              <span className="font-mono text-emerald-700">
                Total: {formatCurrency(totalExtra, currency)}
              </span>
            </div>

            {extraPayments.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                No hay abonos extraordinarios agregados.
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
                {extraPayments.map((ep, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-slate-50 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">
                        Cuota {ep.period}
                      </span>
                      {ep.description && (
                        <span className="text-slate-500 block text-[11px]">
                          {ep.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-700">
                        +{formatCurrency(ep.amount, currency)}
                      </span>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Eliminar abono"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
