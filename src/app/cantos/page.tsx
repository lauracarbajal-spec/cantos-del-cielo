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
              borderRadius: "24px",
              boxShadow: "0 15px 35px rgba(120, 100, 180, 0.15)",
            }}
          >
            <h2
              style={{
                marginBottom: "12px",
                fontSize: "22px",
                color: "#3f3566",
              }}
            >
              {song.title}
            </h2>

            <span
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg, #e9d5ff, #fbcfe8)",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "14px",
                color: "#4b3f72",
                marginBottom: "18px",
              }}
            >
              {song.category}
            </span>

            <div>
              <a
                href={song.pdf_url}
                target="_blank"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  padding: "10px 20px",
                  background:
                    "linear-gradient(90deg, #c084fc, #a78bfa, #f0abfc)",
                  color: "white",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: "500",
                  boxShadow: "0 8px 20px rgba(168, 85, 247, 0.3)",
                }}
              >
                Ver PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "40px", color: "#6b5ca5" }}>
          No se encontraron resultados
        </p>
      )}
    </div>
  )
}