"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AdminPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return alert("Selecciona un PDF")

    setLoading(true)

    const fileName = `pdf-${Date.now()}.pdf`

    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file)

    if (uploadError) {
      alert("Error al subir PDF")
      setLoading(false)
      return
    }

    const pdfUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pdfs/${fileName}`

    await supabase.from("songs").insert([
      { title, category, pdf_url: pdfUrl },
    ])

    alert("Canto agregado ✨")
    setTitle("")
    setCategory("")
    setFile(null)
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fdf4ff 0%, #e9d5ff 40%, #f3e8ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          padding: "40px",
          borderRadius: "30px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 20px 40px rgba(168,85,247,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#5b3e96",
            marginBottom: "30px",
            fontSize: "32px",
          }}
        >
          ✨ Panel Admin ✨
        </h1>

        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            type="text"
            placeholder="Título del canto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={inputStyle}
          />

<div style={{ textAlign: "center" }}>
  <label
    style={{
      display: "inline-block",
      padding: "12px 22px",
      background: "linear-gradient(90deg, #e9d5ff, #f3e8ff)",
      borderRadius: "25px",
      cursor: "pointer",
      color: "#5b3e96",
      fontWeight: "500",
      boxShadow: "0 8px 20px rgba(168,85,247,0.15)",
      transition: "0.3s",
    }}
  >
    📎 Seleccionar PDF
    <input
      type="file"
      accept="application/pdf"
      onChange={(e) => setFile(e.target.files[0])}
      required
      style={{ display: "none" }}
    />
  </label>

  {file && (
    <p
      style={{
        marginTop: "12px",
        fontSize: "14px",
        color: "#7c6bb3",
      }}
    >
      📄 {file.name}
    </p>
  )}
</div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background:
                "linear-gradient(90deg, #c084fc, #a78bfa, #f0abfc)",
              color: "white",
              border: "none",
              borderRadius: "25px",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 10px 25px rgba(168,85,247,0.3)",
              transition: "0.3s",
            }}
          >
            {loading ? "Subiendo..." : "Agregar Canto"}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "20px",
  border: "1px solid #e9d5ff",
  outline: "none",
  fontSize: "14px",
}