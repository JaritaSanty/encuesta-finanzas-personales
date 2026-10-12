import Link from "next/link";
import { ArrowRight, HeartPulse, BrainCircuit, ChartNoAxesCombined, ListChecks } from "lucide-react";

const evaluations = [
  {
    href: "/encuestas/guiones-dinero",
    title: "Guiones Mentales del Dinero",
    description: "Reconoce las creencias que has aprendido sobre el dinero y cómo influyen en tu manera de ahorrar, gastar y tomar decisiones.",
    detail: "Comprende las ideas detrás de tus decisiones.",
    Icon: BrainCircuit,
    color: "text-blue-800",
    background: "bg-blue-50",
    button: "bg-blue-700 group-hover:bg-blue-800",
  },
  {
    href: "/encuestas/estres-financiero",
    title: "Estrés Financiero",
    description: "Explora cuánta preocupación te genera el dinero y cómo afecta tu día a día. Identifica qué puedes empezar a trabajar para sentirte mejor.",
    detail: "Reconoce cómo te sientes con tus finanzas.",
    Icon: HeartPulse,
    color: "text-teal-800",
    background: "bg-teal-50",
    button: "bg-teal-700 group-hover:bg-teal-800",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-slate-50 px-5 py-10 sm:px-8 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 md:mb-12">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
            Evaluación de mis finanzas personales <span className="font-normal text-slate-600">de forma subjetiva</span>
          </h1>
        </header>
        <div className="grid items-stretch gap-5 md:grid-cols-2 md:gap-7">
          {evaluations.map(({ href, title, description, detail, Icon, color, background, button }) => (
            <Link key={href} href={href} aria-label={`Iniciar encuesta de ${title}`} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-slate-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${background} ${color}`}><Icon className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" /></span>
                <span className="flex items-center gap-2 text-sm text-slate-600"><ListChecks className="h-4 w-4" aria-hidden="true" />16 preguntas</span>
              </div>
              <h2 className="max-w-sm text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
              <p className={`mt-3 text-sm font-semibold ${color}`}>{detail}</p>
              <p className="mb-7 mt-4 flex-1 text-base leading-relaxed text-slate-600">{description}</p>
              <div className="mb-5 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm text-slate-600"><ChartNoAxesCombined className="h-4 w-4 shrink-0" aria-hidden="true" />Al terminar: reporte con gráficos y pasos prácticos</div>
              <span className={`flex min-h-12 items-center justify-between gap-4 rounded-lg px-5 py-3 text-base font-semibold text-white transition-colors ${button}`}>
                Iniciar encuesta<ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
