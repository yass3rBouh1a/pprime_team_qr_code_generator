"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Users, Settings, Globe, X, Check, Search } from "lucide-react";
import { TeamMember } from "@/lib/types";
import MemberCard from "./MemberCard";
import { getSettings, saveSettings, AppSettings } from "@/lib/settings";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamList() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<AppSettings | null>(() => {
    if (typeof window !== "undefined") return getSettings();
    return null;
  });

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => (window.location.href = "/")}>
            <div className="w-10 h-10 bg-[#0F1D36] rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0F1D36] tracking-tight leading-none">Teamix</h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">P Prime</p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-300">
              <Search size={16} />
            </div>
            <input
              type="search"
              placeholder="Search members, titles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50/30 rounded-lg text-sm transition-all outline-none placeholder:text-slate-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 text-slate-400 hover:text-[#0F1D36] hover:bg-slate-50 rounded-lg transition-all"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <Link
              href="/add"
              className="flex items-center gap-2 px-4 py-2 bg-[#0F1D36] text-white rounded-lg text-sm font-semibold hover:bg-[#1a2d4f] shadow-sm active:scale-95 transition-all"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Add Member</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-300 gap-4">
            <div className="w-10 h-10 border-2 border-slate-100 border-t-[#0F1D36] rounded-full animate-spin" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
              <Users size={32} className="text-slate-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {search ? "No matches found" : "No profiles yet"}
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                {search 
                  ? `We couldn't find anyone matching "${search}".` 
                  : "Start by adding members to your directory."}
              </p>
            </div>
            {!search && (
              <Link
                href="/add"
                className="px-6 py-3 bg-[#0F1D36] text-white rounded-lg text-sm font-bold hover:bg-[#1a2d4f] transition-all shadow-md active:scale-95"
              >
                Add Your First Profile
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                Team Members
                <span className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium">
                  {filtered.length}
                </span>
              </h2>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <MemberCard
                      member={m}
                      onDeleted={(id) => setMembers((prev) => prev.filter((x) => x.id !== id))}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && settings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-zinc-100 p-8 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900 border border-zinc-50">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Settings</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">App Configuration</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-zinc-700 tracking-tight flex items-center gap-2">
                    <Globe size={14} className="text-indigo-500" />
                    Base URL (Domain)
                  </label>
                  <input
                    type="url"
                    value={settings.baseUrl}
                    onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                    placeholder="https://your-team.com"
                    className="w-full px-4 py-3 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-zinc-100 rounded-2xl text-sm transition-all outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                    This URL will be used to generate QR codes pointing to public profile pages.
                  </p>
                </div>

                <button
                  onClick={() => {
                    saveSettings(settings);
                    setShowSettingsModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 shadow-xl shadow-zinc-200 hover:shadow-zinc-300 transition-all active:scale-[0.98]"
                >
                  <Check size={18} />
                  Save settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
