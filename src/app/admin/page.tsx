"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file || !title || !category) {
      alert("Completa todos los campos")
      return
    }

    setUploading(true)

    const fileName = `pdf-${Date.now()}.pdf`

    // 1️⃣ Subir archivo
    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file)

    if (error) {
      alert("Error al subir PDF")
      console.error(error)
      setUploading(false)
      return
    }

    // 2️⃣ Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName)

    const pdfUrl = publicUrlData.publicUrl

    // 3️⃣ Guardar en base de datos
    const { error: dbError } = await supabase
      .from("songs")
      .insert([
        {
          title,
          category,
          pdf_url: pdfUrl,
        },
      ])

    if (dbError) {
      alert("Error guardando en base de datos")
      console.error(dbError)
    } else {
      alert("Canción subida correctamente 🎉")
      setTitle("")
      setCategory("")
      setFile(null)
    }

    setUploading(false)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Panel Admin - Subir Canción</h1>

      <input
        type="text"
        placeholder="Nombre de la canción"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Categoría"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir Canción"}
      </button>
    </div>
  )
}