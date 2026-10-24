import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Download, Sparkles, FileSpreadsheet } from 'lucide-react';
import { AmortizationSchedule, LoanParameters } from '../types';
import { exportToExcel, generateGoogleSheetsTSV } from '../utils/excelExport';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: LoanParameters;
  schedule: AmortizationSchedule;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  params,
  schedule,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyClipboard = async () => {
    try {
      const tsv = generateGoogleSheetsTSV(params, schedule);
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleDownloadAndOpenSheets = () => {
    // 1. Download formatted Excel file
    exportToExcel(params, schedule);
    // 2. Open sheets.new in new window for direct upload
    window.open('https://sheets.new', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Guardar y Editar en Google Sheets
              </h3>
              <p className="text-xs text-slate-500">
                Lleva la simulación a Google Drive en segundos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tienes dos métodos ultra rápidos para abrir y editar tu simulación en Google Sheets:
          </p>

          {/* Option 1: Copy to Clipboard */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 transition-colors">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Método 1: Pegado Instantáneo (Recomendado)
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Más rápido
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Copia la tabla formateada con un clic, abre una hoja nueva de Google Sheets y presiona{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[11px] font-mono font-semibold">Ctrl+V</kbd> o{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[11px] font-mono font-semibold">Cmd+V</kbd>.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyClipboard}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar tabla para pegar</span>
                  </>
                )}
              </button>

              <a
                href="https://sheets.new"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <span>Abrir sheets.new</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Option 2: Download & Open */}
          <div className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 transition-colors">
            <span className="text-xs font-bold text-slate-800 block mb-1">
              Método 2: Descargar archivo y subir a Google Drive
            </span>
            <p className="text-xs text-slate-600 mb-3">
              Descarga el archivo <code>.xlsx</code> y cárgalo directamente en tu Google Drive. Podrás editar todas las fórmulas e imprimir.
            </p>

            <button
              onClick={handleDownloadAndOpenSheets}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Descargar .xlsx y abrir Google Sheets</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
