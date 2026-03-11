import { DashboardLayout } from "@/components/DashboardLayout";
import { recommendations, alerts } from "@/data/energy-data";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, Info, CheckCircle, Zap, ArrowRight } from "lucide-react";

const impactColors = { High: "text-destructive", Medium: "text-warning", Low: "text-info" };
const alertIcons = { warning: AlertTriangle, info: Info, success: CheckCircle };

export default function Recommendations() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2"><Lightbulb className="h-6 w-6 text-warning" /> AI Recommendations</h1>
        <p className="page-subtitle">Personalized energy saving suggestions powered by AI analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="section-title">Energy Saving Tips</h2>
          {recommendations.map((rec, i) => (
            <motion.div key={rec.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="recommendation-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{rec.title}</h3>
                    <span className={`text-xs font-medium ${impactColors[rec.impact as keyof typeof impactColors]}`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm font-mono text-primary">
                    <Zap className="h-3.5 w-3.5" />
                    {rec.savings}
                  </div>
                  <p className="text-[10px] text-muted-foreground">potential savings</p>
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="metric-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="metric-label">Total Potential Savings</p>
                <p className="metric-value text-primary">9.3 kWh/day</p>
                <p className="text-xs text-muted-foreground">~48% reduction possible</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono text-success">$1.12</p>
                <p className="text-xs text-muted-foreground">saved per day</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <h2 className="section-title">Active Alerts</h2>
          {alerts.map((alert, i) => {
            const Icon = alertIcons[alert.type];
            return (
              <motion.div key={alert.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={`alert-card alert-card-${alert.type}`}>
                <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${alert.type === "warning" ? "text-warning" : alert.type === "info" ? "text-info" : "text-success"}`} />
                <div>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </motion.div>
            );
          })}

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" /> Quick Win
            </h3>
            <p className="text-sm text-muted-foreground">
              Raising your AC by just 2°C and switching to LED bulbs can reduce your daily emissions by <span className="font-mono font-bold text-primary">3.2 kg CO₂</span>.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
