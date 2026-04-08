"use client";

import {
  AreaChart,
  Area,
  Grid,
  XAxis,
  YAxis,
  ChartTooltip,
} from "@/components/ui/area-chart";

const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1),
  desktop: Math.floor(1200 + Math.sin(i / 3) * 600 + ((i * 13) % 400)),
}));

export default function AreaChartDemo11() {
  return (
    <div className="w-full">
      <AreaChart data={chartData} margin={{ left: 50 }}>
        <Grid horizontal />
        <Area dataKey="desktop" fillOpacity={0.3} strokeWidth={2} />
        <YAxis />
        <XAxis />
        <ChartTooltip />
      </AreaChart>
    </div>
  );
}
