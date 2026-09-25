// Datos de demostración. Reemplaza este contenido al crear el banco definitivo.
// Todo archivo publicado en GitHub Pages es público, incluidos estos códigos.
export const VALID_CODES = ["DIGIMON"];

export const LEVELS = [
  { value: 1, label: "MUY FÁCIL" },
  { value: 2, label: "FÁCIL" },
  { value: 3, label: "NORMAL" },
  { value: 4, label: "DIFÍCIL" },
  { value: 5, label: "MUY DIFÍCIL" },
];

export const QUESTIONS = {
  1: [
    { question: "¿Cómo se llaman las criaturas digitales del juego?", answer: "Digimon.", detail: "Son las criaturas que acompañan a los Tamers." },
    { question: "¿Qué representa el icono de corazón?", answer: "Vida.", detail: "El corazón identifica la estadística de Vida." },
  ],
  2: [
    { question: "¿Qué representa el icono de rayo?", answer: "Energía.", detail: "El rayo identifica la estadística de Energía." },
    { question: "¿Cómo se llama la moneda del juego?", answer: "Digi-Coin.", detail: "Es una de las fichas de recurso del juego." },
  ],
  3: [
    { question: "¿Qué objeto permite realizar una evolución Armor?", answer: "Un Digimental.", detail: "Los Digimentals permiten activar la evolución Armor." },
    { question: "¿Qué objeto está asociado a un rasgo de un elegido?", answer: "Un Emblema.", detail: "Cada Emblema representa un rasgo distinto." },
  ],
  4: [
    { question: "¿Qué objeto permite una evolución Spirit?", answer: "Un DigiSpirit.", detail: "En el juego hay DigiSpirits de tipo Humano y Bestia." },
    { question: "¿Cuáles son los dos tipos de DigiSpirit?", answer: "Humano y Bestia.", detail: "Son las dos formas representadas en las cartas." },
  ],
  5: [
    { question: "En el triángulo de atributos, ¿cuál vence a Virus?", answer: "Vacuna.", detail: "Vacuna tiene ventaja frente a Virus." },
    { question: "En el triángulo de atributos, ¿cuál vence a Vacuna?", answer: "Datos.", detail: "Datos tiene ventaja frente a Vacuna." },
  ],
};
