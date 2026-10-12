"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { DimensionResult } from "@/types";

const labels: Record<string, string> = {
  "Guion evitativo": "Evitativo", "Guion adorador": "Adorador", "Guion de estatus": "Estatus", "Guion vigilante": "Vigilante",
  "Preocupación y ansiedad financiera": "Preocupación", "Sensación de falta de control": "Control", "Escasez percibida": "Escasez", "Rumiación e impacto cotidiano": "Vida diaria",
};
const chartData = (data: DimensionResult[]) => data.map(d => ({ ...d, label: labels[d.dimension] ?? d.dimension }));
type Props = { data: DimensionResult[]; maxValue: number; color?: string };
export function DimensionBarChart({ data, maxValue, color = "#1d4ed8" }: Props) {
  return <div role="img" aria-label={`Gráfico de barras. ${data.map(d => `${d.dimension}: ${d.score} de ${maxValue}`).join('. ')}`} className="h-80 w-full min-w-0">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData(data)} margin={{ top: 24, right: 12, bottom: 10, left: -20 }} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#475569" }} interval={0} axisLine={false} tickLine={false} />
        <YAxis domain={[0, maxValue]} ticks={[0, 4, 8, 12, 16, 20]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(value: number) => [`${value} de ${maxValue} puntos`, "Puntaje"]} />
        <Bar dataKey="score" name="Puntaje" fill={color} radius={[6, 6, 0, 0]} maxBarSize={60} isAnimationActive={false} label={{ position: "top", fill: color }} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
}
export function DimensionRadarChart({ data, maxValue, color = "#1d4ed8" }: Props) {
  return <div role="img" aria-label={`Gráfico radar. ${data.map(d => `${d.dimension}: ${d.score} de ${maxValue}`).join('. ')}`} className="h-80 w-full min-w-0">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={chartData(data)} outerRadius="65%">
        <PolarGrid stroke="#cbd5e1" />
        <PolarAngleAxis dataKey="label" tick={{ fontSize: 12, fill: "#475569" }} />
        <PolarRadiusAxis domain={[0, maxValue]} tickCount={5} tick={{ fontSize: 10 }} />
        <Radar dataKey="score" name="Puntaje" stroke={color} fill={color} fillOpacity={0.18} strokeWidth={2} dot={{ r: 4 }} isAnimationActive={false} />
        <Tooltip formatter={(value: number) => [`${value} de ${maxValue} puntos`, "Puntaje"]} />
      </RadarChart>
    </ResponsiveContainer>
  </div>;
}
