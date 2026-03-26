"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { TeamMember } from "@/lib/types";
import MemberCard from "./MemberCard";

export default function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) => setMembers(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.jobTitle.toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">teamix</span>
          </div>
          <input
            type="search"
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hidden sm:block flex-1 max-w-xs px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Link
            href="/add"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <UserPlus size={15} />
            <span className="hidden sm:inline">Add Member</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
        <div className="sm:hidden px-4 pb-3">
          <input
            type="search"
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <Users size={28} className="text-indigo-400" />
            </div>
            <p className="text-gray-500 text-sm">
              {search ? "No members match your search." : "No team members yet."}
            </p>
            {!search && (
              <Link
                href="/add"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Add your first member
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {filtered.length} member{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m) => (
                <MemberCard
                  key={m.id}
                  member={m}
                  onDeleted={(id) => setMembers((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
