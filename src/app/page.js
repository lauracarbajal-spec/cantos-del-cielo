"use client";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
export default function Home() {
  const [open, setOpen] = useState(false);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
  
  
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .order("category", { ascending: true })
      .order("title", { ascending: true });

    if (!error && data) {
      const firstByCategory = {};

data.forEach((song) => {
        if (!firstByCategory[song.category]) {
          firstByCategory[song.category] = song;
        }
      });

      setSongs(Object.values(firstByCategory));
    }
  }
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-purple-50 px-6 py-20">
<div className="flex-grow">
      {/* Nube superior izquierda */}
<div className="cloud absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-200 rounded-full opacity-40 blur-3xl"></div>

{/* Nube superior derecha */}
<div className="cloud-slow absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-200 rounded-full opacity-40 blur-3xl"></div>

{/* Nube inferior */}
<div className="cloud absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-purple-100 rounded-full opacity-50 blur-3xl"></div>

{/* Rayo tipo lluvia divina */}
<div className="relative mb-6">

  {/* Lluvia divina */}
  <div className="divine-rain" style={{ left: "45%", animationDelay: "0s" }}></div>
  <div className="divine-rain" style={{ left: "50%", animationDelay: "0.5s" }}></div>
  <div className="divine-rain" style={{ left: "55%", animationDelay: "1s" }}></div>

 

</div>

      {/* Contenido */}
      <div className="relative text-center p-10">
        <p className="tracking-widest text-gray-500 mb-4">
        CORO CATÓLICO
        </p>

        <h1 className="text-6xl tracking-wide font-semibold text-gray-900 mb-4">
          Cantos del Cielo
        </h1>

        <p className="text-2xl italic text-purple-600 mb-6">
          Daniela y Nataly
        </p>

        <p className="tracking-[0.3em] text-gray-600 mt-6">
        Voces en armonía
        </p>
        <section className="max-w-6xl mx-auto mt-20 mb-20 px-6 grid md:grid-cols-2 gap-12 items-center">

{/* Imagen del coro */}
<div className="rounded-3xl overflow-hidden shadow-xl">
  <img
    src="/coro.jpg"
    alt="Coro Voces en Armonía"
    className="w-full h-full object-cover"
  />
</div>

{/* Texto */}
<div>

  <h2 className="text-3xl font-light text-purple-700 mb-6 tracking-wide">
    Quiénes Somos
  </h2>

  <p className="text-gray-600 leading-relaxed text-lg">
  Somos Daniela y Nataly, y creamos Cantos del Cielo como un espacio para compartir música católica que ayude a las personas a acercarse a Dios.
  </p>

  <p className="text-gray-600 leading-relaxed text-lg mt-4">
  Aquí encontrarás cantos con letra y acordes, pensados para quienes también sirven al Señor a través de la música en sus parroquias, grupos o momentos de oración.
Cada canto nace con cariño y con el deseo de elevar el corazón al cielo.
  </p>

</div>

</section>
        <a
  href="/cantos"
  className="inline-block mt-8 px-10 py-4 text-lg font-medium tracking-wide
  rounded-full
  bg-gradient-to-r from-purple-400 to-purple-500
  text-white
  shadow-lg shadow-purple-200
  hover:scale-105 hover:shadow-xl
  transition-all duration-300"
>
  Ver Cantos
</a>


        
        {/* Sección de PDFs */}
<section className="relative mt-32 px-10 pb-20">
  <h2 className="text-4xl text-center font-semibold mb-12 text-gray-800">
    Cantos Disponibles
  </h2>

  <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

  {songs.map((song) => (
    <div
      key={song.id}
      className="bg-white shadow-lg rounded-2xl p-6 text-center border border-purple-100"
    >
      <h3 className="text-xl font-semibold mb-4">
        {song.category}
      </h3>

      <p className="text-gray-600 mb-6">
        {song.title}
      </p>

      <button
        onClick={() => {
          setSelectedSong(song);
          setOpen(true);
        }}
        className="inline-block px-6 py-2 border border-purple-400 text-purple-600 rounded-full hover:bg-purple-100 transition"
      >
        Descargar
      </button>
    </div>
  ))}

</div>
</section>
{/* Sección Donativo Voluntario */}
<section className="relative py-20 px-6 bg-gradient-to-b from-white to-purple-50 text-center">

  <h2 className="text-3xl font-semibold text-gray-800 mb-6">
    Apoya este Ministerio
  </h2>

  <p className="max-w-2xl mx-auto text-gray-600 mb-8">
  Cada donativo, grande o pequeño, ayuda a que este proyecto continúe.
Los donativos a
Cantos del Cielo
nos permiten seguir compartiendo música que acerque a más personas a Dios.
Con tu apoyo podremos:
• Colaborar con retiros y encuentros de jóvenes
• Apoyar eventos parroquiales y momentos de oración
• Crear y grabar nuevos cantos
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
  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 text-black font-medium hover:scale-105 transition-transform duration-300 shadow-md"
>
  Hacer Donatiivo
</button>

</section>

      </div>
      {open && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

      {/* Botón cerrar */}
      <button
        onClick={() => setOpen(false)}
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
  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-300 to-purple-400 text-black font-medium hover:scale-105 transition-transform duration-300 shadow-md"
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

</div>

<footer className="mt-32 bg-white border-t border-purple-200">

  <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 text-center md:text-left">

    {/* Ministerio */}
    <div>
      <h3 className="text-xl text-purple-700 mb-4 font-light">
        Voces en Armonía
      </h3>

      <p className="text-gray-600 leading-relaxed">
        Ministerio dedicado a compartir música litúrgica para acompañar la
        oración y las celebraciones de la Iglesia.
      </p>
    </div>

    {/* Redes sociales */}
    <div>
      <h3 className="text-xl text-purple-700 mb-4 font-light">
        Síguenos
      </h3>

      <div className="flex justify-center md:justify-start gap-6 text-gray-600">

        <a
          href="https://www.instagram.com/cantos.del.cielo?igsh=emdldzBmN2xtN3Jv&utm_source=qr"
          target="_blank"
          className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition"
          >
          <Facebook className="w-5 h-5 text-purple-700" />
          </a>

        <a
          href="https://www.instagram.com/cantos.del.cielo?igsh=emdldzBmN2xtN3Jv&utm_source=qr"
          target="_blank"
          className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition"
          >
          <Instagram className="w-5 h-5 text-purple-700" />
          </a>

        <a
    href="https://www.tiktok.com/@cantos.del.cielo"
    target="_blank"
className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition"
>
<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
className="w-5 h-5 fill-purple-700"
>
<path d="M12.5 2c.3 2.2 1.8 4 4 4.5v3.1c-1.4-.1-2.8-.6-4-1.4v6.4c0 3.5-2.8 6.4-6.4 6.4S-.3 18.1-.3 14.6s2.8-6.4 6.4-6.4c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.8 0-3.2 1.4-3.2 3.2S4.3 18 6.1 18s3.2-1.4 3.2-3.2V2h3.2z"/>
</svg>
  </a>


        <a
          href="https://www.youtube.com/@Cantosdelcielo-dn"
          target="_blank"
className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition"
>
<Youtube className="w-5 h-5 text-purple-700" />
</a>

      </div>
    </div>

    {/* Frase */}
    <div>
      <h3 className="text-xl text-purple-700 mb-4 font-light">
        Inspiración
      </h3>

      <p className="text-gray-600 italic">
        "El que canta ora dos veces."
      </p>

      <p className="text-gray-400 text-sm mt-2">
        — San Agustín
      </p>
    </div>

  </div>

  {/* Línea inferior */}
  <div className="border-t border-purple-100 text-center py-6 text-gray-400 text-sm">

    © {new Date().getFullYear()} Voces en Armonía — Ministerio de Música

  </div>

</footer>

    </main>
  );
}