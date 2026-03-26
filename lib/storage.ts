import fs from "fs";
import path from "path";
import { TeamMember } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "members.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

export function getMembers(): TeamMember[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as TeamMember[];
}

export function getMember(id: string): TeamMember | null {
  return getMembers().find((m) => m.id === id) ?? null;
}

export function saveMembers(members: TeamMember[]): void {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), "utf-8");
}

export function addMember(member: TeamMember): void {
  const members = getMembers();
  members.push(member);
  saveMembers(members);
}

export function updateMember(id: string, data: Partial<TeamMember>): TeamMember | null {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  members[idx] = { ...members[idx], ...data };
  saveMembers(members);
  return members[idx];
}

export function deleteMember(id: string): boolean {
  const members = getMembers();
  const filtered = members.filter((m) => m.id !== id);
  if (filtered.length === members.length) return false;
  saveMembers(filtered);
  return true;
}
