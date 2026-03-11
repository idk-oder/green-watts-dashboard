import { DashboardLayout } from "@/components/DashboardLayout";
import { predictionData, hourlyData } from "@/data/energy-data";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { Brain, TrendingUp, Clock, Zap } from "lucide-react";

export default function Predictions() {
  const peakHour = hourlyData.reduce((max, d) => (d.energy > max.energy ? d : max));
  const tomorrowPredicted = predictionData.reduce((s, d) => s + d.predicted, 0);
  const todayActual = hourlyData.reduce((s, d) => s + d.energy, 0);
  const diff = ((tomorrowPredicted - todayActual) / todayActual * 100).toFixed(1);

  const weekForecast = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
    day,
    predicted: +(todayActual / 24 * (20 + Math.sin(i) * 4 + Math.random() * 2)).toFixed(1),
  }));

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2"><Brain className="h-6 w-6 text-primary" /> AI Energy Predictions</h1>
        <p className="page-subtitle">Simulated AI forecasting for energy consumption patterns</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <p className="metric-label">Tomorrow's Prediction</p>
          </div>
          <p className="metric-value text-foreground">{tomorrowPredicted.toFixed(1)} kWh</p>
          <p className={`text-xs font-medium mt-1 ${Number(diff) >= 0 ? "text-destructive" : "text-success"}`}>
            {Number(diff) >= 0 ? "↑" : "↓"} {Math.abs(Number(diff))}% vs today
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-warning" />
            <p className="metric-label">Peak Hours</p>
          </div>
          <p className="metric-value text-foreground">{peakHour.time}</p>
          <p className="text-xs text-muted-foreground">{peakHour.energy} kWh peak</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="metric-card">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-5 w-5 text-accent" />
            <p className="metric-label">AI Confidence</p>
          </div>
          <p className="metric-value text-foreground">87%</p>
          <p className="text-xs text-muted-foreground">Model accuracy</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="chart-container mb-6">
        <h2 className="section-title mb-4">Actual vs Predicted Energy (Today)</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} interval={3} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kWh" />
            <Tooltip contentStyle={{ background: "rgba(0,0,0,0.85)", border: "1px solid hsl(160, 84%, 39%)", borderRadius: 8, fontSize: 12, color: "#fff", padding: 10 }} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="actual" stroke="hsl(160, 84%, 45%)" strokeWidth={2} dot={false} name="Actual" />
            <Line type="monotone" dataKey="predicted" stroke="hsl(38, 92%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="AI Predicted" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="chart-container">
        <h2 className="section-title mb-4">7-Day Forecast</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={weekForecast}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(160, 10%, 55%)" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kWh" />
            <Tooltip contentStyle={{ background: "hsl(160, 15%, 9%)", border: "1px solid hsl(160, 10%, 16%)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="predicted" stroke="hsl(210, 80%, 55%)" fill="url(#forecastGrad)" strokeWidth={2} name="Predicted (kWh)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </DashboardLayout>
  );
}
