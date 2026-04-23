import { Question, Answers, DimensionResult, ScriptResult, StressResult, SurveyKey } from "@/types";

function dimensionScores(questions: Question[], answers: Answers): Record<string, number> {
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

  const total = Object.values(answers).reduce((sum, val) => sum + val, 0);

  return {
    total,
    level: interpretStressTotal(total),
    dimensions,
    recommendations: [
      "Define un presupuesto de 50/30/20 para recuperar sensación de control.",
      "Crea un fondo de emergencia con transferencias automáticas pequeñas.",
      "Agenda una revisión semanal de finanzas de 20 minutos para reducir rumiación.",
      "Si la ansiedad es persistente, busca apoyo profesional en salud mental o asesoría financiera.",
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
      "Identifica qué creencias sobre dinero heredaste en tu familia y cuáles quieres conservar.",
      "Usa un diario financiero breve para registrar decisiones y emociones asociadas.",
      "Transforma creencias rígidas en reglas equilibradas: ahorro + disfrute responsable.",
      "Define metas por horizonte (corto, medio y largo plazo) para reducir sesgos de guion.",
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function getSurveyMeta(survey: SurveyKey) {
  return survey === "estres-financiero"
    ? { title: "Estrés Financiero", resultTitle: "Reporte de Estrés Financiero" }
    : { title: "Guiones Mentales del Dinero", resultTitle: "Reporte de Guiones Mentales del Dinero" };
}
