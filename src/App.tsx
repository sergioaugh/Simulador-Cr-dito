/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { LoanParametersForm } from './components/LoanParametersForm';
import { LoanSummaryCards } from './components/LoanSummaryCards';
import { AmortizationTable } from './components/AmortizationTable';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { ExtraPaymentsModal } from './components/ExtraPaymentsModal';
import { PrintHeader } from './components/PrintHeader';
import { LoanParameters } from './types';
import { generateAmortizationSchedule, monthlyToAnnualEffective } from './utils/amortization';
import { exportToExcel } from './utils/excelExport';

// Initial state exactly matching the attached simulation spreadsheet
const INITIAL_PARAMETERS: LoanParameters = {
  amount: 100000000, // $100.000.000 COP
  months: 600, // 600 months (50 years)
  rateType: 'monthly_nominal',
  monthlyRate: 0.70, // 0.70% mensual
  annualEffectiveRate: parseFloat(monthlyToAnnualEffective(0.70).toFixed(2)), // ~8.73% E.A.
  paymentMode: 'manual', // Manual mode with custom quota of $400.000 as in the sample file
  customPayment: 400000, // $400.000
  disbursementDate: '2026-10-05',
  currency: 'COP',
  extraPayments: [],
};

export default function App() {
  const [params, setParams] = useState<LoanParameters>(INITIAL_PARAMETERS);
  const [isGoogleSheetsModalOpen, setIsGoogleSheetsModalOpen] = useState(false);
  const [isExtraPaymentsModalOpen, setIsExtraPaymentsModalOpen] = useState(false);

  // Compute full amortization schedule reactively
  const schedule = useMemo(() => {
    return generateAmortizationSchedule(params);
  }, [params]);

  const handleExportExcel = () => {
    exportToExcel(params, schedule);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetDefaults = () => {
    setParams({ ...INITIAL_PARAMETERS });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <Header
        onExportExcel={handleExportExcel}
        onOpenGoogleSheetsModal={() => setIsGoogleSheetsModalOpen(true)}
        onPrint={handlePrint}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Printable Header for physical paper or PDF export */}
        <PrintHeader params={params} schedule={schedule} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Loan Input Controls */}
          <div className="lg:col-span-5 xl:col-span-4 sticky lg:top-20 z-10 no-print">
            <LoanParametersForm
              params={params}
              onChange={setParams}
              calculatedPayment={schedule.calculatedStandardPayment}
              onOpenExtraPaymentsModal={() => setIsExtraPaymentsModalOpen(true)}
              onResetDefaults={handleResetDefaults}
            />
          </div>

          {/* Right Column: Financial Summary and Amortization Table */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Financial Summary & Warnings */}
            <LoanSummaryCards params={params} schedule={schedule} />

            {/* Complete Amortization Schedule Table */}
            <AmortizationTable
              rows={schedule.rows}
              currency={params.currency}
              isNegativeAmortization={schedule.isNegativeAmortization}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Simulador de Crédito & Tabla de Amortización (COP)
          </span>
          <span className="text-slate-400">
            Exportación fidedigna compatible con Microsoft Excel, Google Sheets y LibreOffice
          </span>
        </div>
      </footer>

      {/* Modals */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsModalOpen}
        onClose={() => setIsGoogleSheetsModalOpen(false)}
        params={params}
        schedule={schedule}
      />

      <ExtraPaymentsModal
        isOpen={isExtraPaymentsModalOpen}
        onClose={() => setIsExtraPaymentsModalOpen(false)}
        extraPayments={params.extraPayments}
        onUpdateExtraPayments={(updated) => setParams({ ...params, extraPayments: updated })}
        currency={params.currency}
        maxMonths={params.months}
      />
    </div>
  );
}
