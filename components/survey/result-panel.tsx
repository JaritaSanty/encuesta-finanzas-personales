"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Printer, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DimensionBarChart, DimensionRadarChart } from "@/components/charts/survey-charts";
import { removeLocalStorage } from "@/lib/storage";
import { DATE_FORMAT, STORAGE_KEYS } from "@/lib/constants";
import { guideFor } from "@/lib/guidance";
import { ScriptResult, StressResult, SurveyKey } from "@/types";

export function ResultPanel({ survey, userName, result }: { survey: SurveyKey; userName: string; result: StressResult | ScriptResult }) {
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const isStress = survey === "estres-financiero";
  const dimensions = result.dimensions;
  const topScore = Math.max(...dimensions.map((d) => d.score));
  const leading = dimensions.filter((d) => d.score === topScore);
  const nearby = dimensions.filter((d) => d.score === topScore - 1);
  const lowAgreement = !isStress && topScore <= 12;
  const date = new Date(result.generatedAt).toLocaleDateString(DATE_FORMAT, { dateStyle: "long" });
  const reset = () => {
    const keys = isStress ? [STORAGE_KEYS.stressAnswers, STORAGE_KEYS.stressResult, STORAGE_KEYS.stressOrder] : [STORAGE_KEYS.scriptsAnswers, STORAGE_KEYS.scriptsResult, STORAGE_KEYS.scriptsOrder];
    keys.forEach(removeLocalStorage);
    router.push(`/encuestas/${survey}`);
  };
  return <article data-survey={survey} className="survey-theme mx-auto max-w-6xl space-y-8">
    <Link href="/" className="no-print inline-block text-sm text-primary hover:underline">Volver al inicio</Link>
    <header className="border-b border-border pb-8">
      <h1 className="break-words text-3xl font-bold tracking-tight md:text-4xl">Tu reporte, {userName}</h1>
      <p className="mt-3 text-muted-foreground">{isStress ? "Estrés Financiero" : "Guiones Mentales del Dinero"} · {date}</p>
      <p className="mt-5 max-w-2xl">Tus respuestas son un punto de partida para entenderte y elegir un cambio posible. No son una nota ni una medida de tu valor personal.</p>
    </header>
    <section className="report-section rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <h2 className="text-2xl font-semibold">¿Qué muestran tus respuestas?</h2>
      {isStress ? <>
        <p className="mt-4 leading-relaxed">{(result as StressResult).total <= 32 ? "En conjunto, marcaste que estas preocupaciones aparecen con poca frecuencia." : (result as StressResult).total <= 48 ? "En conjunto, tus respuestas se acercan a «a veces»: hay preocupaciones que conviene revisar con calma." : "En conjunto, indicas que las preocupaciones por dinero aparecen con frecuencia. Puedes empezar por un solo paso y buscar apoyo si lo necesitas."}</p>
        <p className="mt-4 font-medium text-blue-900">Suma de tus respuestas: {(result as StressResult).total} de 80 puntos posibles.</p>
        <p className="mt-2 text-sm text-muted-foreground">El mínimo es 16, aunque respondas «Nunca» a todo. Un puntaje mayor significa mayor frecuencia declarada, no más deuda ni menos capacidad para manejar dinero.</p>
      </> : <>
        <p className="mt-4 text-sm font-medium text-slate-600">{leading.length > 1 ? "Tus guiones con mayor puntaje (empate)" : "Tu mayor inclinación según estas respuestas"}</p>
        <p className="mt-2 text-3xl font-bold text-blue-800">{leading.map(d => d.dimension).join(" · ")}</p>
        <p className="mt-3 font-semibold">{topScore} de 20 puntos{leading.length > 1 ? " en cada guion" : ""}</p>
        <p className="mt-3 text-slate-600">{leading.length > 1 ? "Estos guiones comparten el primer lugar. No hay una única inclinación predominante." : guideFor(leading[0].dimension).meaning}</p>
        {nearby.length > 0 && <p className="mt-3 text-sm text-slate-600">Muy cerca: {nearby.map(d => `${d.dimension} (${d.score}/20)`).join(", ")}. La diferencia es de solo un punto; puedes identificarte con varios guiones.</p>}
        {lowAgreement && <p className="mt-3 text-sm text-slate-600">Aunque este es tu resultado más alto, el acuerdo general es bajo o intermedio. Es una inclinación relativa, no una creencia fuerte ni una etiqueta personal.</p>}
        <p className="mt-3 text-sm text-muted-foreground">Tener un puntaje alto no es bueno ni malo por sí solo. Importa cómo estas ideas influyen en tus decisiones y necesidades.</p>
      </>}
    </section>
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="report-section min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
        <h2 className="text-2xl font-semibold">Compara tus puntajes</h2>
        <p className="mt-3 text-sm text-slate-600">Cada área suma cuatro respuestas, de 4 a 20 puntos. Una barra más alta significa {isStress ? "preocupaciones más frecuentes" : "mayor acuerdo con ese guion"}.</p>
        <DimensionBarChart data={dimensions} maxValue={20} color={isStress ? "#0f766e" : "#1d4ed8"} />
      </section>
      <section className="report-section min-w-0 rounded-2xl border border-slate-200 bg-white p-5 md:p-8">
        <h2 className="text-2xl font-semibold">Tu mapa de {isStress ? "estrés financiero" : "guiones mentales"}</h2>
        <p className="mt-3 text-sm text-slate-600">Cada punta representa un área. Cuanto más lejos del centro, mayor es el puntaje. Los valores son puntos, no porcentajes.</p>
        <DimensionRadarChart data={dimensions} maxValue={20} color={isStress ? "#0f766e" : "#1d4ed8"} />
      </section>
    </div>
    <section>
      <h2 className="text-2xl font-semibold">Cómo leer cada área</h2>
      <div className="mt-3 divide-y divide-border">
        {dimensions.map((d) => <div className="report-section py-5" key={d.dimension}>
          <h3 className="text-lg font-semibold">{isStress ? guideFor(d.dimension).label : d.dimension} <span className="text-sm font-normal text-slate-500">{d.score}/20 puntos</span></h3>
          <p className="mt-1 text-muted-foreground">{guideFor(d.dimension).meaning}</p>
          <p className="mt-2 text-sm">Promedio de tus respuestas: <strong className="tabular-nums">{(d.score / 4).toLocaleString("es", { maximumFractionDigits: 2 })} de 5</strong>. {isStress ? "1 significa «Nunca» y 5, «Siempre»." : "1 significa «Totalmente en desacuerdo» y 5, «Totalmente de acuerdo»."}</p>
        </div>)}
      </div>
    </section>
    <section className="report-section rounded-2xl bg-blue-50 p-6 md:p-8">
      <h2 className="text-2xl font-semibold">Un primer paso para esta semana</h2>
      <p className="mt-3 text-blue-950">{isStress ? "Puedes empezar por una de las áreas con más puntos:" : lowAgreement ? "Puedes empezar por revisar una decisión cotidiana:" : "Según las ideas que más se repiten en tus respuestas:"}</p>
      <ol className="mt-5 list-decimal space-y-4 pl-5 text-blue-950">
        {(lowAgreement ? ["Anota una compra reciente y qué te llevó a hacerla. Piensa si respondió a una necesidad o a una emoción.", "Haz una lista de los pagos que necesitas cubrir esta semana y comprueba cuándo tendrás dinero disponible.", ...result.recommendations.slice(2)] : result.recommendations).map((tip) => <li className="pl-2" key={tip}>{tip}</li>)}
      </ol>
      <p className="mt-5 text-sm text-blue-950">No hace falta hacerlo todo hoy. Elige una acción que puedas mantener y revísala la próxima semana.</p>
    </section>
    <details className="report-section rounded-lg border border-border p-5">
      <summary className="cursor-pointer font-semibold">Cómo se calcula y qué puede decirte este reporte</summary>
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <p>Se suman respuestas de 1 a 5, con el mismo peso para todas las preguntas. Cada área contiene cuatro preguntas. El promedio es la suma del área dividida entre cuatro.</p>
        <p>{isStress ? "El resumen agrupa sumas de 16–32, 33–48 y 49–80 para describir la frecuencia de tus respuestas." : "Siempre se muestra el guion con mayor puntaje. Si varios empatan, se muestran todos. Los que están a un punto se indican como cercanos. Un máximo de 12 o menos se acompaña de una aclaración sobre el bajo acuerdo general."} Estas reglas son orientativas de esta aplicación; no son límites clínicos validados.</p>
        <p>Este cuestionario educativo no es una evaluación clínica ni una escala validada de bienestar financiero. No recoge ingresos, gastos ni deudas, por lo que no puede determinar cuánto puedes ahorrar o pedir prestado.</p>
        <p>Para ampliar los pasos de organización, consulta las <a className="text-primary underline" href="https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/toolkit/" target="_blank" rel="noreferrer">herramientas educativas del CFPB (en inglés)</a>. Son una referencia para las acciones generales, no una validación de este cuestionario.</p>
      </div>
    </details>
    <div className="no-print space-y-4 border-t border-border pt-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" aria-hidden="true" />Imprimir o guardar PDF</Button>
        <Button variant="outline" onClick={() => setConfirmReset(true)}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Repetir cuestionario</Button>
      </div>
      {confirmReset && <div role="alert" className="rounded-md border border-border bg-white p-4"><p className="mb-3">Se borrarán las respuestas y el reporte de este cuestionario en este navegador. Puedes guardar el PDF antes de continuar.</p><div className="flex flex-wrap gap-3"><Button onClick={reset}>Borrar y empezar de nuevo</Button><Button variant="outline" onClick={() => setConfirmReset(false)}>Conservar mi reporte</Button></div></div>}
      <p className="text-sm text-muted-foreground">Para guardar un archivo, elige «Guardar como PDF» en la ventana de impresión.</p>
      <Link className="inline-flex items-center gap-2 text-primary hover:underline" href={`/encuestas/${isStress ? "guiones-dinero" : "estres-financiero"}`}>Explorar {isStress ? "mis guiones mentales del dinero" : "mi estrés financiero"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div>
  </article>;
}
