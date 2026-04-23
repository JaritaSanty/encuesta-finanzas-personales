# Perfil Financiero Personal

Aplicación web educativa para evaluar dos dimensiones de finanzas personales:

1. **Estrés financiero** (ansiedad, control, escasez e impacto cotidiano).
2. **Guiones mentales del dinero** (evitativo, adorador, estatus y vigilante).

Al finalizar cada encuesta, la app muestra un **reporte visual tipo dashboard** con interpretación, gráficos y recomendaciones orientativas.

## Stack tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui (base de componentes)**
- **Recharts** (gráficos)
- **Framer Motion** (microanimaciones)
- **localStorage** (persistencia en cliente)

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrir: `http://localhost:3000`

## Build de producción

```bash
npm run build
```

## Ejecutar en producción

```bash
npm run start
```

## Estructura del proyecto

```text
app/
  page.tsx                       # Landing principal
  encuestas/[survey]/page.tsx    # Flujo de encuesta (estrés o guiones)
  resultados/[survey]/page.tsx   # Reportes finales
components/
  ui/                            # Componentes base estilo shadcn/ui
  survey/                        # Formularios, captura de nombre, panel de resultados
  charts/                        # Gráficos Recharts
lib/
  calculations.ts                # Lógica de puntajes e interpretación
  storage.ts                     # Helpers de localStorage
  constants.ts                   # Claves y configuración compartida
data/
  questions.ts                   # Preguntas y escala Likert de ambas encuestas
types/
  index.ts                       # Tipos TypeScript de dominio
```

## Personalizar preguntas o interpretaciones

- Edita **preguntas, dimensiones y escalas** en `data/questions.ts`.
- Ajusta reglas de **cálculo e interpretación** en `lib/calculations.ts`.
- Si cambias estructura de resultados, revisa también `components/survey/result-panel.tsx`.

## Decisiones técnicas importantes

- Toda la lógica vive en frontend para mantener el proyecto simple (sin backend ni DB).
- Se usa `localStorage` para persistir:
  - nombre del usuario,
  - respuestas temporales,
  - último reporte generado por encuesta.
- La encuesta se presenta en modalidad **una pregunta por pantalla** y en **orden aleatorio** para disminuir sesgos por categoría.
- El reporte incluye botón de **impresión/exportación a PDF** usando `window.print()`.

## Nota de uso

Esta herramienta tiene un fin **educativo y orientativo**. No reemplaza evaluación clínica, psicológica ni asesoría financiera profesional.
