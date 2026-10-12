"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
  const questionRef = useRef<HTMLLegendElement>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  useEffect(() => { questionRef.current?.focus(); }, [step]);

  useEffect(() => {
    const orderKey = ORDER_BY_SURVEY[survey.key];
    const savedOrder = getLocalStorage<number[]>(orderKey, []);
    const isValid = Array.isArray(savedOrder) && new Set(savedOrder).size === survey.questions.length && savedOrder.length === survey.questions.length && savedOrder.every((id) => survey.questions.some((q) => q.id === id));

    if (isValid) {
      setQuestionOrder(savedOrder);
      const next = savedOrder.findIndex((id) => !initialAnswers[id]);
      setStep(next < 0 ? 0 : next);
      return;
    }

    const randomized = shuffle(survey.questions.map((q) => q.id));
    setQuestionOrder(randomized);
    setLocalStorage(orderKey, randomized);
  }, [survey, initialAnswers]);

  const orderedQuestions = useMemo(() => {
    const map = new Map(survey.questions.map((q) => [q.id, q]));
    return questionOrder.map((id) => map.get(id)).filter((q): q is NonNullable<typeof q> => Boolean(q));
  }, [questionOrder, survey.questions]);

  const completed = survey.questions.filter((q) => survey.options.some((o) => o.value === answers[q.id])).length;
  const progress = (completed / survey.questions.length) * 100;

  const updateAnswer = (id: number, value: number) => {
    const next = { ...answers, [id]: value };
    setAnswers(next);
    setSaveFailed(!setLocalStorage(STORAGE_BY_SURVEY[survey.key], next));
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
    if (!setLocalStorage(STORAGE_BY_SURVEY[survey.key], answers) || !setLocalStorage(RESULT_BY_SURVEY[survey.key], result)) {
      setError("No pudimos guardar el reporte. Permite el almacenamiento del sitio en tu navegador y vuelve a intentarlo. Tus respuestas siguen en esta pantalla.");
      return;
    }
    router.push(`/resultados/${survey.key}`);
  };

  const current = orderedQuestions[step];

  if (!current) {
    return (
      <Card className="border border-slate-200 bg-white shadow-none rounded-2xl">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Cargando preguntas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-none rounded-2xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>Tu experiencia cuenta</CardTitle>
          <Badge className="max-w-full break-words">{userName}</Badge>
        </div>
        <CardDescription>{survey.subtitle}</CardDescription>
        <Progress value={progress} className="mt-2" />
        <p className="text-xs text-muted-foreground">Pregunta {step + 1} de {orderedQuestions.length} · {completed}/{survey.questions.length} respondidas</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div key={current.id} className="space-y-4">
          <fieldset aria-describedby="answer-help" className="min-w-0">
            <legend ref={questionRef} tabIndex={-1} className="mb-4 w-full text-2xl font-semibold leading-snug outline-none">{current.text}</legend>
            <p id="answer-help" className="mb-5 text-sm text-muted-foreground">Elige la opción que más se acerque a tu experiencia.</p>
            <div className="grid gap-3">
              {survey.options.map((option) => (
                <label key={option.value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-md border p-4 text-base transition-colors focus-within:ring-2 focus-within:ring-primary ${answers[current.id] === option.value ? "border-primary bg-blue-50 font-semibold text-blue-900" : "border-input hover:border-primary hover:bg-muted"}`}>
                  <input
                    type="radio"
                    className="h-5 w-5 accent-blue-700"
                    name={`q-${current.id}`}
                    checked={answers[current.id] === option.value}
                    onChange={() => updateAnswer(current.id, option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {saveFailed && <p role="status" className="text-sm text-amber-800">El navegador no permite guardar tu avance. No cierres esta página hasta terminar.</p>}
        {error && <div role="alert" className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-5 w-5 accent-blue-700" />{error}</div>}

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
          <Button variant="outline" onClick={() => { setError(""); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0}>Anterior</Button>
          {step < orderedQuestions.length - 1 ? (
            <Button className="min-h-12 flex-1" onClick={nextQuestion}>Siguiente</Button>
          ) : (
            <Button className="min-h-12 flex-1" onClick={onSubmit}>Ver mi reporte</Button>
          )}
          <Button variant="secondary" onClick={() => router.push("/")}>Salir al inicio</Button>
        </div>
      </CardContent>
    </Card>
  );
}
