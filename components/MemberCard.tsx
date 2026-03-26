"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { QrCode, Edit2, Trash2, Mail, Phone, Building2 } from "lucide-react";
import { TeamMember } from "@/lib/types";
import QRModal from "./QRModal";

interface Props {
  member: TeamMember;
  onDeleted: (id: string) => void;
}

export default function MemberCard({ member, onDeleted }: Props) {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer ${member.firstName} ${member.lastName} ?`)) return;
    setDeleting(true);
    await fetch(`/api/members/${member.id}`, { method: "DELETE" });
    onDeleted(member.id);
  }

  const initials = `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();

  return (
    <>
      <motion.div 
        whileHover={{ y: -6, scale: 1.01 }}
        className="group relative bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden flex flex-col h-full"
      >
        {/* Animated Background Highlight */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-zinc-50 rounded-full blur-3xl group-hover:bg-indigo-50/50 transition-colors duration-1000" />
        
        <div className="relative p-10 flex flex-col items-center text-center flex-1 z-10">
          {/* Avatar Area */}
          <div className="relative mb-8">
            <div 
              className="w-32 h-32 rounded-[2.75rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl relative z-10 overflow-hidden ring-[12px] ring-white"
              style={{ backgroundColor: member.avatarColor || "#18181b" }}
            >
              {member.image ? (
                <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-11 h-11 bg-white rounded-2xl shadow-xl flex items-center justify-center z-20 border border-zinc-50 translate-x-1 translate-y-1">
              <Building2 size={18} className="text-zinc-400" />
            </div>
          </div>

          <div className="space-y-1.5 mb-8">
            <h3 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-xs font-bold text-indigo-500 tracking-[0.25em] uppercase">
              {member.jobTitle}
            </p>
          </div>

          <div className="w-full space-y-3.5 mb-2">
            {member.email && (
              <div className="flex items-center justify-center gap-3.5 text-zinc-500 text-sm bg-zinc-50/50 py-3.5 px-6 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all">
                <Mail size={16} className="text-zinc-400" />
                <span className="truncate font-bold tracking-tight text-zinc-600">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center justify-center gap-3.5 text-zinc-500 text-sm bg-zinc-50/50 py-3.5 px-6 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all">
                <Phone size={16} className="text-zinc-400" />
                <span className="font-bold tracking-tight text-zinc-600">{member.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-20 p-8 pt-0 mt-auto">
          <div className="flex items-center gap-3 bg-zinc-50/80 backdrop-blur-sm p-2.5 rounded-[2rem] border border-zinc-100/50 group-hover:bg-white group-hover:border-zinc-200 transition-all duration-500">
            <button
              onClick={() => setShowQR(true)}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-zinc-900 text-white rounded-2xl text-[11px] font-black tracking-[0.15em] uppercase hover:bg-zinc-800 shadow-xl shadow-zinc-200 hover:shadow-zinc-300 active:scale-[0.98] transition-all"
            >
              <QrCode size={18} />
              Générer QR
            </button>
            <div className="flex items-center pr-1">
              <Link
                href={`/edit/${member.id}`}
                className="p-3 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all"
                title="Modifier"
              >
                <Edit2 size={18} />
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-50"
                title="Supprimer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {showQR && <QRModal member={member} onClose={() => setShowQR(false)} />}
    </>
  );
}
