import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MemberForm from "@/components/MemberForm";

export default function AddPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 mb-10 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à l'équipe
        </Link>
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 sm:p-12">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">Ajouter un membre</h1>
            <p className="text-zinc-500 font-medium">
              Remplissez les coordonnées. Un code QR sera généré automatiquement.
            </p>
          </div>
          <MemberForm />
        </div>
      </div>
    </div>
  );
}
