"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (!error) {
      router.push("/admin");
    } else {
      alert("Datos incorrectos");
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#8799B6] overflow-hidden px-6">

      {/* Glow fondo */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/20 blur-3xl rounded-full pointer-events-none"></div>

      {/* Card Login */}
      <div className="glass relative p-10 w-full max-w-md text-center rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

        {/* Logo */}
        <div className="relative w-48 h-32 mx-auto mb-6">
          <Image
            src="/1-14.png"
            alt="Cantos del Cielo"
            fill
            className="object-contain"
          />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-light tracking-wide text-white mb-6">
          Login
        </h1>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Correo"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 active:scale-95 transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#5a6d8c] border-t-transparent rounded-full animate-spin"></span>
                Entrando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>

        </form>

        {/* Mensaje bonito abajo */}
       

      </div>
    </main>
  );
}