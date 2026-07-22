"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ProgressChart({ data }: { data: Array<{ name: string; nilai: number }> }) {
  return <div className="h-60 w-full" aria-label="Grafik perkembangan nilai hafalan"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}><defs><linearGradient id="nilaiHafalan" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3"/><XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }}/><YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 11 }}/><Tooltip cursor={{ stroke: "#10b981", strokeWidth: 1 }} contentStyle={{ borderRadius: 12, border: "1px solid #d1fae5", boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)" }} formatter={(value) => [`${value} poin`, "Nilai rata-rata"]}/><Area type="monotone" dataKey="nilai" stroke="#059669" strokeWidth={3} fill="url(#nilaiHafalan)"/></AreaChart></ResponsiveContainer></div>;
}
