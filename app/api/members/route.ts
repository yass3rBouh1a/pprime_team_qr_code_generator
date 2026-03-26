import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getMembers, addMember } from "@/lib/storage";
import { TeamMember } from "@/lib/types";

const AVATAR_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#3b82f6", "#ef4444", "#14b8a6",
];

export async function GET() {
  const members = getMembers();
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const member: TeamMember = {
    id: uuidv4(),
    firstName: body.firstName,
    lastName: body.lastName,
    jobTitle: body.jobTitle || "",
    company: body.company || "",
    email: body.email || "",
    phone: body.phone || "",
    website: body.website || "",
    linkedin: body.linkedin || "",
    address: body.address || "",
    notes: body.notes || "",
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    createdAt: new Date().toISOString(),
  };
  addMember(member);
  return NextResponse.json(member, { status: 201 });
}
