"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { useRef } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Cantos() {
  const [songs, setSongs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const scrollRef=useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSongs();
  }, []);
  const categoryCounts = songs.reduce((acc: any, song: any) => {
    const cat = song.category || "Sin categoría";
  
    if (!acc[cat]) acc[cat] = 0;
    acc[cat]++;
  
    return acc;
  }, {});
  const categories = [
    "Todos",
    ...Object.keys(categoryCounts).sort(
      (a, b) => categoryCounts[b] - categoryCounts[a]
    ),
  ];
  useEffect(() => {
    setTimeout(() => {
      const activeBtn = scrollRef.current?.querySelector(
        "[data-active='true']"
      );
      activeBtn?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }, 200);
  }, []);
  async function fetchSongs() {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (data) setSongs(data);
  }

  const filteredSongs = songs.filter((song: any) => {
    const matchSearch = song.title
      .toLowerCase()
      .includes(search.toLowerCase());

     

    const matchFilter =
      filter === "Todos" ||
      song.category?.toLowerCase() === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  const grouped = filteredSongs.reduce((acc: any, song: any) => {
    if (!acc[song.category]) acc[song.category] = [];
    acc[song.category].push(song);
    return acc;
  }, {});

 

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#8799B6]/20 to-white px-6 py-20">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-16 text-center">

      <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="text-4xl md:text-5xl font-light tracking-wide text-gray-800 mb-6"
>
  Cantos del Ministerio
</motion.h1>

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="relative w-full max-w-md mx-auto"
>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8799B6]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
      />
    </svg>

    <input
      type="text"
      placeholder="Buscar canto..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-3 rounded-full
      border border-[#8799B6]/30
      bg-white
      text-gray-900
      placeholder-gray-400
      shadow-sm
      focus:outline-none focus:ring-2 focus:ring-[#8799B6]"
    />

  </motion.div>

</div>
      {/* FILTROS */}
      <div className="relative mb-16">

 <div
  ref={scrollRef}
  className="flex gap-3 overflow-x-auto no-scrollbar px-2">

    {categories.map((cat) => {

const count =
cat === "Todos"
  ? songs.length
  : categoryCounts[cat] || 0;

      const isActive = filter === cat;

      return (
        <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={`
            relative whitespace-nowrap px-5 py-2 rounded-full text-sm
            transition-all duration-300
            ${isActive
              ? "text-white"
              : "text-[#5a6d8c] hover:text-[#8799B6]"}
          `}
          data-active={isActive}
        >

          {/* Fondo animado */}
          {isActive && (
            <span className="absolute inset-0 bg-gradient-to-r from-[#8799B6] to-[#5a6d8c] rounded-full shadow-md -z-10"></span>
          )}

          {/* Contenido */}
          <span className="flex items-center gap-2 relative z-10">
            {cat}

            <span
  className={`
    text-xs px-2 py-0.5 rounded-full
    ${isActive
      ? "bg-white/30"
      : "bg-[#8799B6]/20"}
  `}
>
  {count}
</span>
          </span>

        </button>
      );
    })}

  </div>

</div>

      {/* LISTA */}
      <div className="max-w-5xl mx-auto space-y-20">

        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            No se encontraron cantos
          </p>
        )}

        {Object.keys(grouped).map((category) => (
          <div key={category}>

            {/* TITULO */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-light text-[#5a6d8c] tracking-wide">
                {category}
              </h2>
              <div className="w-24 h-[1px] bg-[#8799B6]/40 mx-auto mt-4"></div>
            </div>

            {/* CARDS */}
            <div className="grid gap-6">

              {grouped[category].map((song: any, i: number) => (

                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-col sm:flex-row sm:items-center sm:justify-between
                  gap-3
                  bg-white/70 backdrop-blur-md
                  border border-[#8799B6]/20
                  rounded-2xl px-6 py-5
                  shadow-sm hover:shadow-xl
                  hover:-translate-y-1
                  transition-all duration-300"
                >

                  <span className="text-gray-800 tracking-wide font-light">
                    {song.title}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedSong(song);
                      setOpen(true);
                    }}
                    className="px-4 py-2 text-sm rounded-full
                    border border-[#8799B6]
                    text-[#5a6d8c]
                    hover:bg-[#8799B6]/20
                    transition"
                  >
                    Descargar
                  </button>

                </motion.div>

              ))}

            </div>

          </div>
        ))}

      </div>

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

    </main>
  );
}