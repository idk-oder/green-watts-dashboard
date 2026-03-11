import { DashboardLayout } from "@/components/DashboardLayout";
import { defaultAppliances, EMISSION_FACTOR, weeklyData } from "@/data/energy-data";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Leaf, Download } from "lucide-react";

export default function CarbonFootprint() {
  const applianceCO2 = defaultAppliances.map((a) => ({
    name: a.name,
    co2: +(a.energyKwh * EMISSION_FACTOR).toFixed(2),
    color: a.color,
  }));
  const totalCO2 = applianceCO2.reduce((s, a) => s + a.co2, 0);
  const totalEnergy = defaultAppliances.reduce((s, a) => s + a.energyKwh, 0);

  const monthlyTrend = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    co2: +(totalCO2 * (0.8 + Math.random() * 0.4)).toFixed(2),
  }));

  const downloadReport = () => {
    const lines = [
      "CarbonIQ - Daily Carbon Footprint Report",
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      "Appliance Breakdown:",
      ...applianceCO2.map((a) => `  ${a.name}: ${a.co2} kg CO₂`),
      "",
      `Total Energy: ${totalEnergy.toFixed(2)} kWh`,
      `Total CO₂: ${totalCO2.toFixed(2)} kg`,
      `Emission Factor: ${EMISSION_FACTOR} kg CO₂/kWh`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "carbon-footprint-report.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">Carbon Footprint</h1>
          <p className="page-subtitle">Track your CO₂ emissions from household energy usage</p>
        </div>
        <button onClick={downloadReport} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Download className="h-4 w-4" /> Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="metric-card">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="metric-label">Daily CO₂</p>
              <p className="metric-value text-foreground">{totalCO2.toFixed(1)} kg</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="metric-card">
          <p className="metric-label">Monthly Estimate</p>
          <p className="metric-value text-foreground">{(totalCO2 * 30).toFixed(0)} kg</p>
          <p className="text-xs text-muted-foreground">CO₂ per month</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="metric-card">
          <p className="metric-label">Yearly Estimate</p>
          <p className="metric-value text-foreground">{(totalCO2 * 365 / 1000).toFixed(1)} tons</p>
          <p className="text-xs text-muted-foreground">CO₂ per year</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="chart-container">
          <h2 className="section-title mb-4">CO₂ by Appliance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={applianceCO2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(160, 10%, 55%)" }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kg" />
              <Tooltip contentStyle={{ background: "rgba(0,0,0,0.85)", border: "1px solid hsl(160, 84%, 39%)", borderRadius: 8, fontSize: 12, color: "#fff", padding: 10 }} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#fff" }} />
              <Bar dataKey="co2" name="CO₂ (kg)" radius={[4, 4, 0, 0]} fill="hsl(174, 72%, 40%)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="chart-container">
          <h2 className="section-title mb-4">30-Day CO₂ Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kg" />
              <Tooltip contentStyle={{ background: "rgba(0,0,0,0.85)", border: "1px solid hsl(160, 84%, 39%)", borderRadius: 8, fontSize: 12, color: "#fff", padding: 10 }} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#fff" }} />
              <Area type="monotone" dataKey="co2" stroke="hsl(174, 72%, 45%)" fill="url(#co2Grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="chart-container">
        <h2 className="section-title mb-4">Emission Calculation Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Appliance</th>
                <th className="pb-3 font-medium">Energy (kWh)</th>
                <th className="pb-3 font-medium">× Emission Factor</th>
                <th className="pb-3 font-medium">= CO₂ (kg)</th>
              </tr>
            </thead>
            <tbody>
              {defaultAppliances.map((a) => (
                <tr key={a.id} className="border-b border-border/50">
                  <td className="py-3 font-medium">{a.name}</td>
                  <td className="py-3 font-mono text-primary">{a.energyKwh.toFixed(2)}</td>
                  <td className="py-3 font-mono text-muted-foreground">× {EMISSION_FACTOR}</td>
                  <td className="py-3 font-mono text-accent">{(a.energyKwh * EMISSION_FACTOR).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-3">Total</td>
                <td className="py-3 font-mono text-primary">{totalEnergy.toFixed(2)}</td>
                <td className="py-3"></td>
                <td className="py-3 font-mono text-accent">{totalCO2.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
