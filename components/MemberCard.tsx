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
    if (!confirm(`Delete ${member.firstName} ${member.lastName}?`)) return;
    setDeleting(true);
    await fetch(`/api/members/${member.id}`, { method: "DELETE" });
    onDeleted(member.id);
  }

  const initials = `${member.firstName[0] ?? ""}${member.lastName[0] ?? ""}`.toUpperCase();

  return (
    <>
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        className="crm-card group flex flex-col h-full"
      >
        <div className="p-5 flex flex-col h-full">
          {/* Avatar + Basic Info Row */}
          <div className="flex items-start gap-4 mb-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm overflow-hidden flex-shrink-0 border-2 border-white ring-1 ring-slate-100"
              style={{ backgroundColor: member.avatarColor || "#1e293b" }}
            >
              {member.image ? (
                <img src={member.image} alt={member.firstName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-900 truncate tracking-tight group-hover:text-[#0F1D36] transition-colors">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-[11px] font-medium text-slate-500 truncate leading-relaxed">
                {member.jobTitle || 'Team Member'}
              </p>
              {member.company && (
                <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mt-0.5">
                  {member.company}
                </p>
              )}
            </div>
          </div>

          {/* Contact Details Snippets */}
          <div className="space-y-2 mb-6 flex-1">
            {member.email && (
              <div className="flex items-center gap-2.5 text-[11px] text-slate-500 hover:text-slate-900 transition-colors">
                <Mail size={13} className="text-slate-300" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2.5 text-[11px] text-slate-500 hover:text-slate-900 transition-colors">
                <Phone size={13} className="text-slate-300" />
                <span>{member.phone}</span>
              </div>
            )}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-1 opacity-10 sm:opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/edit/${member.id}`}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 size={15} />
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
            
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0F1D36] hover:bg-[#1a2d4f] text-white rounded-lg text-[10px] font-bold tracking-wider transition-all active:scale-95 shadow-sm"
            >
              <QrCode size={14} />
              QR CODE
            </button>
          </div>
        </div>
      </motion.div>

      {showQR && <QRModal member={member} onClose={() => setShowQR(false)} />}
    </>
  );
}
