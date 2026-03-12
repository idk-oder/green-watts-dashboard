// Mock AI service simulating Claude-style responses for energy conservation
// Replace with real API integration when backend is set up

import { Appliance, EMISSION_FACTOR, COST_PER_KWH } from "@/data/energy-data";

const ENERGY_RESPONSES: Record<string, string> = {
  "reduce ac": "You can reduce AC energy usage by:\n\n1. **Increase temperature to 24–26°C** — each degree saves ~6% energy\n2. **Use inverter ACs** — they adjust compressor speed, saving 30-50%\n3. **Seal air leaks** around doors/windows to prevent cool air escape\n4. **Use ceiling fans** alongside AC to distribute cool air evenly\n5. **Schedule AC to turn off** 30 minutes before you leave\n\nEstimated savings: **1.5–3.0 kWh/day** depending on current usage.",
  "biggest waste": "Based on your current data, here are the top energy consumers:\n\n1. **Air Conditioner** — 12.0 kWh/day (61% of total)\n2. **Refrigerator** — 3.6 kWh/day (18%)\n3. **Lighting** — 2.0 kWh/day (10%)\n\nThe AC is your biggest opportunity for savings. Reducing usage by just 2 hours could save **3.0 kWh/day** (~$0.36/day, ~$131/year).\n\nI also notice your lighting consumes 2.0 kWh — switching to LED bulbs could cut that by 75%.",
  "ev charger": "For optimal EV charging, I recommend:\n\n**Best time: 10 PM – 6 AM** (off-peak hours)\n\nReasons:\n- Electricity rates are typically 30-50% lower\n- Grid demand is lowest, reducing your carbon footprint\n- Your other appliances are mostly off, preventing circuit overloads\n\nWith a 7.2 kW charger running 4 hours, you'd use **28.8 kWh**.\n- Peak cost: ~$3.74\n- Off-peak cost: ~$1.87\n- **Annual savings: ~$682**",
  "peak usage": "Your peak consumption hours are **1 PM – 3 PM**.\n\nTo reduce peak usage:\n1. **Pre-cool your home** before 1 PM, then raise AC temp\n2. **Shift washing/drying** to after 8 PM\n3. **Use timers** on water heaters to avoid peak overlap\n4. **Unplug idle devices** — standby power adds 5-10%\n\nReducing peak demand can lower your bill by **15-20%** if your utility uses time-of-use pricing.",
  "bill": "Based on your current consumption pattern:\n\n📊 **Monthly Bill Estimate**\n- Daily average: ~19.5 kWh\n- Monthly total: ~585 kWh\n- At $0.12/kWh: **~$70.20/month**\n\n📈 **Compared to last month**: Usage is up 5.2%, likely due to increased AC usage.\n\n💡 **To reduce by $15/month**: Cut AC usage by 2 hours/day and switch to LED lighting.",
  "solar": "Adding solar panels could significantly reduce your energy costs:\n\n☀️ **Estimated Solar Potential**\n- Average home: 5-8 kW system\n- Daily generation: 20-32 kWh\n- Your daily usage: ~19.5 kWh\n\n**ROI Analysis:**\n- System cost: $12,000-$18,000\n- Monthly savings: $50-$70\n- Payback period: 7-10 years\n- 25-year net savings: **$8,000-$15,000**\n\nWith net metering, you could even earn credits for excess generation!",
  "carbon": "Your current carbon footprint analysis:\n\n🌍 **Daily CO₂ Emissions**: ~16.0 kg\n🌍 **Monthly CO₂**: ~480 kg\n🌍 **Annual CO₂**: ~5,840 kg\n\nThe average household emits ~7,500 kg CO₂/year, so you're **22% below average** — great job!\n\nTo reduce further:\n1. Switch to renewable energy provider (-40%)\n2. Optimize AC usage (-15%)\n3. Use energy-efficient appliances (-10%)\n\nGoal: Under 4,000 kg/year would put you in the **top 10%** of eco-friendly households.",
};

function findBestResponse(query: string): string {
  const lower = query.toLowerCase();
  
  for (const [key, response] of Object.entries(ENERGY_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  
  if (lower.includes("ac") || lower.includes("air condition") || lower.includes("cooling")) return ENERGY_RESPONSES["reduce ac"];
  if (lower.includes("waste") || lower.includes("highest") || lower.includes("most energy")) return ENERGY_RESPONSES["biggest waste"];
  if (lower.includes("ev") || lower.includes("charger") || lower.includes("car")) return ENERGY_RESPONSES["ev charger"];
  if (lower.includes("peak") || lower.includes("high usage")) return ENERGY_RESPONSES["peak usage"];
  if (lower.includes("bill") || lower.includes("cost") || lower.includes("expense") || lower.includes("predict")) return ENERGY_RESPONSES["bill"];
  if (lower.includes("solar") || lower.includes("panel") || lower.includes("renewable")) return ENERGY_RESPONSES["solar"];
  if (lower.includes("carbon") || lower.includes("co2") || lower.includes("emission") || lower.includes("footprint")) return ENERGY_RESPONSES["carbon"];
  if (lower.includes("led") || lower.includes("light") || lower.includes("bulb")) {
    return "Switching to LED lighting is one of the easiest energy wins:\n\n💡 **LED vs Incandescent:**\n- LED: 10W for 800 lumens\n- Incandescent: 60W for 800 lumens\n- Savings: **83% reduction**\n\nWith 10 hours/day lighting usage at 200W:\n- Current cost: $0.24/day\n- With LEDs: $0.04/day\n- **Annual savings: $73**\n\nLEDs also last 25,000+ hours vs 1,000 hours for incandescent bulbs.";
  }
  if (lower.includes("refrigerator") || lower.includes("fridge")) {
    return "Your refrigerator runs 24/7 at 150W, using **3.6 kWh/day**.\n\nOptimization tips:\n1. Set temperature to **3-5°C** (fridge) and **-18°C** (freezer)\n2. **Clean condenser coils** every 6 months\n3. Keep it **3/4 full** for optimal efficiency\n4. Check door seals for air leaks\n5. Place away from heat sources (oven, direct sunlight)\n\nAn Energy Star rated fridge uses 15-20% less energy. If yours is >10 years old, consider upgrading — savings pay for themselves in 4-5 years.";
  }
  if (lower.includes("tip") || lower.includes("save") || lower.includes("reduce") || lower.includes("recommend")) {
    return "Here are my top energy-saving recommendations for your household:\n\n🏆 **High Impact:**\n1. Reduce AC by 2°C → Save 2.4 kWh/day\n2. Shift heavy loads to off-peak → Save 1.2 kWh/day\n3. Use natural ventilation when possible → Save 3.0 kWh/day\n\n⚡ **Quick Wins:**\n4. Unplug idle chargers and appliances\n5. Switch remaining bulbs to LED\n6. Use power strips for easy shut-off\n\n📊 **Total potential savings: 6.6 kWh/day (~$0.79/day, $289/year)**";
  }
  
  return "Great question! Based on your energy profile, here are some insights:\n\n📊 **Your Current Stats:**\n- Daily usage: ~19.5 kWh\n- Carbon footprint: ~16.0 kg CO₂\n- Efficiency score: 68%\n\nI can help you with:\n- 🔍 Analyzing specific appliance usage\n- 📉 Reducing your energy bills\n- 🌱 Lowering your carbon footprint\n- ⏰ Optimizing usage schedules\n- ☀️ Solar panel recommendations\n\nTry asking me something specific like \"How can I reduce my AC usage?\" or \"What's my biggest energy waste?\"";
}

export interface DatasetRow {
  time: string;
  appliance: string;
  energy_kwh: number;
}

export interface DatasetAnalysis {
  totalEnergy: number;
  carbonFootprint: number;
  cost: number;
  efficiencyScore: number;
  applianceBreakdown: { name: string; energy: number; percentage: number }[];
  peakHour: string;
  insights: string[];
}

export function analyzeDataset(rows: DatasetRow[]): DatasetAnalysis {
  const totalEnergy = rows.reduce((sum, r) => sum + r.energy_kwh, 0);
  const carbonFootprint = totalEnergy * EMISSION_FACTOR;
  const cost = totalEnergy * COST_PER_KWH;

  const byAppliance: Record<string, number> = {};
  rows.forEach(r => {
    const name = r.appliance.trim();
    byAppliance[name] = (byAppliance[name] || 0) + r.energy_kwh;
  });

  const applianceBreakdown = Object.entries(byAppliance)
    .map(([name, energy]) => ({ name, energy, percentage: (energy / totalEnergy) * 100 }))
    .sort((a, b) => b.energy - a.energy);

  const byHour: Record<string, number> = {};
  rows.forEach(r => {
    byHour[r.time] = (byHour[r.time] || 0) + r.energy_kwh;
  });
  const peakHour = Object.entries(byHour).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const maxPossible = totalEnergy * 2;
  const efficiencyScore = Math.min(100, Math.round((1 - totalEnergy / maxPossible) * 100));

  const topAppliance = applianceBreakdown[0];
  const insights: string[] = [];
  if (topAppliance) {
    insights.push(`${topAppliance.name} accounts for ${topAppliance.percentage.toFixed(0)}% of total energy usage.`);
  }
  insights.push(`Peak consumption occurs at ${peakHour}.`);
  if (topAppliance && topAppliance.percentage > 30) {
    insights.push(`Reducing ${topAppliance.name} usage by 1 hour could save approximately ${(topAppliance.energy * 0.15).toFixed(1)} kWh per day.`);
  }
  insights.push(`Total carbon footprint: ${carbonFootprint.toFixed(1)} kg CO₂. Target below ${(carbonFootprint * 0.8).toFixed(1)} kg for a 20% reduction.`);
  if (applianceBreakdown.length > 3) {
    insights.push(`${applianceBreakdown.length} appliances tracked. Consider consolidating usage during off-peak hours.`);
  }

  return { totalEnergy, carbonFootprint, cost, efficiencyScore, applianceBreakdown, peakHour, insights };
}

export function generateDatasetAIResponse(analysis: DatasetAnalysis): string {
  const top = analysis.applianceBreakdown[0];
  return `## 📊 Dataset Analysis Complete

**Summary:**
- Total energy: **${analysis.totalEnergy.toFixed(1)} kWh**
- Carbon footprint: **${analysis.carbonFootprint.toFixed(1)} kg CO₂**
- Estimated cost: **$${analysis.cost.toFixed(2)}**
- Efficiency score: **${analysis.efficiencyScore}/100**

**Key Findings:**
${analysis.insights.map(i => `- ${i}`).join("\n")}

**Recommendations:**
1. ${top ? `Focus on reducing **${top.name}** usage — it's your biggest consumer at ${top.percentage.toFixed(0)}%` : "Monitor all appliances equally"}
2. Shift high-consumption activities away from peak hour (**${analysis.peakHour}**)
3. Set energy targets: aim for **${(analysis.totalEnergy * 0.85).toFixed(1)} kWh** (15% reduction)
4. Consider smart plugs for automated scheduling of major appliances`;
}

export async function getAIResponse(message: string, datasetContext?: DatasetAnalysis): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  if (datasetContext) {
    const lower = message.toLowerCase();
    if (lower.includes("analyze") || lower.includes("dataset") || lower.includes("data") || lower.includes("upload")) {
      return generateDatasetAIResponse(datasetContext);
    }
  }
  
  return findBestResponse(message);
}

export const QUICK_PROMPTS = [
  "What's my biggest energy waste?",
  "How can I reduce AC consumption?",
  "When should I run my EV charger?",
  "Predict my monthly bill",
  "How to reduce my carbon footprint?",
  "Best energy saving tips",
];

export const SAMPLE_CSV = `Time,Appliance,Energy_kWh
08:00,AC,2.5
08:00,Refrigerator,0.15
09:00,AC,2.3
09:00,Refrigerator,0.15
09:00,Laptop,0.3
10:00,AC,2.1
10:00,Laptop,0.3
10:00,Lighting,0.2
11:00,Lighting,0.5
11:00,Refrigerator,0.15
12:00,AC,2.8
12:00,Washing Machine,0.5
13:00,AC,3.0
13:00,Refrigerator,0.15
14:00,AC,2.9
14:00,Television,0.12
15:00,AC,2.5
15:00,Laptop,0.3
16:00,Lighting,0.4
16:00,Refrigerator,0.15
17:00,AC,2.0
17:00,Television,0.12
18:00,Lighting,0.5
18:00,Washing Machine,0.5
19:00,AC,1.8
19:00,Television,0.12
20:00,Lighting,0.5
20:00,Refrigerator,0.15
21:00,Television,0.12
21:00,Lighting,0.3
22:00,Refrigerator,0.15
22:00,AC,1.2`;
