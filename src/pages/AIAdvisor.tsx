import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatWindow } from "@/components/ChatWindow";
import { FileUploader } from "@/components/FileUploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileSpreadsheet, Lightbulb, TrendingDown, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DatasetRow, DatasetAnalysis } from "@/services/mockAI";

const COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(174, 72%, 40%)",
  "hsl(210, 80%, 55%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)",
  "hsl(0, 84%, 60%)",
];

const tooltipStyle = {
  background: "rgba(0,0,0,0.85)",
  border: "1px solid hsl(160, 84%, 39%)",
  borderRadius: 8,
  fontSize: 12,
  color: "#fff",
  padding: 10,
};

export default function AIAdvisor() {
  const [datasetAnalysis, setDatasetAnalysis] = useState<DatasetAnalysis | null>(null);
  const [datasetRows, setDatasetRows] = useState<DatasetRow[]>([]);

  const handleDataParsed = (rows: DatasetRow[], analysis: DatasetAnalysis) => {
    setDatasetRows(rows);
    setDatasetAnalysis(analysis);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <Bot className="h-7 w-7 text-primary" />
          AI Energy Advisor
        </h1>
        <p className="page-subtitle">
          Chat with GreenWatts AI for energy insights, upload datasets for analysis, and get personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Chat */}
        <div className="lg:col-span-3 flex flex-col" style={{ minHeight: "70vh" }}>
          <ChatWindow datasetContext={datasetAnalysis} />
        </div>

        {/* Right: Upload & Stats */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-primary" />
                Dataset Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploader onDataParsed={handleDataParsed} />
            </CardContent>
          </Card>

          {/* Quick stats from uploaded data */}
          {datasetAnalysis && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Total Energy</span>
                  </div>
                  <p className="text-xl font-bold font-mono">{datasetAnalysis.totalEnergy.toFixed(1)} kWh</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="h-4 w-4 text-accent" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">CO₂</span>
                  </div>
                  <p className="text-xl font-bold font-mono">{datasetAnalysis.carbonFootprint.toFixed(1)} kg</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-chart-3" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Efficiency</span>
                  </div>
                  <p className="text-xl font-bold font-mono">{datasetAnalysis.efficiencyScore}%</p>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">⏰</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Peak Hour</span>
                  </div>
                  <p className="text-xl font-bold font-mono">{datasetAnalysis.peakHour}</p>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Insights Panel */}
      {datasetAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 space-y-6">
          {/* Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {datasetAnalysis.insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm">{insight}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Appliance Energy Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={datasetAnalysis.applianceBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="energy"
                      nameKey="name"
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(0)}%`}
                      labelLine={false}
                    >
                      {datasetAnalysis.applianceBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Appliance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={datasetAnalysis.applianceBreakdown} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kWh" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} width={90} />
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#fff" }} labelStyle={{ color: "#fff" }} />
                    <Bar dataKey="energy" radius={[0, 4, 4, 0]} name="Energy (kWh)">
                      {datasetAnalysis.applianceBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
