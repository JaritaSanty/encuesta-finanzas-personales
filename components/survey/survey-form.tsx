"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { SurveyConfig, Answers } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLocalStorage, setLocalStorage } from "@/lib/storage";
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

const ORDER_BY_SURVEY = {
  "estres-financiero": STORAGE_KEYS.stressOrder,
  "guiones-dinero": STORAGE_KEYS.scriptsOrder,
} as const;

function shuffle<T>(items: T[]) {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function SurveyForm({ survey, initialAnswers, userName }: { survey: SurveyConfig; initialAnswers: Answers; userName: string }) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const orderKey = ORDER_BY_SURVEY[survey.key];
    const savedOrder = getLocalStorage<number[]>(orderKey, []);
    const isValid = savedOrder.length === survey.questions.length && savedOrder.every((id) => survey.questions.some((q) => q.id === id));

    if (isValid) {
      setQuestionOrder(savedOrder);
      return;
    }

    const randomized = shuffle(survey.questions.map((q) => q.id));
    setQuestionOrder(randomized);
    setLocalStorage(orderKey, randomized);
  }, [survey]);

  const orderedQuestions = useMemo(() => {
    const map = new Map(survey.questions.map((q) => [q.id, q]));
    return questionOrder.map((id) => map.get(id)).filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [questionOrder, survey.questions]);

  const completed = Object.keys(answers).length;
  const progress = (completed / survey.questions.length) * 100;

  const updateAnswer = (id: number, value: number) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setLocalStorage(STORAGE_BY_SURVEY[survey.key], next);
    setError("");
  };

  const nextQuestion = () => {
    const current = orderedQuestions[step];
    if (!current || !answers[current.id]) {
      setError("Responde esta pregunta para continuar.");
      return;
    }
    setError("");
    setStep((s) => Math.min(orderedQuestions.length - 1, s + 1));
  };

  const onSubmit = () => {
    const missingAny = survey.questions.some((q) => !answers[q.id]);
    if (missingAny) {
      setError("Hay preguntas pendientes. Completa toda la encuesta para generar el reporte.");
      return;
    }

    const result = survey.key === "estres-financiero" ? calculateStressResult(survey.questions, answers) : calculateScriptsResult(survey.questions, answers);
    setLocalStorage(RESULT_BY_SURVEY[survey.key], result);
    router.push(`/resultados/${survey.key}`);
  };

  const current = orderedQuestions[step];

  if (!current) {
    return (
      <Card className="border-0 bg-white/90">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Cargando preguntas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/90">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{survey.title}</CardTitle>
          <Badge>Participante: {userName}</Badge>
        </div>
        <CardDescription>{survey.subtitle}</CardDescription>
        <Progress value={progress} className="mt-2" />
        <p className="text-xs text-muted-foreground">Pregunta {step + 1} de {orderedQuestions.length} · {completed}/{survey.questions.length} respondidas</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div key={current.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-4">
          <div className="rounded-lg border border-border p-5">
            <p className="mb-3 text-sm font-medium">{step + 1}. {current.text}</p>
            <div className="grid gap-2 md:grid-cols-5">
              {survey.options.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-md border border-input p-2 text-xs hover:bg-muted">
                  <input
                    type="radio"
                    className="h-4 w-4"
                    name={`q-${current.id}`}
                    checked={answers[current.id] === option.value}
                    onChange={() => updateAnswer(current.id, option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {error && <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4" />{error}</div>}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Anterior</Button>
          {step < orderedQuestions.length - 1 ? (
            <Button onClick={nextQuestion}>Siguiente</Button>
          ) : (
            <Button onClick={onSubmit}>Enviar y ver reporte</Button>
          )}
          <Button variant="secondary" onClick={() => router.push("/")}>Volver al inicio</Button>
        </div>
      </CardContent>
    </Card>
  );
}
