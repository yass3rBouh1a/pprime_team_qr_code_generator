import { getStore } from "@netlify/blobs";
import { TeamMember } from "./types";
import seedData from "@/data/members.json";

const STORE_NAME = "members";
const MEMBERS_KEY = "all-members";
const SEEDED_KEY = "seeded";

function getBlob() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function getMembers(): Promise<TeamMember[]> {
  const store = getBlob();
  const data = await store.get(MEMBERS_KEY, { type: "json" });
  if (data) return data as TeamMember[];

  // Seed from initial data on first access
  const seeded = await store.get(SEEDED_KEY, { type: "text" });
  if (!seeded && seedData.length > 0) {
    await store.setJSON(MEMBERS_KEY, seedData);
    await store.set(SEEDED_KEY, "true");
    return seedData as TeamMember[];
  }
  return [];
}

export async function getMember(id: string): Promise<TeamMember | null> {
  const members = await getMembers();
  return members.find((m) => m.id === id) ?? null;
}

export async function saveMembers(members: TeamMember[]): Promise<void> {
  const store = getBlob();
  await store.setJSON(MEMBERS_KEY, members);
}

export async function addMember(member: TeamMember): Promise<void> {
  const members = await getMembers();
  members.push(member);
  await saveMembers(members);
}

export async function updateMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | null> {
  const members = await getMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  members[idx] = { ...members[idx], ...data };
  await saveMembers(members);
  return members[idx];
}

export async function deleteMember(id: string): Promise<boolean> {
  const members = await getMembers();
  const filtered = members.filter((m) => m.id !== id);
  if (filtered.length === members.length) return false;
  await saveMembers(filtered);
  return true;
}
