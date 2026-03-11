import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { Trophy, MapPin, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import {
  leaderboardUsers, rankUsers, filterByScope, getCurrentUser, getUserRankInScope,
  type ScopeLevel,
} from "@/data/leaderboard-data";
import { calculateMetrics, defaultAppliances } from "@/data/energy-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const scopeLabels: Record<ScopeLevel, string> = {
  neighborhood: "Neighborhood",
  city: "Town / City",
  district: "District",
  state: "State",
};

const tooltipStyle = {
  background: "hsl(160, 15%, 9%)",
  border: "1px solid hsl(160, 10%, 16%)",
  borderRadius: 8,
  fontSize: 12,
  color: "#fff",
};

export default function Leaderboard() {
  const [scope, setScope] = useState<ScopeLevel>("neighborhood");
  const currentUser = getCurrentUser();
  const metrics = calculateMetrics(defaultAppliances);

  const ranked = useMemo(() => {
    const filtered = filterByScope(leaderboardUsers, scope, currentUser);
    return rankUsers(filtered);
  }, [scope, currentUser]);

  const currentRank = ranked.findIndex((u) => u.isCurrentUser) + 1;
  const totalInScope = ranked.length;
  const isTopTenPercent = currentRank <= Math.ceil(totalInScope * 0.1);
  const nextRankProgress = currentRank > 1 ? Math.round(((totalInScope - currentRank) / (totalInScope - 1)) * 100) : 100;

  const top10 = ranked.slice(0, 10);
  const barColors = [
    "hsl(160, 84%, 39%)", "hsl(160, 84%, 45%)", "hsl(174, 72%, 40%)",
    "hsl(174, 72%, 50%)", "hsl(210, 80%, 55%)", "hsl(210, 70%, 60%)",
    "hsl(38, 92%, 50%)", "hsl(38, 80%, 55%)", "hsl(280, 65%, 55%)", "hsl(0, 84%, 60%)",
  ];

  // Sustainability score for current user
  const sustainabilityScore = currentUser.sustainabilityScore;

  return (
    <DashboardLayout>
      <div className="page-header flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Community Leaderboard</h1>
          <p className="page-subtitle">See how you stack up against your community</p>
        </div>
        <Select value={scope} onValueChange={(v) => setScope(v as ScopeLevel)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(scopeLabels) as ScopeLevel[]).map((s) => (
              <SelectItem key={s} value={s}>{scopeLabels[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gamification: your ranks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Neighborhood Rank" value={`#${getUserRankInScope("neighborhood")}`} icon={MapPin} />
        <MetricCard title="City Rank" value={`#${getUserRankInScope("city")}`} icon={Trophy} delay={0.1} />
        <MetricCard title="District Rank" value={`#${getUserRankInScope("district")}`} icon={TrendingUp} delay={0.2} />
        <MetricCard title="State Rank" value={`#${getUserRankInScope("state")}`} icon={Award} delay={0.3} />
      </div>

      {/* Sustainability Score + Progress to next rank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="chart-container flex flex-col items-center justify-center gap-4 py-8">
          <h2 className="section-title">Energy Sustainability Score</h2>
          <div className="relative flex items-center justify-center">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(160, 10%, 20%)" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke="hsl(160, 84%, 45%)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(sustainabilityScore / 100) * 440} 440`}
                transform="rotate(-90 80 80)"
              />
            </svg>
            <span className="absolute text-4xl font-bold font-mono text-foreground">{sustainabilityScore}</span>
          </div>
          <p className="text-sm text-muted-foreground">out of 100</p>
          {isTopTenPercent && (
            <Badge className="bg-primary text-primary-foreground">🌟 Top 10% in {scopeLabels[scope]}</Badge>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="chart-container flex flex-col gap-5 py-8 px-6">
          <h2 className="section-title">Progress to Next Rank</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current rank</span>
              <span className="font-semibold">#{currentRank} of {totalInScope}</span>
            </div>
            <Progress value={nextRankProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {currentRank === 1
                ? "You're #1! Keep it up."
                : `Reduce your carbon footprint by ~${((ranked[currentRank - 2]?.carbonFootprint ?? 0) - currentUser.carbonFootprint).toFixed(1)} kg CO₂ to move up.`
              }
            </p>
          </div>

          <div className="mt-auto space-y-2">
            <h3 className="text-sm font-medium">Your Rankings</h3>
            {(["neighborhood", "city", "district", "state"] as ScopeLevel[]).map((s) => (
              <div key={s} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{scopeLabels[s]}</span>
                <span className="font-mono font-semibold">#{getUserRankInScope(s)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top 10 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="chart-container">
          <h2 className="section-title mb-4">Top 10 — Energy Consumption</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10.map((u, i) => ({ name: u.name, energy: u.energyKwh, fill: barColors[i] }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kWh" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="energy" name="Energy (kWh)" radius={[4, 4, 0, 0]}>
                {top10.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="chart-container">
          <h2 className="section-title mb-4">Top 10 — Carbon Footprint</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10.map((u, i) => ({ name: u.name, carbon: u.carbonFootprint, fill: barColors[i] }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 20%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(160, 10%, 55%)" }} unit=" kg" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="carbon" name="CO₂ (kg)" radius={[4, 4, 0, 0]}>
                {top10.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Ranking Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="chart-container overflow-hidden">
        <h2 className="section-title mb-4">Full Ranking — {scopeLabels[scope]}</h2>
        <div className="overflow-auto max-h-[480px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Energy (kWh)</TableHead>
                <TableHead className="text-right">CO₂ (kg)</TableHead>
                <TableHead className="text-right">Efficiency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranked.map((user, i) => {
                const rank = i + 1;
                const medal = RANK_MEDALS[rank] ?? "";
                return (
                  <TableRow
                    key={user.id}
                    className={user.isCurrentUser ? "bg-primary/10 font-semibold" : ""}
                  >
                    <TableCell className="font-mono">
                      {medal ? <span className="text-lg mr-1">{medal}</span> : null}
                      {rank}
                    </TableCell>
                    <TableCell>
                      {user.name}
                      {user.isCurrentUser && (
                        <Badge variant="secondary" className="ml-2 text-[10px]">You</Badge>
                      )}
                      {rank <= Math.ceil(totalInScope * 0.1) && (
                        <Badge className="ml-1 bg-primary/20 text-primary text-[10px] border-0">Top 10%</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.neighborhood}</TableCell>
                    <TableCell className="text-right font-mono">{user.energyKwh}</TableCell>
                    <TableCell className="text-right font-mono">{user.carbonFootprint}</TableCell>
                    <TableCell className="text-right font-mono">{user.efficiencyScore}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
