"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
 

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (!error && data) setSongs(data);
  }

  // Agrupar por categoría
  
  const filteredSongs = songs.filter((song: any) => {

    const matchSearch =
    song.title.toLowerCase().includes(search.toLowerCase());
    
    const matchFilter =
filter === "Todos" || song.category?.toLowerCase() === filter.toLowerCase();
    
    return matchSearch && matchFilter;
    
    });
  const grouped = filteredSongs.reduce((acc: any, song: any) => {
    if (!acc[song.category]) acc[song.category] = [];
    acc[song.category].push(song);
    return acc;
  }, {});



  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50 px-6 py-20">
   
   <div className="max-w-6xl mx-auto flex items-center justify-between mb-16">

<h1 className="text-4xl font-light tracking-wide text-gray-800">
  Cantos del Ministerio
</h1>

<div className="relative w-64">

<svg
  xmlns="http://www.w3.org/2000/svg"
  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400"
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
  className="w-full pl-10 pr-4 py-2 rounded-full
  border border-purple-300
  bg-white
  shadow-sm
  focus:outline-none focus:ring-2 focus:ring-purple-400"
/>

</div>

</div>
<div className="flex flex-wrap justify-center gap-3 mb-14">

{["Todos","Entrada","Canto de entrada","Cantos de comunión","Misa"].map((cat) => {

const count =
cat === "Todos"
? songs.length
: songs.filter((s) => s.category === cat).length;

return (

<button
key={cat}
onClick={() => setFilter(cat)}
className={`px-4 py-2 rounded-full border transition flex items-center gap-2
${filter === cat
? "bg-purple-500 text-white border-purple-500 shadow-md"
: "border-purple-300 text-purple-600 hover:bg-purple-100"}`}
>

{cat}

<span className={`text-xs px-2 py-0.5 rounded-full
${filter === cat ? "bg-white/30" : "bg-purple-100"}`}>

{count}

</span>

</button>

);

})}

</div>
<div className="max-w-4xl mx-auto space-y-20">

{Object.keys(grouped).length === 0 && (
  <p className="text-center text-gray-500 text-lg">
    No se encontraron cantos
  </p>
)}

{Object.keys(grouped).map((category) => (
  <div key={category}>

            {/* Título categoría */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-light text-purple-700 tracking-wide">
                {category}
              </h2>
              <div className="w-24 h-[1px] bg-purple-300 mx-auto mt-4"></div>
            </div>
          


            {/* Lista de cantos */}
            <div className="space-y-6 transition-all duration-500">
              {grouped[category].map((song: any) => (
                <div
                  key={song.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                  gap-3
                  bg-white
                  border border-purple-100
                  rounded-2xl px-5 py-4
                  shadow-sm hover:shadow-lg
                  transition-all duration-300">
                  <span className="text-gray-800 tracking-wide break-words">
                    {song.title}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedSong(song);
                      setOpen(true);
                    }}
                    className="self-start sm:self-auto px-4 py-2 text-sm border border-purple-400 text-purple-700 rounded-full hover:bg-purple-100 transition">
                    Descargar
                  </button>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>

      {/* MODAL */}
      {open && selectedSong && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="relative bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-light text-gray-800 mb-4">
              {selectedSong.title}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-8">
              Puedes descargar este canto gratuitamente.
              <br />
              Si deseas apoyar este ministerio con un donativo voluntario,
              será una bendición para seguir compartiendo música.
            </p>

            <div className="flex flex-col gap-4">

              <a
                href={selectedSong.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300"
              >
                Descargar Gratis
              </a>

              <button
                onClick={async () => {
                  const res = await fetch("/api/create-checkout-session", {
                    method: "POST",
                  });
                  const data = await res.json();
                  window.location.href = data.url;
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 text-black font-medium hover:scale-105 transition-transform duration-300 shadow-md"
              >
                Hacer Donativo
              </button>

            </div>

            <p className="text-xs text-gray-400 mt-6">
              Gracias por apoyar este ministerio 🙏
            </p>

          </div>
        </div>
      )}
    </main>
  );
}