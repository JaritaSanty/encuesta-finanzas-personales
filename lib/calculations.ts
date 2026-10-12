import { guideFor } from "./guidance";
import { Question, Answers, DimensionResult, ScriptResult, StressResult, SurveyKey } from "@/types";

function dimensionScores(questions: Question[], answers: Answers): Record<string, number> {
  if (!questions.length || questions.some((q) => !Number.isInteger(answers[q.id]) || answers[q.id] < 1 || answers[q.id] > 5)) throw new Error("Completa todas las respuestas con valores de 1 a 5.");
  return questions.reduce<Record<string, number>>((acc, q) => {
    acc[q.dimension] = (acc[q.dimension] ?? 0) + (answers[q.id] ?? 0);
    return acc;
  }, {});
}

export function interpretStressTotal(total: number) {
  if (total <= 32) return "Estrés financiero bajo";
  if (total <= 48) return "Estrés financiero moderado";
  if (total <= 64) return "Estrés financiero alto";
  return "Estrés financiero muy alto";
}

export function stressDimensionInterpretation(score: number) {
  if (score <= 7) return "Impacto bajo";
  if (score <= 11) return "Impacto moderado";
  if (score <= 15) return "Impacto alto";
  return "Impacto muy alto";
}

export function scriptDimensionInterpretation(score: number) {
  if (score <= 8) return "Presencia baja";
  if (score <= 12) return "Presencia moderada-baja";
  if (score <= 16) return "Presencia moderada-alta";
  return "Presencia alta";
}

export function calculateStressResult(questions: Question[], answers: Answers): StressResult {
  const totals = dimensionScores(questions, answers);
  const dimensions: DimensionResult[] = Object.entries(totals).map(([dimension, score]) => ({
    dimension,
    score,
    interpretation: stressDimensionInterpretation(score),
  }));

  const total = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return {
    total,
    level: interpretStressTotal(total),
    dimensions,
    recommendations: [
      guideFor([...dimensions].sort((a, b) => b.score - a.score)[0].dimension).action,
      "Haz una lista de lo que recibes, tus gastos necesarios y las fechas de pago. Ajusta el plan a tu realidad; no hay un porcentaje de ahorro obligatorio.",
      "Si tienes margen después de cubrir lo necesario, separa una cantidad posible para imprevistos. Empieza con una meta pequeña y revisable.",
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function calculateScriptsResult(questions: Question[], answers: Answers): ScriptResult {
  const totals = dimensionScores(questions, answers);
  const dimensions: DimensionResult[] = Object.entries(totals).map(([dimension, score]) => ({
    dimension,
    score,
    interpretation: scriptDimensionInterpretation(score),
  }));
  const sorted = [...dimensions].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const second = sorted[1];
  const mixedProfile = second ? top.score - second.score <= 1 : false;

  return {
    dimensions,
    dominant: mixedProfile ? `${top.dimension} (perfil mixto)` : top.dimension,
    mixedProfile,
    recommendations: [
      guideFor(top.dimension).action,
      "Recuerda una decisión reciente con dinero. Anota qué pensabas, cómo te sentías y qué cambiarías la próxima vez.",
      "Elige una meta concreta y realista, con un importe y una fecha. Revísala según tus ingresos y necesidades.",
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function getSurveyMeta(survey: SurveyKey) {
  return survey === "estres-financiero"
    ? { title: "Estrés Financiero", resultTitle: "Reporte de Estrés Financiero" }
    : { title: "Guiones Mentales del Dinero", resultTitle: "Reporte de Guiones Mentales del Dinero" };
}
