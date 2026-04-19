"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { motion } from "framer-motion";
import { Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen bg-[#012434] flex items-center justify-center p-6">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
          {/* Glass shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />

          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#41A9D8] to-[#012434] flex items-center justify-center mb-6 shadow-xl ring-1 ring-white/20">
              <Lock className="text-white w-10 h-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Accès sécurisé</h1>
            <p className="text-white/40 text-sm mt-2 text-center">Connectez-vous pour gérer les membres</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-[0.15em] ml-1">Utilisateur</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#41A9D8] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[#41A9D8]/50 focus:border-[#41A9D8] transition-all"
                  placeholder="ybouhia1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-[0.15em] ml-1">Mot de passe</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-[#41A9D8] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-[#41A9D8]/50 focus:border-[#41A9D8] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state?.error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl text-center"
              >
                {state.error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-[#41A9D8] to-[#012434] rounded-2xl text-white font-bold text-sm tracking-[0.1em] uppercase shadow-lg shadow-[#012434]/50 active:scale-95 transition-all hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
             <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20">
              Powered by Smart Solutions · P Prime
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
