"use client";

import { useEffect, useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
const [editTitle, setEditTitle] = useState("");
const [editCategory, setEditCategory] = useState("");
const [editFile, setEditFile] = useState(null);
const fileInputRef = useRef(null);
const [isDragging, setIsDragging] = useState(false);
const uploadFileRef = useRef(null);
const editFileRef = useRef(null);
const [isDraggingEdit, setIsDraggingEdit] = useState(false);
const [previewUrl, setPreviewUrl] = useState(null);
const [menuOpen, setMenuOpen] = useState(false);

type SongUpdate = {
  title: string;
  category: string;
  pdf_url?: string;
};

  function startEdit(song) {
    setEditingSong(song);
    setEditTitle(song.title);
    setEditCategory(song.category);
  }
  /*actualizar*/
  async function updateSong() {
    if (!editingSong) return;
  
    let updatedData: SongUpdate = {
      title: editTitle,
      category: editCategory,
    };
  
    if (editFile) {
      const fileName = `${Date.now()}-${editFile.name}`;
  
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, editFile);
  
      if (uploadError) {
        alert(uploadError.message);
        return;
      }
  
      const { data } = supabase.storage
        .from("pdfs")
        .getPublicUrl(fileName);
  
      updatedData.pdf_url = data.publicUrl;
    }
  
    const { error } = await supabase
      .from("songs")
      .update(updatedData)
      .eq("id", editingSong.id);
  
    if (error) {
      alert(error.message);
      return;
    }
  
    // ⚡ ACTUALIZACIÓN INSTANTÁNEA
    setSongs((prev) =>
      prev.map((song) =>
        song.id === editingSong.id
          ? { ...song, ...updatedData }
          : song
      )
    );
  
    setEditingSong(null);
    setEditFile(null);
  
    setMessage("Canto actualizado ✨");
  }
  async function checkUser() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) router.push("/login");
  }

  async function fetchSongs() {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (data) setSongs(data);
  }

  async function uploadSong(e) {
    e.preventDefault();
  
    if (!file) {
      alert("Selecciona un PDF");
      return;
    }
  
    const fileName = `${Date.now()}-${file.name}`;
  
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file);
  
    if (uploadError) {
      console.error(uploadError);
      alert(uploadError.message);
      return;
    }
  
    const { data } = supabase.storage
      .from("pdfs")
      .getPublicUrl(fileName);
  
    const { error: insertError } = await supabase
      .from("songs")
      .insert([
        {
          title,
          category,
          pdf_url: data.publicUrl,
        },
      ]);
     
   
  
    if (insertError) {
      console.error(insertError);
      alert(insertError.message);
      return;
    }
    setMessage("Canto agregado correctamente ✨");
    setTimeout(() => setMessage(""), 3000);
  
    setTitle("");
    setCategory("");
    setFile(null);
  
    fetchSongs();
  }
//eliminar
async function deleteSong(id) {
  const confirmDelete = confirm("¿Seguro que quieres eliminar este canto?");
  if (!confirmDelete) return;

  const { error } = await supabase
    .from("songs")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  setMessage("Canto eliminado 🗑️");
  fetchSongs();
}

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  useEffect(() => {
    checkUser();
    fetchSongs();
  }, []);
  useEffect(() => {
    if (!editingSong) return;
    
    

    

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setEditingSong(null);
      }
    };
    
    window.addEventListener("keydown", handleEsc);
  
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [editingSong]);

  useEffect(() => {
    if (editFile) {
      const url = URL.createObjectURL(editFile);
      setPreviewUrl(url);
  
      return () => URL.revokeObjectURL(url);
    } else if (editingSong?.pdf_url) {
      setPreviewUrl(editingSong.pdf_url);
    } else {
      setPreviewUrl(null);
    }
  }, [editFile, editingSong]);


  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#8799B6]/10 to-white px-6 md:px-16 py-16">
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  className="max-w-6xl mx-auto mb-10 flex items-center justify-between"
>

  {/* LOGO / TITULO */}
  <h1 className="text-2xl md:text-3xl font-light text-gray-800">
    Panel
  </h1>

  {/* DESKTOP MENU */}
  <div className="hidden md:flex items-center gap-8 text-sm text-[#5c6e91]">

    <button onClick={() => router.push("/")} className="relative group">
      Inicio
      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#8799B6] group-hover:w-full transition-all"></span>
    </button>

    <button onClick={() => router.push("/cantos")} className="relative group">
      Cantos
      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[#8799B6] group-hover:w-full transition-all"></span>
    </button>

    <button onClick={logout} className="text-red-400 hover:text-red-600">
      Cerrar sesión
    </button>

  </div>

  {/* MOBILE BUTTON */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden text-2xl text-[#5c6e91]"
  >
    ☰
  </button>

</motion.div>
{menuOpen && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="md:hidden max-w-6xl mx-auto mb-6 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-lg"
  >
    <div className="flex flex-col gap-4 text-[#5c6e91]">

      <button
        onClick={() => {
          router.push("/");
          setMenuOpen(false);
        }}
        className="text-left"
      >
        Inicio
      </button>

      <button
        onClick={() => {
          router.push("/cantos");
          setMenuOpen(false);
        }}
        className="text-left"
      >
        Cantos
      </button>

      <button
        onClick={logout}
        className="text-left text-red-400"
      >
        Cerrar sesión
      </button>

    </div>
  </motion.div>
)}
      {/* FORMULARIO */}
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] mb-16">
        <h2 className="text-2xl mb-6 text-gray-700">
          Agregar Nuevo Canto
        </h2>

        <div className="space-y-4">

        {editingSong?.pdf_url && !editFile && (
  <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-600 flex items-center justify-between">
    <span className="truncate">📄 Archivo actual</span>

    <button
  
  className="text-[#8799B6] hover:underline text-xs"
>
  Verssssss
</button>
  </div>
)}
          <input 
            type="text"
            placeholder="Título"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#8799B6]/30 rounded-xl px-4 py-3 text-[#5c6e91] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#8799B6]"
          />

          <input
            type="text"
            placeholder="Categoría (Entrada, Comunión, etc)"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-[#8799B6]/30 rounded-xl px-4 py-3 text-[#5c6e91] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#8799B6]"
          />

<div
  onClick={() => uploadFileRef.current?.click()}
  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }}
  onDragLeave={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }}
  onDrop={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Solo PDFs");
    }
  }}
  className={`
    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
    flex flex-col items-center justify-center gap-4
    transition-all duration-300

    ${
      isDragging
        ? "border-[#8799B6] bg-[#8799B6]/20 scale-105 shadow-lg"
        : "border-[#8799B6]/40 hover:bg-[#8799B6]/10"
    }
  `}
>
  {/* INPUT REAL */}
  <input
    ref={uploadFileRef}
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files?.[0] || null)}
    className="hidden"
  />

  {/* ICONO */}
  <div className="text-3xl">
    📄
  </div>

  {/* TEXTO */}
  <p className="text-[#5c6e91] font-medium">
    {isDragging
      ? "Suelta tu PDF aquí ✨"
      : "Arrastra tu PDF o haz clic"}
  </p>

  {/* PREVIEW */}
  {file && (
    <div className="bg-white/70 border border-[#8799B6]/20 rounded-xl px-4 py-2 text-sm text-gray-600 shadow-sm">
      {file.name}
    </div>
  )}
</div><button
  onClick={uploadSong}
  className="w-full mt-4 px-6 py-3 rounded-xl bg-[#8799B6] text-white font-medium hover:scale-105 hover:shadow-lg transition-all duration-200"
>
  Guardar Canto
</button>
        </div>




      </div>

      {/* LISTA */}
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        <h2 className="text-2xl mb-8 text-gray-700">
          Cantos Registrados
        </h2>

        <div className="space-y-4">
          {songs.map((song) => (
            <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
            bg-white/80 border border-[#8799B6]/10 rounded-2xl px-5 py-4
            hover:shadow-lg transition-all duration-300"
          >
              <div>
  <p className="font-semibold text-gray-900 tracking-wide">
    {song.title}
  </p>
  <p className="text-sm text-[#5c6e91]">
    {song.category}
  </p>
</div>

              <div className="flex gap-4">

              <button 
  onClick={() => startEdit(song)}
  className="text-[#8799B6] hover:underline"
>
  Editar
</button>

<button 
  onClick={() => deleteSong(song.id)}
  className="text-red-400 hover:text-red-600"
>
  Eliminar
</button>

</div>
            </motion.div>
          ))}
        
        </div>
      </div>

      
      {editingSong && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={() => {
      setEditingSong(null);
      setPreviewUrl(null);
    }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 40 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-[90%] max-w-md max-h-[85vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.25)] border border-white/40">

      {/* HEADER */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-light text-gray-800">
          Editar Canto
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Actualiza la información o el PDF
        </p>
      </div>

      <div className="space-y-4">

        {/* INPUT TITULO */}
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-[#8799B6]/30 rounded-xl px-4 py-3 text-[#5c6e91] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#8799B6]"
        />

        {/* INPUT FILE */}
        <div
        
  onClick={() => editFileRef.current?.click()}
  
  onDragOver={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingEdit(true);
  }}
  onDragLeave={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingEdit(false);
  }}
  onDrop={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingEdit(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile?.type === "application/pdf") {
      setEditFile(droppedFile);
    } else {
      alert("Solo PDFs");
    }
  }}
  
  className={`
    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
    flex flex-col items-center justify-center gap-3
    transition-all duration-300

    ${
      isDraggingEdit
        ? "border-[#8799B6] bg-[#8799B6]/20 scale-105"
        : "border-[#8799B6]/30 hover:bg-[#8799B6]/10"
    }
  `}
>
  {/* INPUT OCULTO */}
  <input
    ref={editFileRef}
    type="file"
    accept="application/pdf"
    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
    className="hidden"
  />

  {/* ICONO */}
  <div className="text-2xl">📄</div>

  {/* TEXTO */}
  <p className="text-[#5c6e91] text-sm">
  {isDraggingEdit
    ? "Suelta para reemplazar ✨"
    : editFile
    ? "Nuevo archivo listo"
    : "Arrastra o haz clic para reemplazar"}
</p>


  {/* PREVIEW */}
  {editFile && (
    <div className="bg-[#8799B6]/10 border border-[#8799B6]/20 rounded-xl px-3 py-1 text-xs text-[#5c6e91]">
      {editFile.name}
    </div>
  )}
</div>

        {/* PREVIEW */}
        {editFile && (
  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm text-green-700 flex items-center justify-between">
    <span className="truncate">📄 {editFile.name}</span>

    <button
      onClick={(e) => {
        e.stopPropagation();
        setEditFile(null);
      }}
      className="text-xs text-red-400 hover:text-red-600"
    >
      Quitar
    </button>
  </div>
)}

{/*Fin del drag & drop*/ }
{previewUrl && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-4 border border-gray-200 rounded-xl overflow-hidden"
  >
    {/* HEADER */}
    <div className="flex justify-between items-center bg-gray-100 px-4 py-2 text-sm">
      <span className="text-gray-600">Vista previa</span>

      <button
        onClick={() => setPreviewUrl(null)}
        className="text-red-400 hover:text-red-600"
      >
        Cerrar
      </button>
    </div>

    {/* PDF */}
    <iframe
  src={previewUrl}
  className="w-full h-[220px] rounded-b-xl"
/>
  </motion.div>
)}

        {/* BOTONES */}
        <div className="flex justify-between gap-3 pt-4">

          <button
            onClick={() => setEditingSong(null)}
            className="flex-1 px-6 py-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>

          <button
            onClick={updateSong}
            className="flex-1 px-6 py-3 rounded-full bg-[#8799B6] text-white hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Guardar
          </button>

        </div>
      </div>

    </motion.div>
  </motion.div>
)}
{message && (
  <div className="fixed bottom-6 right-6 bg-[#8799B6] text-white px-6 py-3 rounded-full shadow-lg">
    {message}
  </div>
)}
    </main>
  );
}