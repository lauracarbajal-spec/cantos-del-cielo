"use client";

import { useEffect, useState } from "react";
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

  function startEdit(song) {
    setEditingSong(song);
    setEditTitle(song.title);
    setEditCategory(song.category);
  }
  /*actualizar*/
  async function updateSong() {
    if (!editingSong) return;
  
    let updatedData = {
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

  async function uploadSong(e: any) {
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




  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#8799B6]/10 to-white px-6 md:px-16 py-16">

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="max-w-6xl mx-auto mb-16 text-center"
>
  <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-800 mb-6">
    Panel del Ministerio
  </h1>

  <button
    onClick={logout}
    className="px-6 py-2 rounded-full border border-[#8799B6]/40 text-[#5c6e91] hover:bg-[#8799B6]/10 transition"
  >
    Cerrar Sesión
  </button>
</motion.div>

      {/* FORMULARIO */}
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.1)] mb-16">
        <h2 className="text-2xl mb-6 text-gray-700">
          Agregar Nuevo Canto
        </h2>

        <div className="space-y-4">

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
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Solo PDFs");
    }
  }}
  className="border-2 border-dashed border-[#8799B6]/40 rounded-xl p-6 text-center cursor-pointer hover:bg-[#8799B6]/10 transition"
>
  {file ? (
    <p className="text-[#5c6e91]">{file.name}</p>
  ) : (
    <p className="text-gray-500">
      Arrastra tu PDF aquí o haz click
    </p>
  )}

  <input
    type="file"
    accept="application/pdf"
    onChange={(e) => setFile(e.target.files[0])}
    className="hidden"
  />
</div>
{file && (
  <p className="text-sm text-gray-500 mt-2">
    Archivo seleccionado: {file.name}
  </p>
)}

<button
  onClick={uploadSong}
  disabled={loading}
  className="px-6 py-3 rounded-full bg-[#8799B6] text-white flex items-center justify-center gap-2 hover:scale-105 transition"
>
  {loading ? (
    <>
      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      Subiendo...
    </>
  ) : (
    "Agregar Canto"
  )}
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
 <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
    <div className="bg-white rounded-3xl p-8 w-[90%] max-w-md shadow-xl">

      <h2 className="text-xl mb-6 text-gray-700">
        Editar Canto
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-purple-200 rounded-xl px-4 py-3 text-[#5c6e91]"
        />

        <input
          type="text"
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          className="w-full border border-purple-200 rounded-xl px-4 py-3 text-[#5c6e91]"
        />

        <input
          type="file"
          accept="application/pdf"
          className="w-full border border-purple-200 rounded-xl px-4 py-3 text-[#5c6e91]"
          onChange={(e) => setEditFile(e.target.files?.[0] || null)}
        />

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setEditingSong(null)}
            className="px-6 py-3 rounded-full bg-[#8799B6] text-white flex items-center justify-center gap-2 hover:scale-105 transition"
>
          
            Cancelar
          </button>

          <button
            onClick={updateSong}
            className="px-6 py-3 rounded-full bg-[#8799B6] text-white flex items-center justify-center gap-2 hover:scale-105 transition"
            >
            Guardar Cambios
          </button>
        </div>

      </div>

    </div>
  </div>
)}
{message && (
  <div className="fixed bottom-6 right-6 bg-[#8799B6] text-white px-6 py-3 rounded-full shadow-lg">
    {message}
  </div>
)}
    </main>
  );
}