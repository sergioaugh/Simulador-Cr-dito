import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText } from 'lucide-react';
import { AmortizationRow, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/amortization';

interface AmortizationTableProps {
  rows: AmortizationRow[];
  currency: CurrencyCode;
  isNegativeAmortization: boolean;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({
  rows,
  currency,
  isNegativeAmortization,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(24); // 24 = 2 years by default
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter rows based on search term (period or date)
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase().trim();
    return rows.filter(
      (r) =>
        r.period.toString().includes(term) ||
        r.date.toLowerCase().includes(term)
    );
  }, [rows, searchTerm]);

  // Pagination calculation
  const totalRows = filteredRows.length;
  const totalPages = pageSize === -1 ? 1 : Math.max(1, Math.ceil(totalRows / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    if (pageSize === -1) return filteredRows;
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safeCurrentPage, pageSize]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Controls Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">
            Tabla de Amortización Completa
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            ({totalRows} cuotas {searchTerm ? 'filtradas' : 'totales'})
          </span>
        </div>

        {/* Search & Page Size Select */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cuota o fecha..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="hidden sm:inline">Mostrar:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="12">12 cuotas (1 año)</option>
              <option value="24">24 cuotas (2 años)</option>
              <option value="60">60 cuotas (5 años)</option>
              <option value="120">120 cuotas (10 años)</option>
              <option value="-1">Todas las cuotas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Data Container with responsive horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3 px-3.5 text-center sticky left-0 bg-slate-50/95 z-10 w-16">
                N° cuota
              </th>
              <th scope="col" className="py-3 px-3.5">
                Fecha de pago
              </th>
              <th scope="col" className="py-3 px-3.5 text-right">
                Saldo inicial
              </th>
              <th scope="col" className="py-3 px-3.5 text-right">
                Cuota
              </th>
              <th scope="col" className="py-3 px-3.5 text-right">
                Interés
              </th>
              <th scope="col" className="py-3 px-3.5 text-right">
                Abono a capital
              </th>
              <th scope="col" className="py-3 px-3.5 text-right">
                Saldo final
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-800">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 font-sans text-sm">
                  No se encontraron cuotas que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => {
                const isNegativePrincipal = row.principal < -0.001;
                return (
                  <tr
                    key={row.period}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="py-2.5 px-3.5 text-center font-bold text-slate-600 sticky left-0 bg-white group-hover:bg-blue-50/40 z-10 border-r border-slate-100 sm:border-r-0">
                      {row.period}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans text-slate-600 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-slate-700 whitespace-nowrap">
                      {formatCurrency(row.beginningBalance, currency)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-semibold text-blue-900 whitespace-nowrap">
                      {formatCurrency(row.payment, currency)}
                      {row.extraPayment > 0 && (
                        <span className="block text-[10px] text-emerald-600 font-sans font-medium">
                          +{formatCurrency(row.extraPayment, currency)} extra
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-right text-amber-800 whitespace-nowrap">
                      {formatCurrency(row.interest, currency)}
                    </td>
                    <td
                      className={`py-2.5 px-3.5 text-right font-semibold whitespace-nowrap ${
                        isNegativePrincipal
                          ? 'text-red-600 bg-red-50/50'
                          : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(row.principal, currency, true)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(row.endingBalance, currency)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pageSize !== -1 && totalPages > 1 && (
        <div className="p-3 bg-slate-50/60 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Mostrando cuotas{' '}
            <strong className="font-mono">
              {(safeCurrentPage - 1) * pageSize + 1}
            </strong>{' '}
            a{' '}
            <strong className="font-mono">
              {Math.min(safeCurrentPage * pageSize, totalRows)}
            </strong>{' '}
            de <strong className="font-mono">{totalRows}</strong>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage === 1}
              title="Primera página"
              className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
              title="Página anterior"
              className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono font-medium text-slate-800">
              {safeCurrentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
              title="Página siguiente"
              className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              title="Última página"
              className="p-1.5 rounded border border-slate-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Amortization Note footer from template */}
      <div className="p-3 bg-amber-50/40 border-t border-amber-200/50 text-[11px] text-slate-600 flex items-center justify-between">
        <span>
          <strong>Nota técnica:</strong> La tabla admite hasta 600 cuotas (50 años). En amortización positiva la última cuota se ajusta automáticamente al saldo restante.
        </span>
        {isNegativeAmortization && (
          <span className="text-red-700 font-semibold font-sans hidden sm:inline">
            ⚠ Valores en rojo entre paréntesis representan incremento de deuda
          </span>
        )}
      </div>
    </div>
  );
};
