"use client";

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
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex items-center justify-center">

      <div className="bg-white shadow-xl rounded-3xl p-12 w-[90%] max-w-md border border-purple-100">

        <h1 className="text-3xl text-center font-light tracking-wide mb-8 text-gray-800">
          Acceso Ministerio
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <input
            type="email"
            placeholder="Correo"
            required
            className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full border border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-300 to-purple-400 text-black font-medium hover:scale-105 transition"
          >
            {loading ? "Entrando..." : "Ingresar"}
          </button>

        </form>
      </div>
    </main>
  );
}