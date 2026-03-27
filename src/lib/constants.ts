import { QuestionsConfig, ActiveCounts, Thresholds } from "./types";

export const DEFAULT_QUESTIONS: QuestionsConfig = {
  pasillo: [
    "El pasillo está completamente libre de obstrucciones y obstáculos",
    "La señalización de ubicaciones está visible, legible y actualizado",
    "Las estanterías no presentan daños visibles en el área referido",
    "Los productos están correctamente ubicados según el planograma asignado",
    "La iluminación es adecuada para todo el pasillo",
    "Las etiquetas de peso máximo están visibles y actualizadas",
    "Los equipos de seguridad del área están accesibles y en buen estado",
    "No hay productos caídos, derramados o fuera de lugar en el recorrido",
    "Las zonas de carga y descarga están correctamente delimitadas",
    "El piso del pasillo está limpio, sin líquidos y señalizado para personal y vehículos",
  ],
  ubicacion: [
    "La ubicación del producto corresponde exactamente al slot asignado en el sistema",
    "El código de barras de ubicación es legible y coincide con el sistema",
    "La ubicación no muestra signos de sobrecarga ni fuerzas laterales excesivas",
    "El producto está apilado correctamente según las instrucciones de peso",
    "El estado del rack en la ubicación no presenta abolladuras ni corrosión visible",
    "La altura del almacenamiento respeta el límite establecido",
    "Los productos están orientados correctamente según las instrucciones de la etiqueta",
    "No hay productos dañados o comprometidos en este nivel del rack",
    "La ubicación está libre de materiales ajenos que impidan la lectura del sistema",
    "La señalización de capacidad está actualizada y es legible",
  ],
  producto: [
    "El producto auditado tiene etiqueta visible con código de barras y código",
    "Las características físicas coinciden con lo registrado en el sistema",
    "El producto auditado se encuentra en buen estado físico (sin daño visible ni contaminación)",
    "La fecha de vencimiento es vigente y la rotación FIFO se cumple correctamente",
    "El producto auditado está dentro de su zona asignada",
    "El embalaje original está intacto, sellado y sin manipulación no autorizada",
    "El producto cuenta con señales de almacenamiento especial si aplica según clasificación",
    "Los datos del sistema coinciden con la cantidad física del producto (conteo correcto)",
    "El producto está orientado de forma correcta para su identificación y escaneo",
    "La documentación asociada al producto está completa y actualizado",
  ],
};

export const DEFAULT_ACTIVE_COUNT: ActiveCounts = {
  pasillo: 5,
  ubicacion: 5,
  producto: 5,
};

export const DEFAULT_THRESHOLDS: Thresholds = {
  warning: 70,
  danger: 50,
};

export const TURNS = ["Ronda 1", "Ronda 2", "Ronda 3"] as const;
export const MODES = ["pasillo", "ubicacion", "producto"] as const;
export const MAX_AISLES = 30;
export const MAX_QUESTIONS = 10;
export const MIN_QUESTIONS = 5;
export const ITEMS_PER_PAGE = 10;

export const COMMIT_PREFIXES = {
  feat: "Nueva funcionalidad",
  fix: "Corrección de error",
  style: "Cambio visual",
  refactor: "Reorganización",
  docs: "Documentación",
} as const;
