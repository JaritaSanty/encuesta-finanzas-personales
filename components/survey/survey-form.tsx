"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { SurveyConfig, Answers, SurveyKey } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setLocalStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { calculateScriptsResult, calculateStressResult } from "@/lib/calculations";

const STORAGE_BY_SURVEY = {
  "estres-financiero": STORAGE_KEYS.stressAnswers,
  "guiones-dinero": STORAGE_KEYS.scriptsAnswers,
} as const;

const RESULT_BY_SURVEY = {
  "estres-financiero": STORAGE_KEYS.stressResult,
  "guiones-dinero": STORAGE_KEYS.scriptsResult,
} as const;

export function SurveyForm({ survey, initialAnswers, userName }: { survey: SurveyConfig; initialAnswers: Answers; userName: string }) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof survey.questions>();
    survey.questions.forEach((q) => {
      map.set(q.dimension, [...(map.get(q.dimension) ?? []), q]);
    });
    return Array.from(map.entries()).map(([dimension, questions]) => ({ dimension, questions }));
  }, [survey.questions]);

  const completed = Object.keys(answers).length;
  const progress = (completed / survey.questions.length) * 100;

  const updateAnswer = (id: number, value: number) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setLocalStorage(STORAGE_BY_SURVEY[survey.key], next);
  };

  const validateStep = () => {
    const missing = grouped[step].questions.some((q) => !answers[q.id]);
    if (missing) {
      setError("Responde todas las preguntas del bloque actual para continuar.");
      return false;
    }
    setError("");
    return true;
  };

  const onSubmit = () => {
    const missingAny = survey.questions.some((q) => !answers[q.id]);
    if (missingAny) {
      setError("Hay preguntas pendientes. Completa la encuesta para generar el reporte.");
      return;
    }

    const result = survey.key === "estres-financiero" ? calculateStressResult(survey.questions, answers) : calculateScriptsResult(survey.questions, answers);
    setLocalStorage(RESULT_BY_SURVEY[survey.key], result);
    router.push(`/resultados/${survey.key}`);
  };

  const current = grouped[step];

  return (
    <Card className="border-0 bg-white/90">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{survey.title}</CardTitle>
          <Badge>Participante: {userName}</Badge>
        </div>
        <CardDescription>{survey.subtitle}</CardDescription>
        <Progress value={progress} className="mt-2" />
        <p className="text-xs text-muted-foreground">Progreso: {completed}/{survey.questions.length} respuestas</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div key={current.dimension} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
          <h3 className="text-lg font-semibold">{current.dimension}</h3>
          {current.questions.map((question) => (
            <div key={question.id} className="rounded-lg border border-border p-4">
              <p className="mb-3 text-sm font-medium">{question.id}. {question.text}</p>
              <div className="grid gap-2 md:grid-cols-5">
                {survey.options.map((option) => (
                  <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-md border border-input p-2 text-xs hover:bg-muted">
                    <input
                      type="radio"
                      className="h-4 w-4"
                      name={`q-${question.id}`}
                      checked={answers[question.id] === option.value}
                      onChange={() => updateAnswer(question.id, option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {error && <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Volver</Button>
          {step < grouped.length - 1 ? (
            <Button onClick={() => validateStep() && setStep((s) => s + 1)}>Continuar</Button>
          ) : (
            <Button onClick={onSubmit}>Enviar y ver reporte</Button>
          )}
          <Button variant="secondary" onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </CardContent>
    </Card>
  );
}
