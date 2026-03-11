import { DashboardLayout } from "@/components/DashboardLayout";
import { defaultAppliances, calculateMetrics, EMISSION_FACTOR, COST_PER_KWH } from "@/data/energy-data";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Calculator } from "lucide-react";

interface UserAppliance {
  id: string;
  name: string;
  powerWatts: number;
  hoursPerDay: number;
}

export default function EnergyAnalysis() {
  const [appliances, setAppliances] = useState<UserAppliance[]>([
    { id: "1", name: "Air Conditioner", powerWatts: 1500, hoursPerDay: 8 },
    { id: "2", name: "Refrigerator", powerWatts: 150, hoursPerDay: 24 },
    { id: "3", name: "Laptop", powerWatts: 65, hoursPerDay: 8 },
  ]);
  const [newName, setNewName] = useState("");
  const [newWatts, setNewWatts] = useState("");
  const [newHours, setNewHours] = useState("");

  const addAppliance = () => {
    if (!newName || !newWatts || !newHours) return;
    setAppliances([...appliances, { id: Date.now().toString(), name: newName, powerWatts: Number(newWatts), hoursPerDay: Number(newHours) }]);
    setNewName(""); setNewWatts(""); setNewHours("");
  };

  const remove = (id: string) => setAppliances(appliances.filter((a) => a.id !== id));

  const results = appliances.map((a) => {
    const kwh = (a.powerWatts * a.hoursPerDay) / 1000;
    return { ...a, kwh, co2: kwh * EMISSION_FACTOR, cost: kwh * COST_PER_KWH };
  });
  const totalKwh = results.reduce((s, r) => s + r.kwh, 0);
  const totalCo2 = totalKwh * EMISSION_FACTOR;
  const totalCost = totalKwh * COST_PER_KWH;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Energy Analysis</h1>
        <p className="page-subtitle">Add your appliances to calculate energy consumption</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chart-container lg:col-span-2">
          <h2 className="section-title mb-4 flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /> Appliance Calculator</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Appliance name" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <input value={newWatts} onChange={(e) => setNewWatts(e.target.value)} placeholder="Power (Watts)" type="number" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <input value={newHours} onChange={(e) => setNewHours(e.target.value)} placeholder="Hours/day" type="number" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <button onClick={addAppliance} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Appliance</th>
                  <th className="pb-3 font-medium">Power</th>
                  <th className="pb-3 font-medium">Hours</th>
                  <th className="pb-3 font-medium">Energy</th>
                  <th className="pb-3 font-medium">CO₂</th>
                  <th className="pb-3 font-medium">Cost</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b border-border/50">
                    <td className="py-3 font-medium">{r.name}</td>
                    <td className="py-3 font-mono text-muted-foreground">{r.powerWatts}W</td>
                    <td className="py-3 font-mono text-muted-foreground">{r.hoursPerDay}h</td>
                    <td className="py-3 font-mono text-primary">{r.kwh.toFixed(2)} kWh</td>
                    <td className="py-3 font-mono text-accent">{r.co2.toFixed(2)} kg</td>
                    <td className="py-3 font-mono text-warning">${r.cost.toFixed(2)}</td>
                    <td className="py-3">
                      <button onClick={() => remove(r.id)} className="text-destructive/60 hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="metric-card">
            <p className="metric-label">Total Energy</p>
            <p className="metric-value text-primary">{totalKwh.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">kWh per day</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Carbon Emissions</p>
            <p className="metric-value text-accent">{totalCo2.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">kg CO₂ per day</p>
          </div>
          <div className="metric-card">
            <p className="metric-label">Daily Cost</p>
            <p className="metric-value text-warning">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">estimated</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground text-sm mb-2">Formula</p>
            <p className="font-mono">Energy = Power × Hours / 1000</p>
            <p className="font-mono">CO₂ = Energy × {EMISSION_FACTOR} kg/kWh</p>
            <p className="font-mono">Cost = Energy × ${COST_PER_KWH}/kWh</p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
