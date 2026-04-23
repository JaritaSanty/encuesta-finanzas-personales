"use client";

import { useRouter } from "next/navigation";
import { Printer, RotateCcw, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DimensionBarChart, DimensionRadarChart } from "@/components/charts/survey-charts";
import { removeLocalStorage } from "@/lib/storage";
import { DATE_FORMAT, STORAGE_KEYS } from "@/lib/constants";
import { ScriptResult, StressResult, SurveyKey } from "@/types";

export function ResultPanel({ survey, userName, result }: { survey: SurveyKey; userName: string; result: StressResult | ScriptResult }) {
  const router = useRouter();
  const isStress = survey === "estres-financiero";
  const dimensions = result.dimensions;
  const date = new Date(result.generatedAt).toLocaleDateString(DATE_FORMAT, { dateStyle: "long" });

  const reset = () => {
    if (isStress) {
      removeLocalStorage(STORAGE_KEYS.stressAnswers);
      removeLocalStorage(STORAGE_KEYS.stressResult);
    } else {
      removeLocalStorage(STORAGE_KEYS.scriptsAnswers);
      removeLocalStorage(STORAGE_KEYS.scriptsResult);
    }
    router.push(`/encuestas/${survey}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-white">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-2xl">Reporte de resultados de {userName}</CardTitle>
            <Badge>{isStress ? "Estrés Financiero" : "Guiones Mentales del Dinero"}</Badge>
          </div>
          <CardDescription>Generado el {date}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isStress ? (
            <>
              <Card className="shadow-none"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Puntaje total</p><p className="text-4xl font-bold text-primary">{(result as StressResult).total}</p><p className="mt-2 text-sm">Nivel: <strong>{(result as StressResult).level}</strong></p></CardContent></Card>
              <Card className="shadow-none"><CardContent className="pt-6"><p className="text-sm font-medium">Interpretación</p><p className="mt-2 text-sm text-muted-foreground">Tu puntaje sintetiza la intensidad de la carga emocional, sensación de control y su impacto cotidiano.</p></CardContent></Card>
            </>
          ) : (
            <>
              <Card className="shadow-none"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Guion dominante</p><p className="text-2xl font-bold text-primary">{(result as ScriptResult).dominant}</p><p className="mt-2 text-sm">Perfil mixto: {(result as ScriptResult).mixedProfile ? "Sí" : "No"}</p></CardContent></Card>
              <Card className="shadow-none"><CardContent className="pt-6"><p className="text-sm font-medium">Interpretación</p><p className="mt-2 text-sm text-muted-foreground">Este patrón refleja creencias aprendidas que pueden orientar tus decisiones financieras de manera automática.</p></CardContent></Card>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 bg-white"><CardHeader><CardTitle>Comparativo por dimensión</CardTitle></CardHeader><CardContent><DimensionBarChart data={dimensions} maxValue={isStress ? 20 : 20} /></CardContent></Card>
        <Card className="border-0 bg-white"><CardHeader><CardTitle>Mapa radial</CardTitle></CardHeader><CardContent><DimensionRadarChart data={dimensions} maxValue={20} /></CardContent></Card>
      </div>

      <Card className="border-0 bg-white">
        <CardHeader><CardTitle>Resumen por dimensiones</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {dimensions.map((d) => (
            <div key={d.dimension} className="rounded-md border border-border p-3">
              <p className="font-medium">{d.dimension}: {d.score} pts</p>
              <p className="text-sm text-muted-foreground">{d.interpretation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white">
        <CardHeader><CardTitle>Recomendaciones generales</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            {result.recommendations.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </CardContent>
      </Card>

      <div className="no-print flex flex-wrap gap-3">
        <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir / Exportar PDF</Button>
        <Button variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" />Reiniciar encuesta</Button>
        <Button variant="secondary" onClick={() => router.push("/")}><Home className="mr-2 h-4 w-4" />Ir al inicio</Button>
      </div>
    </div>
  );
}
