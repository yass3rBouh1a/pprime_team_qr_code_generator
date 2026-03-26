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
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    setSettings(getSettings());
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
      <header className="glass sticky top-0 z-30 border-b border-zinc-100/50 shadow-sm shadow-zinc-100/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => (window.location.href = "/")}>
            <div className="w-11 h-11 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Users size={22} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-zinc-900 tracking-tighter leading-none">TEAMIX</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1.5">Directory Management</p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
              <Search size={18} strokeWidth={2.5} />
            </div>
            <input
              type="search"
              placeholder="Rechercher un membre, un poste ou une entreprise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-5 py-3.5 bg-zinc-100/50 border border-transparent focus:bg-white focus:border-zinc-200 focus:ring-8 focus:ring-zinc-50 rounded-[1.25rem] text-sm transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
              title="Paramètres"
            >
              <Settings size={20} />
            </button>
            <Link
              href="/add"
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Ajouter un membre</span>
              <span className="sm:hidden">Ajouter</span>
            </Link>
          </div>
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

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-4">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            <span className="text-sm font-bold tracking-widest uppercase">Initialisation...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8 text-center bg-zinc-50/50 rounded-[3rem] border border-dashed border-zinc-200">
            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-zinc-100">
              <Users size={40} className="text-zinc-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                {search ? "Aucun profil trouvé" : "Votre répertoire est vide"}
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto font-medium">
                {search 
                  ? `Aucun membre ne correspond à votre recherche "${search}". Réessayez avec d'autres termes.` 
                  : "Commencez par ajouter des membres de votre équipe pour générer leurs cartes de visite intelligentes."}
              </p>
            </div>
            {!search && (
              <Link
                href="/add"
                className="px-8 py-4 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 hover:shadow-zinc-300 active:scale-95"
              >
                Ajouter un premier profil
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
                {filtered.length} profil{filtered.length !== 1 ? "s" : ""} enregistré{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
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
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight">Paramètres</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Configuration App</p>
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
                    URL de base (Domaine)
                  </label>
                  <input
                    type="url"
                    value={settings.baseUrl}
                    onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                    placeholder="https://votre-equipe.com"
                    className="w-full px-4 py-3 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-zinc-100 rounded-2xl text-sm transition-all outline-none"
                  />
                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                    Cette URL sera utilisée pour générer les QR codes pointant vers les pages de profil publiques.
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
                  Enregistrer les réglages
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
