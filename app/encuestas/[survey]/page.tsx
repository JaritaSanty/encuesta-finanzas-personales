"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NameGate } from "@/components/survey/name-gate";
import { SurveyForm } from "@/components/survey/survey-form";
import { surveys } from "@/data/questions";
import { getLocalStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Answers, SurveyKey } from "@/types";

export default function SurveyPage() {
  const params = useParams<{ survey: SurveyKey }>();
  const key = params.survey;
  const survey = surveys[key];
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [initialAnswers, setInitialAnswers] = useState<Answers>({});

  useEffect(() => {
    if (!survey) return;
    setName(getLocalStorage<string>(STORAGE_KEYS.fullName, ""));
    const storageKey = key === "estres-financiero" ? STORAGE_KEYS.stressAnswers : STORAGE_KEYS.scriptsAnswers;
    const saved = getLocalStorage<Answers>(storageKey, {});
    setInitialAnswers(Object.fromEntries(survey.questions.filter((q) => survey.options.some((o) => o.value === saved[q.id])).map((q) => [q.id, saved[q.id]])));
    setLoaded(true);
  }, [key, survey]);

  const title = useMemo(() => (key === "estres-financiero" ? "Estrés Financiero" : "Guiones Mentales del Dinero"), [key]);

  if (!survey) return <main className="min-h-screen p-10">Encuesta no encontrada.</main>;

  return (
    <main data-survey={key} className="survey-theme min-h-screen bg-slate-50 px-5 py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">← Volver al inicio</Link>
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground">Responde con honestidad. No hay respuestas correctas o incorrectas.</p>
        </header>
        {!loaded ? null : !name ? <NameGate onValidName={setName} /> : <SurveyForm key={key} survey={survey} initialAnswers={initialAnswers} userName={name} />}
      </div>
    </main>
  );
}
