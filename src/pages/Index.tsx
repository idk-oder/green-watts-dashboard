import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { Zap, Leaf, DollarSign, Gauge, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { defaultAppliances, calculateMetrics, alerts, weeklyData, hourlyData } from "@/data/energy-data";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";

const alertIcons = { warning: AlertTriangle, info: Info, success: CheckCircle };

const Index = () => {
  const metrics = calculateMetrics(defaultAppliances);
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome to CarbonIQ</h1>
        <p className="page-subtitle">AI-powered carbon footprint analyzer for energy conservation</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Energy" value={`${metrics.totalEnergy.toFixed(1)} kWh`} icon={Zap} trend={{ value: 5.2, label: "vs yesterday" }} delay={0} />
        <MetricCard title="Carbon Footprint" value={`${metrics.carbonFootprint.toFixed(1)} kg`} subtitle="CO₂ emissions" icon={Leaf} trend={{ value: -3.1, label: "vs last week" }} delay={0.1} />
        <MetricCard title="Electricity Cost" value={`$${metrics.cost.toFixed(2)}`} subtitle="Estimated daily" icon={DollarSign} delay={0.2} />
        <MetricCard title="Efficiency Score" value={`${metrics.efficiencyScore}%`} subtitle="Energy efficiency" icon={Gauge} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="chart-container lg:col-span-2">
          <h2 className="section-title mb-4">Today's Energy Usage</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} interval={3} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kWh" />
              <Tooltip contentStyle={{ background: "hsl(160, 15%, 9%)", border: "1px solid hsl(160, 10%, 16%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="energy" stroke="hsl(160, 84%, 45%)" fill="url(#energyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="chart-container">
          <h2 className="section-title mb-4">Smart Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <div key={alert.id} className={`alert-card alert-card-${alert.type}`}>
                  <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${alert.type === "warning" ? "text-warning" : alert.type === "info" ? "text-info" : "text-success"}`} />
                  <div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="chart-container">
        <h2 className="section-title mb-4">Weekly Energy Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(160, 10%, 55%)" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} />
            <Tooltip contentStyle={{ background: "hsl(160, 15%, 9%)", border: "1px solid hsl(160, 10%, 16%)", borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="energy" fill="hsl(160, 84%, 45%)" radius={[4, 4, 0, 0]} name="Energy (kWh)" />
            <Bar dataKey="carbon" fill="hsl(174, 72%, 40%)" radius={[4, 4, 0, 0]} name="CO₂ (kg)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
        {[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Energy Analysis", path: "/energy-analysis" },
          { label: "Carbon Footprint", path: "/carbon-footprint" },
          { label: "AI Predictions", path: "/predictions" },
          { label: "Recommendations", path: "/recommendations" },
        ].map((link) => (
          <button key={link.path} onClick={() => navigate(link.path)} className="rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-center">
            {link.label}
          </button>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Index;
