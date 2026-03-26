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
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 overflow-hidden flex flex-col"
    >
        {/* Animated Background Highlight */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-zinc-50 rounded-full blur-3xl group-hover:bg-indigo-50/50 transition-colors duration-700" />
        
        <div className="relative flex flex-col items-center text-center flex-1">
          {/* Avatar Area */}
          <div className="relative mb-5">
            <div 
              className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold shadow-2xl relative z-10 overflow-hidden ring-4 ring-white"
              style={{ backgroundColor: member.avatarColor }}
            >
              {member.image ? (
                <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center z-20 border border-zinc-50">
              <Building2 size={14} className="text-zinc-400" />
            </div>
          </div>

          <div className="space-y-1 mb-6">
            <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight group-hover:text-indigo-950 transition-colors">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-sm font-semibold text-indigo-600/90 tracking-wide uppercase">
              {member.jobTitle}
            </p>
          </div>

          <div className="w-full space-y-2.5 mb-8">
            {member.email && (
              <div className="flex items-center justify-center gap-2.5 text-zinc-500 text-sm bg-zinc-50/50 py-2 px-4 rounded-xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all">
                <Mail size={14} className="text-zinc-400" />
                <span className="truncate font-medium">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center justify-center gap-2.5 text-zinc-500 text-sm bg-zinc-50/50 py-2 px-4 rounded-xl border border-transparent hover:border-zinc-100 hover:bg-white transition-all">
                <Phone size={14} className="text-zinc-400" />
                <span className="font-medium">{member.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setShowQR(true)}
            className="flex-1 flex items-center justify-center gap-2.5 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 shadow-lg shadow-zinc-200 hover:shadow-zinc-300 active:scale-[0.98] transition-all"
          >
            <QrCode size={18} />
            QR Code
          </button>
          
          <div className="flex items-center bg-zinc-100 p-1 rounded-2xl">
            <Link
              href={`/edit/${member.id}`}
              className="p-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
              title="Modifier"
            >
              <Edit2 size={18} />
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm disabled:opacity-50"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {showQR && <QRModal member={member} onClose={() => setShowQR(false)} />}
    </>
  );
}
