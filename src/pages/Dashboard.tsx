import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { Zap, Leaf, DollarSign, Gauge } from "lucide-react";
import { defaultAppliances, calculateMetrics, hourlyData, weeklyData } from "@/data/energy-data";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { useState } from "react";

export default function Dashboard() {
  const metrics = calculateMetrics(defaultAppliances);
  const pieData = defaultAppliances.map((a) => ({ name: a.name, value: a.energyKwh, color: a.color }));

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your energy consumption and carbon emissions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Energy" value={`${metrics.totalEnergy.toFixed(1)} kWh`} icon={Zap} trend={{ value: 5.2, label: "vs yesterday" }} />
        <MetricCard title="Carbon Footprint" value={`${metrics.carbonFootprint.toFixed(1)} kg CO₂`} icon={Leaf} trend={{ value: -3.1, label: "vs last week" }} delay={0.1} />
        <MetricCard title="Daily Cost" value={`$${metrics.cost.toFixed(2)}`} icon={DollarSign} delay={0.2} />
        <MetricCard title="Efficiency" value={`${metrics.efficiencyScore}%`} icon={Gauge} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="chart-container">
          <h2 className="section-title mb-4">Energy Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={110} innerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(160, 15%, 9%)", border: "1px solid hsl(160, 10%, 16%)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="chart-container">
          <h2 className="section-title mb-4">Appliance Usage (kWh)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={defaultAppliances} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} />
              <Tooltip contentStyle={{ background: "hsl(160, 15%, 9%)", border: "1px solid hsl(160, 10%, 16%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="energyKwh" name="Energy (kWh)" radius={[0, 4, 4, 0]}>
                {defaultAppliances.map((a, i) => (
                  <Cell key={i} fill={a.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="chart-container">
        <h2 className="section-title mb-4">Daily Energy Pattern</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} interval={3} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kWh" />
            <Tooltip contentStyle={{ background: "hsl(160, 15%, 9%)", border: "1px solid hsl(160, 10%, 16%)", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="energy" stroke="hsl(160, 84%, 45%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </DashboardLayout>
  );
}
