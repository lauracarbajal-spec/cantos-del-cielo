"use client";

import Image from "next/image";
import { Facebook, Instagram, Phone, Youtube } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {Mail, MessageCircle } from "lucide-react";
type Song = {
  id: number;
  title: string;
  category: string;
  pdf_url: string;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [open, setOpen] = useState(false);

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
      ),
    []
  );

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (data) {
      const firstByCategory: Record<string, Song> = {};
      data.forEach((song) => {
        if (!firstByCategory[song.category]) {
          firstByCategory[song.category] = song;
        }
      });
      setSongs(Object.values(firstByCategory));
    }
  }

  return (
    <main className="bg-gradient-to-b from-[#8799B6] via-[#92a4c2] to-[#f5f7fb] text-white">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-40 sm:h-56 md:h-[260px]"
        >
          <Image src="/1-14.png" alt="Coro" fill className="object-contain" />
        </motion.div>
        <p className="text-white/70 mt-4 max-w-xl text-lg">
        CORO CATÓLICO
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold mt-6">
          Cantos del Cielo
        </h1>

        <p className="text-white/70 mt-4 max-w-xl text-lg">
        Voces en armonía
        </p>

        <button
          onClick={() =>
            document
              .getElementById("cantos")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-10 px-6 py-3 rounded-full bg-white/90 text-[#5a6d8c] text-sm font-medium hover:bg-white transition shadow-lg"
        >
          Explorar cantos
        </button>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-80 rounded-3xl overflow-hidden">
          <Image src="/coro.jpg" alt="Coro" fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">
            Quiénes Somos
          </h2>

          <p className="text-white/70">
            Somos Daniela y Nataly, y creamos este espacio para compartir música
            católica que acerque a las personas a Dios.
          </p>

          <p className="text-white/70">
          Aquí encontrarás cantos con letra y acordes, pensados para quienes también sirven al Señor a través de la música en sus parroquias, grupos o momentos de oración.
Cada canto nace con cariño y con el deseo de elevar el corazón al cielo.
          </p>
          <p className="text-white/70">
 Cada canto nace con cariño y con el deseo de elevar el corazón al cielo.
          </p>
        </div>
      </section>

      {/* CANTOS */}
      <section id="cantos" className="py-28 px-6">
        <h2 className="text-4xl text-center font-semibold mb-16 text-white">
          Cantos Disponibles
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {songs.map((song) => (
            <div
              key={song.id}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <h3 className="text-lg text-white/90 font-medium">
                {song.category}
              </h3>

              <p className="text-white/60 text-sm mt-2">
                {song.title}
              </p>

              <button
                onClick={() => {
                  setSelectedSong(song);
                  setOpen(true);
                }}
                className="mt-6 px-5 py-2.5 rounded-full bg-white/90 text-[#5a6d8c] text-sm font-medium hover:bg-white transition"
              >
                Descargar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* DONATIVO */}
      <section className="py-28 text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">
          Apoya este Ministerio
        </h2>

        <p className="text-white/70 max-w-xl mx-auto mb-8">
        Cada donativo, grande o pequeño, ayuda a que este proyecto continúe.
        </p>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
        Los donativos a
Cantos del Cielo
nos permiten seguir compartiendo música que acerque a más personas a Dios.
        </p>
        
        <p className="text-white/70 max-w-xl mx-auto mb-8">
        Con tu apoyo podremos:
        </p>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
        • Colaborar con retiros y encuentros de jóvenes
        </p>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
        • Apoyar eventos parroquiales y momentos de oración
        </p>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
        • Crear y grabar nuevos cantos
        </p>
        <p className="text-white/70 max-w-xl mx-auto mb-8">
        • Llevar esta música a más comunidades
        </p>

        <button
          onClick={async () => {
            const res = await fetch("/api/create-checkout-session", {
              method: "POST",
            });
            const data = await res.json();
            window.location.href = data.url;
          }}
          className="px-6 py-3 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 transition shadow-lg"
        >
          Hacer Donativo
        </button>
      </section>

      {/* MODAL PREMIUM */}
      {open && selectedSong && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-2xl"
          >

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-light text-[#5a6d8c] mb-4">
              {selectedSong.title}
            </h3>

            <p className="text-gray-600 text-sm mb-8">
              Puedes descargar este canto gratuitamente.
              Si deseas apoyar este ministerio, puedes hacer un donativo.
            </p>

            <div className="flex flex-col gap-4">

              <a
                href={selectedSong.pdf_url}
                target="_blank"
                className="px-6 py-3 rounded-full border border-[#8799B6] text-[#5a6d8c] hover:bg-[#8799B6]/20 transition"
              >
                Descargar Gratis
              </a>

              <button
                className="px-6 py-3 rounded-full
                bg-gradient-to-r from-[#8799B6] to-[#5a6d8c]
                text-white
                hover:scale-105
                transition"
              
                  onClick={async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  }}>
                Hacer Donativo
              </button>

            </div>

          </motion.div>
        </div>
      )}




      {/* FOOTER */}
      
<footer className="mt-24 relative bg-gradient-to-b from-[#8799B6]/20 to-white border-t border-white/40 backdrop-blur-xl">

{/* Glow superior elegante */}
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-white/40 blur-3xl rounded-full opacity-40"></div>

<div className="relative max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

  {/* LOGO + MARCA */}
  <div className="flex flex-col items-center md:items-start">
  <div className="relative w-50 h-30 mb-4 flex items-center justify-center">

      {/* Aura */}
      
      <Image
        src="/1-10.png"
        alt="Cantos del Cielo"
        fill
        className="object-contain"
      />
    </div>

    
  </div>


  {/* MINISTERIO */}
  <div>
    <h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
      Ministerio
    </h3>

    <p className="text-gray-600 text-sm leading-relaxed">
      Compartimos música litúrgica que acompaña la oración, la paz interior y
      la conexión espiritual en cada celebración.
    </p>
  </div>


  {/* REDES */}
  <div>
    <h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
      Visitanos en:
    </h3>

    <div className="flex gap-4">

      <a
        href="#"
        className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
      >
        <Facebook className="w-5 h-5 text-[#5a6d8c]" />
      </a>

      <a
        href="https://www.instagram.com/cantos.del.cielo"
        target="_blank"
        className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
      >
        <Instagram className="w-5 h-5 text-[#5a6d8c]" />
      </a>

      <a
        href="https://www.tiktok.com/@cantos.del.cielo"
        target="_blank"
        className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-[#5a6d8c]"
        >
          <path d="M12.5 2c.3 2.2 1.8 4 4 4.5v3.1c-1.4-.1-2.8-.6-4-1.4v6.4c0 3.5-2.8 6.4-6.4 6.4S-.3 18.1-.3 14.6s2.8-6.4 6.4-6.4c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.8 0-3.2 1.4-3.2 3.2S4.3 18 6.1 18s3.2-1.4 3.2-3.2V2h3.2z"/>
        </svg>
      </a>

      <a
        href="https://www.youtube.com/@Cantosdelcielo-dn"
        target="_blank"
        className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
      >
        <Youtube className="w-5 h-5 text-[#5a6d8c]" />
      </a>

    </div>
    <div><h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
    Contáctanos;
    </h3>
  
<p className="text-gray-600 text-sm leading-relaxed">



<a
  href="https://wa.me/523318486644?text=Hola%20me%20interesan%20los%20cantos"
  target="_blank"
  className="text-gray-600 text-sm leading-relaxed"
>
  <MessageCircle className="w-5 h-5 text-[#5a6d8c]" />Teléfono / WhatsApp
+52 (33) 18 48 6644
</a>
  


<Mail className="w-5 h-5 text-[#5a6d8c]" />
cantosdelcielo.zac@gmail.com</p></div>
  </div>


  {/* FRASE */}
  <div>
    <h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
      Inspiración
    </h3>

    <p className="text-gray-600 italic text-sm leading-relaxed">
      "El que canta ora dos veces."
    </p>

    <p className="text-gray-400 text-xs mt-2">
      — San Agustín
    </p>
  </div>

</div>


{/* LÍNEA INFERIOR PREMIUM */}
<div className="relative border-t border-white/40 py-6 text-center">

  {/* Línea decorativa */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#8799B6] to-transparent"></div>

  <p className="text-gray-400 text-sm mt-2">
    © {new Date().getFullYear()} Cantos del Cielo — Coro católico
  </p>

</div>

</footer>


    </main>
  );
}