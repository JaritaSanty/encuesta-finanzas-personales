import { SurveyConfig } from "@/types";

export const stressSurvey: SurveyConfig = {
  key: "estres-financiero",
  title: "Encuesta de Estrés Financiero",
  subtitle: "Evalúa tu nivel de tensión emocional asociado al dinero",
  description:
    "Este instrumento explora ansiedad financiera, control percibido, escasez y el impacto cotidiano de las preocupaciones económicas.",
  options: [
    { value: 1, label: "Nunca" },
    { value: 2, label: "Casi nunca" },
    { value: 3, label: "A veces" },
    { value: 4, label: "Casi siempre" },
    { value: 5, label: "Siempre" },
  ],
  questions: [
    { id: 1, dimension: "Preocupación y ansiedad financiera", text: "Me siento intranquilo cuando pienso en mis gastos mensuales." },
    { id: 2, dimension: "Preocupación y ansiedad financiera", text: "Me preocupa no poder cubrir una emergencia económica." },
    { id: 3, dimension: "Preocupación y ansiedad financiera", text: "Pensar en dinero me genera tensión emocional." },
    { id: 4, dimension: "Preocupación y ansiedad financiera", text: "Siento nerviosismo al revisar mis cuentas, deudas o pagos pendientes." },
    { id: 5, dimension: "Sensación de falta de control", text: "Siento que mis finanzas están fuera de control." },
    { id: 6, dimension: "Sensación de falta de control", text: "Aunque intento organizarme, no logro manejar bien mis obligaciones económicas." },
    { id: 7, dimension: "Sensación de falta de control", text: "Tengo la sensación de que el dinero “se me va” sin entender bien en qué." },
    { id: 8, dimension: "Sensación de falta de control", text: "Me cuesta tomar decisiones financieras con seguridad." },
    { id: 9, dimension: "Escasez percibida", text: "Siento que mis ingresos no alcanzan para mis necesidades básicas y compromisos." },
    { id: 10, dimension: "Escasez percibida", text: "Con frecuencia percibo que no tengo suficiente dinero para estar tranquilo." },
    { id: 11, dimension: "Escasez percibida", text: "Aun cuando cubro mis gastos, siento inseguridad respecto a mi estabilidad económica." },
    { id: 12, dimension: "Escasez percibida", text: "Mi situación financiera me hace sentir limitado para planificar el futuro." },
    { id: 13, dimension: "Rumiación e impacto cotidiano", text: "Paso mucho tiempo pensando en problemas de dinero." },
    { id: 14, dimension: "Rumiación e impacto cotidiano", text: "Mis preocupaciones financieras afectan mi concentración o descanso." },
    { id: 15, dimension: "Rumiación e impacto cotidiano", text: "El dinero influye negativamente en mi estado de ánimo." },
    { id: 16, dimension: "Rumiación e impacto cotidiano", text: "Mis finanzas generan conflictos o tensión en mis relaciones personales." },
  ],
};

export const scriptsSurvey: SurveyConfig = {
  key: "guiones-dinero",
  title: "Encuesta de Guiones Mentales del Dinero",
  subtitle: "Identifica tus creencias inconscientes sobre el dinero",
  description:
    "Este cuestionario describe creencias aprendidas que influyen en ahorro, consumo, deuda y percepción del éxito financiero.",
  options: [
    { value: 1, label: "Totalmente en desacuerdo" },
    { value: 2, label: "En desacuerdo" },
    { value: 3, label: "Ni de acuerdo ni en desacuerdo" },
    { value: 4, label: "De acuerdo" },
    { value: 5, label: "Totalmente de acuerdo" },
  ],
  questions: [
    { id: 1, dimension: "Guion evitativo", text: "Tener mucho dinero puede hacer que una persona se vuelva egoísta o mala." },
    { id: 2, dimension: "Guion evitativo", text: "Hablar de dinero me incomoda." },
    { id: 3, dimension: "Guion evitativo", text: "En el fondo, siento que no merezco ganar más dinero." },
    { id: 4, dimension: "Guion evitativo", text: "Prefiero no revisar mis finanzas para no estresarme." },
    { id: 5, dimension: "Guion adorador", text: "Si tuviera más dinero, casi todos mis problemas se resolverían." },
    { id: 6, dimension: "Guion adorador", text: "Más dinero significa automáticamente más felicidad." },
    { id: 7, dimension: "Guion adorador", text: "Nunca se tiene suficiente dinero para sentirse realmente seguro." },
    { id: 8, dimension: "Guion adorador", text: "Ganar más siempre debería ser una prioridad." },
    { id: 9, dimension: "Guion de estatus", text: "El éxito de una persona se nota principalmente en cuánto dinero tiene." },
    { id: 10, dimension: "Guion de estatus", text: "Me importa que los demás perciban que me va bien económicamente." },
    { id: 11, dimension: "Guion de estatus", text: "Comprar cosas visibles puede mejorar la imagen que otros tienen de mí." },
    { id: 12, dimension: "Guion de estatus", text: "El nivel de ingresos dice mucho sobre el valor personal de alguien." },
    { id: 13, dimension: "Guion vigilante", text: "Me esfuerzo por ahorrar aunque no sea estrictamente necesario." },
    { id: 14, dimension: "Guion vigilante", text: "Me cuesta gastar dinero, incluso en cosas importantes." },
    { id: 15, dimension: "Guion vigilante", text: "Suelo estar muy pendiente de mis movimientos financieros." },
    { id: 16, dimension: "Guion vigilante", text: "Prefiero ser prudente con el dinero antes que correr riesgos." },
  ],
};

export const surveys = {
  "estres-financiero": stressSurvey,
  "guiones-dinero": scriptsSurvey,
};
