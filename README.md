# Simulador de Crédito & Tabla de Amortización (COP)

Aplicación web moderna, ágil y totalmente responsiva para realizar simulaciones de créditos bancarios y personales, proyectar tablas de amortización detalladas (hasta 600 cuotas), detectar amortizaciones negativas y exportar resultados tanto a **Microsoft Excel (.xlsx)** como a **Google Sheets**.

Inspirada en el modelo y estructura de la plantilla de amortización colombiana (`Simulación de crédito – Tabla de amortización (COP)`).

---

## Características Principales

- **Fidelidad al Modelo Financiero**:
  - Parámetros por defecto alineados con la plantilla de referencia: `$100.000.000 COP`, `600 meses` (50 años), tasa nominal de `0,70% mensual` y cuota libre de `$400.000`.
  - **Detección Automática de Amortización Negativa**: Si la cuota mensual es inferior al interés del primer mes, el sistema muestra la advertencia oficial:
    > *"⚠ La cuota no cubre los intereses del primer mes: la deuda nunca se paga"*
    Mostrando el valor del déficit que se capitaliza mes a mes y la cuota mínima recomendada.
  - **Modalidades de Cuota Flexibles**:
    - **Cuota Calculada (Sistema Francés)**: Calcula la anualidad ordinaria exacta para extinguir la deuda al 100% en el plazo estipulado.
    - **Cuota Personalizada (Manual)**: Permite ingresar cualquier valor para simular pagos libres o evaluar escenarios de déficit/superávit.
  - **Conversión de Tasas en Tiempo Real**: Sincronización instantánea entre **Tasa Nominal Mensual (% m.v.)** y **Tasa Efectiva Anual (% E.A.)**.
  - **Abonos Extraordinarios a Capital**: Configuración de aportes extraordinarios programados en meses específicos (ej. primas, ahorros) con recálculo automático de saldo y reducción de plazo.

- **Exportación & Productividad**:
  - **Descarga en Excel (.xlsx)**: Genera un archivo con formato nativo idéntico al archivo original, con bloque de resumen, fórmulas y la tabla completa de cuotas.
  - **Integración con Google Sheets**:
    1. *Copia instantánea al portapapeles (TSV)*: Permite pegar directamente en cualquier Google Sheet con `Ctrl+V` manteniendo la alineación por columnas.
    2. *Descarga y enlace directo a `sheets.new`*: Para subir el archivo a Google Drive y editar en la nube en un solo clic.
  - **Modo Impresión Limpio (`@media print`)**: Vista optimizada para imprimir en papel o guardar en PDF, ocultando controles de navegación y mostrando una ficha financiera formal con desglose de totales.

- **Diseño & Rendimiento**:
  - Cálculos en memoria ejecutados en submilisegundos mediante hooks reactivos (`useMemo`).
  - Tabla de amortización con buscador por cuota/fecha y paginación rápida (12, 24, 60, 120 o todas las cuotas).
  - Formato numérico tabular monoespaciado (`tabular-nums`) para evitar saltos visuales y alinear cifras contables.
  - Diseño responsivo adaptado a dispositivos móviles, tablets y monitores de escritorio.

---

## Fórmulas Financieras Aplicadas

1. **Cuota Fija (Sistema Francés)**:
   $$\text{Cuota} = P \times \frac{i \times (1 + i)^n}{(1 + i)^n - 1}$$
   *Donde $P$ es el capital prestado, $i$ es la tasa de interés mensual en decimal ($0.70\% = 0.007$) y $n$ es el número de meses.*

2. **Interés Mensual**:
   $$\text{Interés}_t = \text{Saldo Inicial}_t \times i$$

3. **Abono a Capital**:
   $$\text{Abono a Capital}_t = \text{Cuota}_t - \text{Interés}_t$$
   *(Si la cuota es menor que el interés, el abono resulta negativo, sumándose al saldo final: amortización negativa).*

4. **Conversión de Tasas (Nominal Mensual a Efectiva Anual)**:
   $$\text{E.A.} = (1 + i)^{12} - 1$$

---

## Tecnologías Utilizadas

- **React 19** con **TypeScript**: Arquitectura modular y fuertemente tipada.
- **Vite 8**: Servidor de desarrollo ultrarrápido y empaquetado optimizado.
- **Tailwind CSS v4**: Estilos utilitarios modernos con reglas de impresión y tokens de diseño.
- **XLSX (SheetJS)**: Generación y exportación de hojas de cálculo binarias `.xlsx`.
- **Lucide React**: Iconografía funcional y accesible.

---

## Estructura del Proyecto

```text
├── index.html                      # Punto de entrada HTML con fuentes y metadatos
├── package.json                    # Dependencias y scripts de ejecución
├── src/
│   ├── App.tsx                     # Componente principal y estado de la simulación
│   ├── main.tsx                    # Renderizado raíz de React
│   ├── index.css                   # Tailwind CSS y reglas de impresión (@media print)
│   ├── types.ts                    # Interfaces de TypeScript para créditos y cuotas
│   ├── components/
│   │   ├── Header.tsx              # Barra superior con acciones de exportación
│   │   ├── LoanParametersForm.tsx  # Formulario con campos editables y presets
│   │   ├── LoanSummaryCards.tsx    # Tarjetas de resumen, alertas y KPIs
│   │   ├── AmortizationTable.tsx   # Tabla interactiva con búsqueda y paginación
│   │   ├── GoogleSheetsModal.tsx   # Modal de exportación y copiado a Sheets
│   │   ├── ExtraPaymentsModal.tsx  # Gestión de abonos extraordinarios a capital
│   │   └── PrintHeader.tsx         # Encabezado formal visible solo al imprimir
│   └── utils/
│       ├── amortization.ts         # Motor matemático de cálculo y amortización
│       └── excelExport.ts          # Generador de archivos .xlsx y TSV para Sheets
└── tsconfig.json                   # Configuración del compilador TypeScript
```

---

## Instalación y Ejecución Local

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## Licencia

Distribuido bajo la licencia [Apache 2.0](LICENSE).
