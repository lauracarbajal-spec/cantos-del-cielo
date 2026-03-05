"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const router = useRouter();

  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
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
    console.log("Actualizando...");
  
    if (!editingSong) return;
  
    let updatedData: any = {
      title: editTitle,
      category: editCategory,
    };
  
    if (editFile) {
      const fileName = `${Date.now()}-${editFile.name}`;
  
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, editFile);
  
      if (uploadError) {
        console.error(uploadError);
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
      console.error(error);
      alert(error.message);
      return;
    }
  
    setEditingSong(null);
    setEditFile(null);
    fetchSongs();
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
  
    setTitle("");
    setCategory("");
    setFile(null);
  
    fetchSongs();
  }

  async function deleteSong(id) {
    await supabase.from("songs").delete().eq("id", id);
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
    <main className="min-h-screen bg-gradient-to-b from-white to-purple-50 p-16">

      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-light text-gray-800">
          Panel del Ministerio
        </h1>

        <button
          onClick={logout}
          className="px-5 py-2 border border-purple-400 text-purple-600 rounded-full hover:bg-purple-100 transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* FORMULARIO */}
      <div className="bg-white rounded-3xl p-10 shadow-lg border border-purple-100 mb-16">
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
            className="w-full border border-purple-200 rounded-xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Categoría (Entrada, Comunión, etc)"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-purple-200 rounded-xl px-4 py-3"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full"
          />

<button
  type="button"
  onClick={uploadSong}
  className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-300 to-purple-400 text-black"
>
  Agregar Canto
</button>

        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white rounded-3xl p-10 shadow-lg border border-purple-100">
        <h2 className="text-2xl mb-8 text-gray-700">
          Cantos Registrados
        </h2>

        <div className="space-y-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {song.title}
                </p>
                <p className="text-sm text-gray-500">
                  {song.category}
                </p>
              </div>

              <div className="flex gap-4">

  <button
    onClick={() => startEdit(song)}
    className="text-purple-600 hover:text-purple-800"
  >
    Editar
  </button>

  <button
    onClick={() => deleteSong(song.id)}
    className="text-red-500 hover:text-red-700"
  >
    Eliminar
  </button>

</div>
            </div>
          ))}
        </div>
      </div>
      {editingSong && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-3xl p-8 w-[90%] max-w-md shadow-xl">

      <h2 className="text-xl mb-6 text-gray-700">
        Editar Canto
      </h2>

      <div className="space-y-4">

        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full border border-purple-200 rounded-xl px-4 py-3"
        />

        <input
          type="text"
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          className="w-full border border-purple-200 rounded-xl px-4 py-3"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setEditFile(e.target.files?.[0] || null)}
        />

        <div className="flex justify-between pt-4">
          <button
            onClick={() => setEditingSong(null)}
            className="px-4 py-2 border border-gray-300 rounded-full"
          >
            Cancelar
          </button>

          <button
            onClick={updateSong}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-300 to-purple-400 text-black"
          >
            Guardar Cambios
          </button>
        </div>

      </div>

    </div>
  </div>
)}
    </main>
  );
}