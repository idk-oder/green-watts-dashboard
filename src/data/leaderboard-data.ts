import { EMISSION_FACTOR } from "./energy-data";

export interface LeaderboardUser {
  id: number;
  name: string;
  neighborhood: string;
  city: string;
  district: string;
  state: string;
  energyKwh: number;
  carbonFootprint: number;
  efficiencyScore: number;
  sustainabilityScore: number;
  isCurrentUser?: boolean;
}

const firstNames = [
  "Rahul", "Aisha", "Karthik", "Neha", "Arjun", "Priya", "Vikram", "Sneha",
  "Rohan", "Divya", "Amit", "Meera", "Sanjay", "Pooja", "Naveen", "Lakshmi",
  "Deepak", "Anjali", "Suresh", "Kavita", "Ravi", "Swathi", "Manoj", "Bhavna",
  "Gaurav", "Ritika", "Akash", "Tanvi", "Harsh", "Nisha", "Varun", "Isha",
  "Mohit", "Shreya", "Kunal", "Ananya", "Ashish", "Simran", "Pankaj", "Tanya",
  "Rajesh", "Komal", "Nitin", "Pallavi", "Abhishek", "Megha", "Sachin", "Renu",
  "Dhruv", "Jyoti", "Siddharth", "Aditi", "Yash", "Nikita", "Pranav", "Sakshi",
  "Tushar", "Mansi", "Aman", "Kriti", "Vivek", "Rashmi", "Ajay", "Shweta",
  "Mayank", "Aparna", "Kapil", "Bhavya", "Aditya", "Trisha", "Dev", "Madhuri",
  "Shubham", "Sonam", "Jay", "Disha", "Vishal", "Hema", "Ramesh", "Usha",
  "Lokesh", "Geeta", "Raghav", "Sonal", "Tarun", "Mona", "Ankit", "Payal",
  "Sameer", "Rekha", "Girish", "Lata", "Manish", "Aarti", "Kiran", "Sunita",
  "Prakash", "Veena", "Dinesh", "Swati"
];

const neighborhoods = ["Green Park", "Sunrise Colony", "Palm Heights", "Lake View", "Cedar Grove", "Maple Ridge", "River Side", "Oak Hills"];
const cities = ["Metro City", "Greenville", "Eco Town", "Solar Springs"];
const districts = ["North District", "South District", "East District", "West District"];
const states = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateUsers(): LeaderboardUser[] {
  const rand = seededRandom(42);
  const users: LeaderboardUser[] = [];

  for (let i = 0; i < 100; i++) {
    const energyKwh = Math.round((4 + rand() * 16) * 10) / 10;
    const carbonFootprint = Math.round(energyKwh * EMISSION_FACTOR * 100) / 100;
    const efficiencyScore = Math.round(60 + rand() * 38);
    const sustainabilityScore = Math.round(
      (100 - energyKwh * 2.5) * 0.4 +
      efficiencyScore * 0.4 +
      (100 - carbonFootprint * 3) * 0.2
    );

    users.push({
      id: i + 1,
      name: firstNames[i % firstNames.length],
      neighborhood: neighborhoods[Math.floor(rand() * neighborhoods.length)],
      city: cities[Math.floor(rand() * cities.length)],
      district: districts[Math.floor(rand() * districts.length)],
      state: states[Math.floor(rand() * states.length)],
      energyKwh,
      carbonFootprint,
      efficiencyScore,
      sustainabilityScore: Math.max(10, Math.min(99, sustainabilityScore)),
      isCurrentUser: i === 4, // Arjun is "you"
    });
  }

  return users;
}

export const leaderboardUsers = generateUsers();

export type ScopeLevel = "neighborhood" | "city" | "district" | "state";

export function filterByScope(users: LeaderboardUser[], scope: ScopeLevel, currentUser: LeaderboardUser) {
  switch (scope) {
    case "neighborhood":
      return users.filter((u) => u.neighborhood === currentUser.neighborhood);
    case "city":
      return users.filter((u) => u.city === currentUser.city);
    case "district":
      return users.filter((u) => u.district === currentUser.district);
    case "state":
      return users.filter((u) => u.state === currentUser.state);
  }
}

export function rankUsers(users: LeaderboardUser[]) {
  return [...users].sort((a, b) => {
    if (a.carbonFootprint !== b.carbonFootprint) return a.carbonFootprint - b.carbonFootprint;
    if (b.efficiencyScore !== a.efficiencyScore) return b.efficiencyScore - a.efficiencyScore;
    return a.energyKwh - b.energyKwh;
  });
}

export function getCurrentUser() {
  return leaderboardUsers.find((u) => u.isCurrentUser)!;
}

export function getUserRankInScope(scope: ScopeLevel): number {
  const current = getCurrentUser();
  const filtered = filterByScope(leaderboardUsers, scope, current);
  const ranked = rankUsers(filtered);
  return ranked.findIndex((u) => u.isCurrentUser) + 1;
}
