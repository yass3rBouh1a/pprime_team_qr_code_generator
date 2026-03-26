"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, QrCode } from "lucide-react";
import { TeamMember } from "@/lib/types";

type FormData = Omit<TeamMember, "id" | "avatarColor" | "createdAt">;

interface Props {
  initial?: Partial<FormData>;
  memberId?: string;
}

export default function MemberForm({ initial, memberId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    jobTitle: initial?.jobTitle ?? "",
    company: initial?.company ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    website: initial?.website ?? "",
    linkedin: initial?.linkedin ?? "",
    address: initial?.address ?? "",
    notes: initial?.notes ?? "",
    image: initial?.image ?? "",
    qrLogo: initial?.qrLogo ?? "",
    showCornerLogos: initial?.showCornerLogos ?? false,
  });

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const handleFileChange = (field: "image" | "qrLogo") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      set(field, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const url = memberId ? `/api/members/${memberId}` : "/api/members";
      const method = memberId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Échec de l'enregistrement");
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-zinc-700 tracking-tight">Photo du membre</label>
          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 hover:border-zinc-300 transition-colors group cursor-pointer relative">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-zinc-100 shrink-0">
              {form.image ? (
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Users size={24} className="text-zinc-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">Cliquez pour choisir</p>
              <p className="text-[10px] text-zinc-400">PNG, JPG jusqu'à 2Mo</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange("image")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-zinc-700 tracking-tight">Logo QR Code</label>
          <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 hover:border-zinc-300 transition-colors group cursor-pointer relative">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-zinc-100 shrink-0">
              {form.qrLogo ? (
                <img src={form.qrLogo} alt="Logo Preview" className="w-full h-full object-contain p-2" />
              ) : (
                <QrCode size={24} className="text-zinc-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">Logo personnalisé</p>
              <p className="text-[10px] text-zinc-400">Optionnel (PNG ou SVG)</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange("qrLogo")}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id="showCornerLogos"
            checked={form.showCornerLogos}
            onChange={(e) => set("showCornerLogos", e.target.checked)}
            className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
          />
          <div className="w-5 h-5 bg-white border-2 border-indigo-200 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <label htmlFor="showCornerLogos" className="text-sm font-bold text-indigo-900 cursor-pointer select-none">
          Afficher le logo dans les coins du QR Code
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Prénom" field="firstName" form={form} set={set} required placeholder="Ahmed" />
        <Field label="Nom" field="lastName" form={form} set={set} required placeholder="El Amrani" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Poste" field="jobTitle" form={form} set={set} placeholder="Directeur Design" />
        <Field label="Entreprise" field="company" form={form} set={set} placeholder="P Prime Maroc" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Email" field="email" type="email" form={form} set={set} placeholder="ahmed@pprime.ma" />
        <Field label="Téléphone" field="phone" type="tel" form={form} set={set} placeholder="+212 6 00 00 00 00" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Site Web" field="website" type="url" form={form} set={set} placeholder="https://pprime.ma" />
        <Field label="LinkedIn" field="linkedin" form={form} set={set} placeholder="linkedin.com/in/ahmed" />
      </div>
      
      <Field label="Adresse" field="address" form={form} set={set} placeholder="Anfa, Casablanca, Maroc" />

      <div className="space-y-2">
        <label className="block text-sm font-bold text-zinc-700 tracking-tight">Notes</label>
        <textarea
          value={form.notes as string}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Informations complémentaires ou biographie courte..."
          rows={3}
          className="w-full px-4 py-3 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-zinc-100 rounded-2xl text-sm transition-all outline-none resize-none"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3.5 border border-zinc-200 text-zinc-600 rounded-2xl text-sm font-bold hover:bg-zinc-50 hover:text-zinc-900 transition-all active:scale-[0.98]"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3.5 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:bg-zinc-800 shadow-xl shadow-zinc-200 hover:shadow-zinc-300 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Chargement…" : memberId ? "Mettre à jour" : "Créer le profil"}
        </button>
      </div>
    </form>
  );
}

const Field = ({
  label,
  field,
  form,
  set,
  type = "text",
  placeholder = "",
  required = false,
}: {
  label: string;
  field: keyof FormData;
  form: FormData;
  set: (field: keyof FormData, value: string | boolean) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-bold text-zinc-700 tracking-tight">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={form[field] as string}
      onChange={(e) => set(field, e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 focus:ring-4 focus:ring-zinc-100 rounded-2xl text-sm transition-all outline-none"
    />
  </div>
);
