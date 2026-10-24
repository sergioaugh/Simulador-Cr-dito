# Simulador de Crédito & Tabla de Amortización

Aplicación web moderna, ágil y totalmente responsiva diseñada para realizar simulaciones de crédito precisas con base en la estructura de la plantilla de amortización (COP), permitiendo cálculo de cuota fija, cuota personalizada con alertas de insuficiencia de intereses, descarga en Excel formateado (.xlsx), guardado/apertura en Google Sheets e impresión directa.

---

### Decisiones Clave & Configuración

> [!IMPORTANT]
> El usuario omitió las preguntas interactivas. Por lo tanto, se adoptan los valores recomendados de máxima compatibilidad y funcionalidad:
> - **Modos de cuota duales**: Modo 1: *Cuota calculada automáticamente* (sistema francés para pagar exactamente en el plazo elegido) y Modo 2: *Cuota personalizada manual* (idéntico al archivo proporcionado, con detección automática de insuficiencia si la cuota no cubre los intereses del primer mes).
> - **Exportación Excel y Google Sheets**: Generación y descarga directa en formato `.xlsx` nativo con fórmulas y formato monetario colombiano (COP), junto con un flujo optimizado para abrir y sincronizar en Google Sheets / Google Drive.
> - **Abonos y flexibilidad**: Soporte para abonos extraordinarios a capital en cuotas específicas, desglose de años y meses, y cambio de periodicidad o formato monetario.

---

### 1. Resumen & Concepto Central

- **Propósito**: Proporcionar a personas, asesores financieros, inversionistas y prestatarios una herramienta rápida, clara e interactiva para simular préstamos bancarios, evaluar el impacto de tasas de interés y plazos, visualizar la tabla completa de amortización (hasta 600 cuotas) y exportar resultados a Excel y Google Sheets.
- **Público Objetivo**: Usuarios que necesitan claridad absoluta sobre sus créditos en Colombia y Latinoamérica (tasas mensuales y anuales), con capacidad de imprimir o editar en hojas de cálculo.
- **Valor Principal**: Instantáneo (cálculo reactivo sin recarga), transparente (alertas claras si la cuota es insuficiente o negativa), móvil-amigable y con exportación fiel a la plantilla original.

---

### 2. Experiencia de Usuario & Diseño Visual

- **Paleta de Colores & Estilo**:
  - *Canvas*: Fondo neutro pulcro (`#F8FAFC` slate-50 / blanco), tipografía nítida en `Plus Jakarta Sans` y cifras numéricas en formato tabular monoespaciado (`font-mono tabular-nums`).
  - *Acentos*: Azul financiero profesional (`#2563EB` / `#1D4ED8`) para acciones principales, verde esmeralda (`#16A34A`) para amortizaciones saludables y ámbar/rojo (`#DC2626` / `#EF4444`) para avisos críticos de amortización negativa.
  - *Campos Editables*: Al igual que en la plantilla de origen ("celdas amarillas con texto azul"), los inputs principales contarán con un sutil resalte visual para indicar claramente qué parámetros son editables.
- **Estructura en Pantalla (Layout Responsivo)**:
  - **Barra Superior**: Título de la aplicación, selector de modo de cuota (Automática / Libre), y botones de acción rápida (*Exportar Excel*, *Abrir en Google Sheets*, *Imprimir*).
  - **Panel de Parámetros (Izquierda en desktop, Superior en móvil)**:
    - Monto del crédito (con formateador en vivo `$100.000.000 COP`).
    - Plazo del crédito en meses (con cálculo automático de años y meses).
    - Tasa nominal mensual (% con opción de ingresar Efectiva Anual E.A.).
    - Cuota mensual (calculada o personalizada).
    - Fecha de desembolso.
  - **Tarjeta de Estado & Alertas**:
    - Si la cuota mensual < Interés del 1.er mes: Alerta visible *"⚠ La cuota no cubre los intereses del primer mes: la deuda nunca se paga"*.
    - Si la cuota es viable: Resumen con Total intereses pagados, Total pagado (capital + intereses), y fecha de última cuota.
  - **Gráfico de Evolución**: Desglose visual entre abono a capital e intereses pagados mes a mes.
  - **Tabla de Amortización Completa**:
    - Columnas: `N° cuota`, `Fecha de pago`, `Saldo inicial`, `Cuota`, `Interés`, `Abono a capital`, `Saldo final`.
    - Paginación fluida o scroll virtualizado para manejar hasta 600 cuotas sin demoras ni saltos de interfaz.
    - Búsqueda / filtro por número de cuota o año.
  - **Modo Impresión**: Estilos `@media print` dedicados para generar un reporte PDF limpio y ordenado sin menús ni botones innecesarios.

---

### 3. Decisiones de Producto & Características Técnicas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SIMULADOR DE CRÉDITO                            │
├──────────────────────────┬─────────────────────────────────────────────┤
│   PANEL DE PARÁMETROS    │              RESUMEN & KPIS                 │
│  - Monto ($ COP)         │  - Total Pagado (Capital + Intereses)       │
│  - Plazo (meses / años)  │  - Total Intereses                          │
│  - Tasa mensual (%)      │  - Alerta de amortización negativa          │
│  - Cuota (Auto / Manual) │  - Gráfico interactivo de saldos            │
│  - Fecha de desembolso   ├─────────────────────────────────────────────┤
│  - Abonos extra (modal)  │       TABLA DE AMORTIZACIÓN COMPLETA        │
│                          │  [ N° | Fecha | Saldo Ini | Cuota | ...]    │
├──────────────────────────┴─────────────────────────────────────────────┤
│  ACCIONES: [Descargar Excel .xlsx] [Abrir en Google Sheets] [Imprimir] │
└────────────────────────────────────────────────────────────────────────┘
```

- **Exportación Excel (.xlsx)**:
  - Utilización de la librería `xlsx` (SheetJS) para generar un archivo descargable real con celdas formateadas, encabezados destacados, resumen financiero inicial y la tabla completa de cuotas, idéntico a la plantilla suministrada.
- **Integración con Google Sheets**:
  - Opción directa de descargar el archivo optimizado con enlace directo para importar en Google Sheets (`sheets.new`), así como exportación CSV estructurada y compatible al 100% con Google Drive y hojas de cálculo en la nube.
- **Rendimiento Ultrarrápido**:
  - Cálculos en memoria con React hooks (`useMemo`) ejecutados en submilisegundos para 600 cuotas.
  - Formateador monetario nativo `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })`.

---

### 4. Plan de Ejecución Paso a Paso

1. **Instalación de paquetes requeridos**:
   - `xlsx` para la exportación directa y fidedigna de hojas de cálculo Excel.
2. **Motor de Cálculo Financiero (`src/utils/amortization.ts`)**:
   - Cálculo de cuota fija mediante fórmula de anualidades ordinarias.
   - Generación de serie cronológica de pagos considerando meses de desembolso.
   - Lógica de amortización negativa vs. amortización positiva.
   - Ajuste automático de la última cuota al saldo restante.
   - Soporte opcional para abonos extraordinarios a capital.
3. **Servicio de Exportación (`src/utils/export.ts`)**:
   - Generación de libro de trabajo Excel (.xlsx) con estilos y formato monetario.
   - Flujo de creación de Google Sheets con hoja preconfigurada.
4. **Componentes de Interfaz**:
   - `Header`: Título, selector de moneda/modo y botones de exportación e impresión.
   - `LoanForm`: Entradas numéricas con formateo monetario COP en vivo y control de sliders para rápida simulación táctil en móviles.
   - `FinancialSummary`: Tarjetas con Total pagado, Intereses, Estado de viabilidad y advertencia contextual si la cuota no cubre el interés.
   - `AmortizationTable`: Tabla responsiva de alta densidad con paginación ágil y scroll horizontal suave en móviles.
   - `ExtraPaymentsModal`: Gestión opcional de abonos anticipados a capital.
5. **Estilos de Impresión y Verificación Final**:
   - Reglas de impresión CSS (`@media print`) para reporte limpio.
   - Verificación de compilación (`compile_applet`) y pruebas funcionales completas.
