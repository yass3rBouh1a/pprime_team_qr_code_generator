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
    <div className="min-h-screen bg-[#fcfcfd]">
      {/* Header */}
      <header className="glass sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => (window.location.href = "/")}>
            <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Users size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">teamix</span>
          </div>
          
          <div className="hidden sm:flex flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="search"
              placeholder="Rechercher un membre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100/50 border-transparent border-zinc-200 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 rounded-xl text-sm transition-all outline-none"
            />
          </div>

          <Link
            href="/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            <UserPlus size={16} />
            <span className="hidden sm:inline">Ajouter un membre</span>
            <span className="sm:hidden">Ajouter</span>
          </Link>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden px-6 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="search"
              placeholder="Rechercher un membre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-100/50 border-transparent border-zinc-200 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-400 gap-3">
            <div className="w-10 h-10 border-3 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            <span className="text-sm font-medium">Chargement des membres…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center shadow-inner">
              <Users size={32} className="text-zinc-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-zinc-900">
                {search ? "Aucun résultat" : "Votre équipe est vide"}
              </h3>
              <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                {search 
                  ? `Nous n'avons trouvé aucun membre correspondant à "${search}".` 
                  : "Commencez par ajouter des membres pour générer leurs cartes de visite."}
              </p>
            </div>
            {!search && (
              <Link
                href="/add"
                className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all shadow-sm"
              >
                Ajouter votre premier membre
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4">
              {filtered.length} membre{filtered.length !== 1 ? "s" : ""}
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
