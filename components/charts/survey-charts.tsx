"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { DimensionResult } from "@/types";

export function DimensionBarChart({ data, maxValue }: { data: DimensionResult[]; maxValue: number }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="dimension" tick={{ fontSize: 11 }} interval={0} angle={-12} textAnchor="end" height={70} />
          <YAxis domain={[0, maxValue]} />
          <Tooltip />
          <Bar dataKey="score" fill="#1d4ed8" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DimensionRadarChart({ data, maxValue }: { data: DimensionResult[]; maxValue: number }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, maxValue]} />
          <Radar dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.45} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
