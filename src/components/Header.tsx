import React from 'react';
import { FileSpreadsheet, Printer, Share2 } from 'lucide-react';

interface HeaderProps {
  onExportExcel: () => void;
  onOpenGoogleSheetsModal: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportExcel,
  onOpenGoogleSheetsModal,
  onPrint,
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            $
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block">
              Simulador de Crédito
            </span>
            <span className="text-xs text-slate-500 hidden sm:block">
              Tabla de amortización colombiana (COP)
            </span>
          </div>
        </div>

        {/* Zone 2: Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onPrint}
            title="Imprimir simulación"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden md:inline">Imprimir</span>
          </button>

          <button
            onClick={onOpenGoogleSheetsModal}
            title="Abrir o guardar en Google Sheets"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>Google Sheets</span>
          </button>

          <button
            onClick={onExportExcel}
            title="Descargar archivo en Excel (.xlsx)"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span className="font-semibold">Descargar Excel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
