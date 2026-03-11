export const EMISSION_FACTOR = 0.82; // kg CO₂ per kWh
export const COST_PER_KWH = 0.12; // USD per kWh

export interface Appliance {
  id: string;
  name: string;
  icon: string;
  powerWatts: number;
  avgHoursPerDay: number;
  energyKwh: number;
  color: string;
}

export const defaultAppliances: Appliance[] = [
  { id: "ac", name: "Air Conditioner", icon: "Snowflake", powerWatts: 1500, avgHoursPerDay: 8, energyKwh: 12, color: "hsl(210, 80%, 55%)" },
  { id: "fridge", name: "Refrigerator", icon: "Refrigerator", powerWatts: 150, avgHoursPerDay: 24, energyKwh: 3.6, color: "hsl(174, 72%, 40%)" },
  { id: "washer", name: "Washing Machine", icon: "WashingMachine", powerWatts: 500, avgHoursPerDay: 1.5, energyKwh: 0.75, color: "hsl(280, 65%, 55%)" },
  { id: "lights", name: "Lighting", icon: "Lightbulb", powerWatts: 200, avgHoursPerDay: 10, energyKwh: 2, color: "hsl(38, 92%, 50%)" },
  { id: "laptop", name: "Laptop", icon: "Laptop", powerWatts: 65, avgHoursPerDay: 8, energyKwh: 0.52, color: "hsl(160, 84%, 39%)" },
  { id: "tv", name: "Television", icon: "Tv", powerWatts: 120, avgHoursPerDay: 5, energyKwh: 0.6, color: "hsl(0, 84%, 60%)" },
];

export const hourlyData = [
  { time: "00:00", energy: 1.2 }, { time: "01:00", energy: 0.9 },
  { time: "02:00", energy: 0.8 }, { time: "03:00", energy: 0.7 },
  { time: "04:00", energy: 0.6 }, { time: "05:00", energy: 0.8 },
  { time: "06:00", energy: 1.5 }, { time: "07:00", energy: 2.8 },
  { time: "08:00", energy: 3.5 }, { time: "09:00", energy: 3.2 },
  { time: "10:00", energy: 2.8 }, { time: "11:00", energy: 2.5 },
  { time: "12:00", energy: 3.8 }, { time: "13:00", energy: 4.2 },
  { time: "14:00", energy: 4.5 }, { time: "15:00", energy: 4.1 },
  { time: "16:00", energy: 3.6 }, { time: "17:00", energy: 3.2 },
  { time: "18:00", energy: 3.8 }, { time: "19:00", energy: 4.0 },
  { time: "20:00", energy: 3.5 }, { time: "21:00", energy: 2.8 },
  { time: "22:00", energy: 2.0 }, { time: "23:00", energy: 1.5 },
];

export const weeklyData = [
  { day: "Mon", energy: 19.5, carbon: 15.99 },
  { day: "Tue", energy: 21.2, carbon: 17.38 },
  { day: "Wed", energy: 18.8, carbon: 15.42 },
  { day: "Thu", energy: 22.5, carbon: 18.45 },
  { day: "Fri", energy: 20.1, carbon: 16.48 },
  { day: "Sat", energy: 24.3, carbon: 19.93 },
  { day: "Sun", energy: 23.1, carbon: 18.94 },
];

export const predictionData = hourlyData.map((d, i) => ({
  time: d.time,
  actual: d.energy,
  predicted: Math.max(0.5, d.energy + (Math.sin(i * 0.5) * 0.8) + (Math.random() * 0.4 - 0.2)),
}));

export const recommendations = [
  { id: 1, title: "Reduce AC temperature", description: "Set AC from 22°C to 24°C to save up to 20% cooling energy.", impact: "High", savings: "2.4 kWh/day", category: "cooling" },
  { id: 2, title: "Turn off idle appliances", description: "Standby power accounts for 5-10% of household energy. Unplug when not in use.", impact: "Medium", savings: "0.8 kWh/day", category: "general" },
  { id: 3, title: "Shift to off-peak hours", description: "Run washing machine and dishwasher during off-peak hours (10 PM - 6 AM).", impact: "Medium", savings: "1.2 kWh/day", category: "scheduling" },
  { id: 4, title: "Switch to LED lighting", description: "Replace incandescent bulbs with LEDs to reduce lighting energy by 75%.", impact: "High", savings: "1.5 kWh/day", category: "lighting" },
  { id: 5, title: "Optimize refrigerator settings", description: "Set fridge to 3-5°C and freezer to -18°C. Keep coils clean.", impact: "Low", savings: "0.4 kWh/day", category: "cooling" },
  { id: 6, title: "Use natural ventilation", description: "Open windows during cool hours instead of running AC.", impact: "High", savings: "3.0 kWh/day", category: "cooling" },
];

export const alerts = [
  { id: 1, type: "warning" as const, message: "High AC usage detected today — 40% above average.", time: "2 hours ago" },
  { id: 2, type: "warning" as const, message: "Energy usage increased by 18% compared to yesterday.", time: "5 hours ago" },
  { id: 3, type: "info" as const, message: "Peak consumption hours: 1 PM - 3 PM. Consider shifting loads.", time: "Today" },
  { id: 4, type: "success" as const, message: "Lighting energy reduced by 12% this week — great job!", time: "1 day ago" },
];

export function calculateMetrics(appliances: Appliance[]) {
  const totalEnergy = appliances.reduce((sum, a) => sum + a.energyKwh, 0);
  const carbonFootprint = totalEnergy * EMISSION_FACTOR;
  const cost = totalEnergy * COST_PER_KWH;
  const maxPossibleEnergy = appliances.reduce((sum, a) => sum + (a.powerWatts * 24) / 1000, 0);
  const efficiencyScore = Math.round((1 - totalEnergy / maxPossibleEnergy) * 100);
  return { totalEnergy, carbonFootprint, cost, efficiencyScore };
}
