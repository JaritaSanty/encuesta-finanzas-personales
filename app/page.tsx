import Link from "next/link";
import { ArrowRight, BrainCircuit, HeartPulse, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/40">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <section className="mb-12 rounded-2xl bg-white p-8 shadow-soft md:p-12">
          <p className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Plataforma educativa</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Perfil Financiero Personal</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">Evalúa de manera integral tu bienestar financiero y tus creencias sobre el dinero con reportes visuales, claros y orientados al autoconocimiento.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className={buttonVariants({ size: "lg" })} href="/encuestas/estres-financiero">Iniciar evaluación de estrés <ArrowRight className="ml-2 h-4 w-4" /></Link>
            <Link className={buttonVariants({ size: "lg", variant: "outline" })} href="/encuestas/guiones-dinero">Explorar guiones mentales <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-primary" />¿Qué es el estrés financiero?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Es la tensión emocional asociada a deudas, pagos, incertidumbre económica y sensación de falta de control sobre el dinero, con efectos en descanso, relaciones y estado de ánimo.</p>
            </CardContent>
          </Card>
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-cyan-600" />¿Qué son los guiones mentales del dinero?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Son creencias aprendidas e inconscientes que condicionan cómo ahorras, gastas, te endeudas y defines el éxito financiero. Identificarlos ayuda a tomar decisiones más conscientes.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Encuesta de Estrés Financiero</CardTitle>
              <CardDescription>16 ítems en 4 dimensiones para medir intensidad y áreas de impacto.</CardDescription>
            </CardHeader>
            <CardContent><Link className={buttonVariants({ className: "w-full" })} href="/encuestas/estres-financiero">Comenzar ahora</Link></CardContent>
          </Card>
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Encuesta de Guiones Mentales</CardTitle>
              <CardDescription>Detecta tu guion dominante y posibles perfiles mixtos.</CardDescription>
            </CardHeader>
            <CardContent><Link className={buttonVariants({ className: "w-full" })} href="/encuestas/guiones-dinero">Comenzar ahora</Link></CardContent>
          </Card>
        </section>

        <section className="rounded-xl border border-border bg-white p-6 text-center shadow-soft">
          <LineChart className="mx-auto mb-3 h-7 w-7 text-primary" />
          <h2 className="text-2xl font-semibold">Conoce tu perfil financiero personal</h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-muted-foreground">Completa ambas evaluaciones y utiliza el reporte como una brújula de crecimiento personal y financiero. Esta herramienta es educativa y orientativa.</p>
        </section>
      </div>
    </main>
  );
}
