"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ResultPanel } from "@/components/survey/result-panel";
import { STORAGE_KEYS } from "@/lib/constants";
import { getLocalStorage } from "@/lib/storage";
import { surveys } from "@/data/questions";
import { calculateStressResult, calculateScriptsResult } from "@/lib/calculations";
import { Answers, ScriptResult, StressResult, SurveyKey } from "@/types";

export default function ResultPage() {
  const params = useParams<{ survey: SurveyKey }>();
  const key = params.survey;


  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [result, setResult] = useState<StressResult | ScriptResult | null>(null);

  useEffect(() => {
    setName(getLocalStorage<string>(STORAGE_KEYS.fullName, "Participante"));
    const storageKey = key === "estres-financiero" ? STORAGE_KEYS.stressResult : STORAGE_KEYS.scriptsResult;
    const saved = getLocalStorage<StressResult | ScriptResult | null>(storageKey, null);
    const answers = getLocalStorage<Answers>(key === "estres-financiero" ? STORAGE_KEYS.stressAnswers : STORAGE_KEYS.scriptsAnswers, {});
    try {
      if (!saved || !surveys[key]) { setResult(null); }
      else {
        const fresh = key === "estres-financiero" ? calculateStressResult(surveys[key].questions, answers) : calculateScriptsResult(surveys[key].questions, answers);
        setResult({ ...fresh, generatedAt: typeof saved.generatedAt === "string" && !Number.isNaN(Date.parse(saved.generatedAt)) ? saved.generatedAt : fresh.generatedAt });
      }
    } catch { setResult(null); }
    setLoaded(true);
  }, [key]);

  if (key !== "estres-financiero" && key !== "guiones-dinero") return <main className="p-10">Resultado no encontrado. <Link href="/">Volver al inicio</Link></main>;
  if (!loaded) return <main className="p-10" role="status">Cargando tu reporte…</main>;

  if (!result) {
    return (
      <main className="min-h-screen px-4 py-16">
        <div className="mx-auto max-w-xl rounded-lg border border-border bg-white p-6 text-center shadow-soft">
          <h1 className="text-2xl font-semibold">No hay resultados disponibles</h1>
          <p className="mt-2 text-sm text-muted-foreground">Completa la encuesta para generar tu reporte visual.</p>
          <Link className="mt-4 inline-block text-primary underline" href={`/encuestas/${key}`}>Ir a la encuesta</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <ResultPanel survey={key} userName={name} result={result} />
      </div>
    </main>
  );
}
