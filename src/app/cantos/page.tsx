"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"



const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CantosPage() {
  const [songs, setSongs] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [selectedSong, setSelectedSong] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchSongs = async () => {
      const { data } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false })

      setSongs(data || [])
    }

    fetchSongs()
  }, [])

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(search.toLowerCase()) ||
    song.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        background:
          "linear-gradient(135deg, #ece9f6 0%, #d8d3f0 40%, #f5f3ff 100%)",
        fontFamily: "Georgia, serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "42px",
          marginBottom: "30px",
          color: "#4b3f72",
        }}
      >
        ✨ Cantos Disponibles ✨
      </h1>

      {/* 🔎 Buscador */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "12px 20px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "30px",
            border: "1px solid #d8b4fe",
            outline: "none",
            fontSize: "16px",
            boxShadow: "0 5px 15px rgba(168,85,247,0.1)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "35px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              padding: "30px",
              textAlign:"center",
              borderRadius: "24px",
              boxShadow: "0 15px 35px rgba(120, 100, 180, 0.15)",
              
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
            >
              {song.title}
            </h2>

            <span
             className="text-gray-600 mb-6"
            >
              {song.category}
            </span>

            <div>
            <button
  onClick={() => {
    setSelectedSong(song)
    setShowModal(true)
  }}
  className="inline-block px-6 py-2 border border-purple-400 text-purple-600 rounded-full hover:bg-purple-900/30 transition"
  
>
  Descargar
</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-purple-900/30 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300">

    <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

      {/* Botón cerrar */}
      <button
       onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
      >
        ✕
      </button>

      <div className="relative mb-6">

{/* Lluvia divina */}
<div className="divine-rain" style={{ left: "45%", animationDelay: "0s" }}></div>
<div className="divine-rain" style={{ left: "50%", animationDelay: "0.5s" }}></div>
<div className="divine-rain" style={{ left: "55%", animationDelay: "1s" }}></div>

      </div>

      <h3 className="text-2xl font-light tracking-wide text-gray-800 mb-4">
        Descarga con Amor
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed mb-8">
        Puedes descargar este canto gratuitamente.
        <br />
        Si deseas apoyar este ministerio con un donativo voluntario,
        será una bendición para seguir compartiendo música.
      </p>

      <div className="flex flex-col gap-4">

        <a
        href={selectedSong?.pdf_url}
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
        Gracias por apoyar este proyecto 🙏
      </p>

    </div>
  </div>
)}

      {filteredSongs.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "40px", color: "#6b5ca5" }}>
          No se encontraron resultados
        </p>
      )}
    </div>
  )
}