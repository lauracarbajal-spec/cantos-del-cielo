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
    <main className="relative min-h-screen flex flex-col bg-[#8799B6] px-6 py-20 overflow-hidden">

<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none"></div>

<div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white opacity-30 blur-3xl rounded-full"></div>

<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white opacity-20 blur-3xl rounded-full"></div>
<div className="flex-grow">
      {/* Nube superior izquierda */}
<div className="cloud absolute -top-20 -left-20 w-[500px] h-[500px] bg-white opacity-20 rounded-full opacity-40 blur-3xl"></div>

{/* Nube superior derecha */}
<div className="cloud-slow absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-20 rounded-full opacity-40 blur-3xl"></div>

{/* Nube inferior */}
<div className="cloud absolute bottom-0 left-1/3 w-[600px] h-[400px] bg-white opacity-10 rounded-full opacity-50 blur-3xl"></div>

{/* Rayo tipo lluvia divina */}
<div className="relative mb-6">

  {/* Lluvia divina */}
  <div className="divine-rain" style={{ left: "45%", animationDelay: "0s" }}></div>
  <div className="divine-rain" style={{ left: "50%", animationDelay: "0.5s" }}></div>
  <div className="divine-rain" style={{ left: "55%", animationDelay: "1s" }}></div>
{/* Imagen del coro */}

<div className="relative w-full h-[800px] rounded-3xl overflow-hidden shadow-xl">

  {/* Imagen */}
  <img
    src="/1-14.png"
    alt="Coro Voces en Armonía"
    className="w-full h-full object-cover"
  />


</div>
 

</div>

     
        <section className="max-w-6xl mx-auto mt-20 mb-20 px-6 grid md:grid-cols-2 gap-12 items-center">

{/* Imagen del coro */}
<div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-xl">

  {/* Imagen */}
  <img
    src="/coro.jpg"
    alt="Coro Voces en Armonía"
    className="w-full h-full object-cover"
  />

</div>

{/* Texto */}
<div>

  <h2 className="text-4xl font-semibold text-white tracking-wide drop-shadow-md">
    Quiénes Somos
  </h2>

  <p className="text-white/80 leading-relaxed text-lg text-justify">
  Somos Daniela y Nataly, y creamos Cantos del Cielo como un espacio para compartir música católica que ayude a las personas a acercarse a Dios.
  </p>

  <p className="text-white/80 leading-relaxed text-lg text-justify">
  Aquí encontrarás cantos con letra y acordes, pensados para quienes también sirven al Señor a través de la música en sus parroquias, grupos o momentos de oración.
Cada canto nace con cariño y con el deseo de elevar el corazón al cielo.
  </p>

</div>

</section>


        
        {/* Sección de PDFs */}
<section className="relative mt-32 px-10 pb-20">
  
<h2 className="text-4xl text-center font-semibold mb-12 text-white">
    Cantos Disponibles
  </h2>

  <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

  {songs.map((song) => (
    <div
      key={song.id}
      className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-6 text-center border border-white/40 hover:scale-105 transition"
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
        className="inline-block px-6 py-2 border-[#8799B6] text-[#5a6d8c]  rounded-full hover:bg-[#8799B6]/20 transition"
      >
        Descargar
      </button>
    </div>
    
  ))}

</div>
</section>
<div className="relative py-20 px-6 bg-transparent from-white to-blue-50 text-center">


        <a
  href="/cantos"
  className="px-8 py-3 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 transition shadow-lg">
  Ver todos los cantos
</a>
</div>
{/* Sección Donativo Voluntario */}
<section className="relative py-20 px-6 from-white to-blue-50 text-center">

  <h2 className="text-4xl font-semibold text-white mb-6">
    Apoya este Ministerio
  </h2>

  <div className="max-w-2xl mx-auto text-white/80 text-lg mb-8 ">

  <p className="text-white/80 leading-relaxed text-lg text-justify">
Cada donativo, grande o pequeño, ayuda a que este proyecto continúe.
Los donativos a <strong>Cantos del Cielo</strong> nos permiten seguir
compartiendo música que acerque a más personas a Dios.
Con tu apoyo podremos:
</p>

<ul className="space-y-4 text-justify">

  <li className="flex items-start gap-3">
    <span className="text-white text-xl">✦</span>
    <span >Colaborar con retiros y encuentros de jóvenes.</span>
  </li>

  <li className="flex items-start gap-3">
    <span className="text-white text-xl">✦</span>
    <span>Apoyar eventos parroquiales y momentos de oración.</span>
  </li>

  <li className="flex items-start gap-3">
    <span className="text-white text-xl">✦</span>
    <span>Crear y grabar nuevos cantos.</span>
  </li>

  <li className="flex items-start gap-3">
    <span className="text-white text-xl">✦</span>
    <span>Llevar esta música a más comunidades.</span>
  </li>

</ul>

</div>

  <button
  onClick={async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  }}
  className="px-8 py-3 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 transition shadow-lg">
  Hacer Donatiivo
</button>

</section>

      </div>
      {open && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="relative bg-white/70 backdrop-blur-2xl backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

      {/* Botón cerrar */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white/80 text-xl"
      >
        ✕
      </button>

      <div className="relative mb-6">

{/* Lluvia divina */}
<div className="divine-rain" style={{ left: "45%", animationDelay: "0s" }}></div>
<div className="divine-rain" style={{ left: "50%", animationDelay: "0.5s" }}></div>
<div className="divine-rain" style={{ left: "55%", animationDelay: "1s" }}></div>

      </div>

      <h3 className="text-2xl font-light tracking-wide text-white mb-4">
        Descarga con Amor
      </h3>

      <p className="text-white/80 leading-relaxed text-lg text-justify">
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

      <p className="text-white/80 leading-relaxed text-lg text-justify">
        Gracias por apoyar este proyecto 🙏
      </p>

    </div>
  </div>
)}



<footer className="mt-32 bg-white/80 backdrop-blur-md border-t border-blue-200">

  <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10 text-center md:text-left">

    {/* Ministerio */}
    <div>
      <h3 className="text-xl text-[#5a6d8c] mb-4 font-light">
        Voces en Armonía
      </h3>

      <p className="text-gray-600 leading-relaxed">
        Ministerio dedicado a compartir música litúrgica para acompañar la
        oración y las celebraciones de la Iglesia.
      </p>
    </div>

    {/* Redes sociales */}
    <div>
      <h3 className="text-xl text-[#5a6d8c] mb-4 font-light">
        Síguenos
      </h3>

      <div className="flex justify-center md:justify-start gap-6 text-gray-600">

        <a
          href="https://www.instagram.com/cantos.del.cielo?igsh=emdldzBmN2xtN3Jv&utm_source=qr"
          target="_blank"
          className="p-3 rounded-full bg-white hover:bg-[#8799B6]/20 shadow-md hover:scale-110 transition"
          >
          <Facebook className="w-5 h-5 text-blue-700" />
          </a>

        <a
          href="https://www.instagram.com/cantos.del.cielo?igsh=emdldzBmN2xtN3Jv&utm_source=qr"
          target="_blank"
          className="p-3 rounded-full bg-white hover:bg-[#8799B6]/20 shadow-md hover:scale-110 transition"
          >
          <Instagram className="w-5 h-5 text-blue-700" />
          </a>

        <a
    href="https://www.tiktok.com/@cantos.del.cielo"
    target="_blank"
className="p-3 rounded-full bg-white hover:bg-[#8799B6]/20 shadow-md hover:scale-110 transition"
>
<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
className="w-5 h-5 fill-blue-700"
>
<path d="M12.5 2c.3 2.2 1.8 4 4 4.5v3.1c-1.4-.1-2.8-.6-4-1.4v6.4c0 3.5-2.8 6.4-6.4 6.4S-.3 18.1-.3 14.6s2.8-6.4 6.4-6.4c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.8 0-3.2 1.4-3.2 3.2S4.3 18 6.1 18s3.2-1.4 3.2-3.2V2h3.2z"/>
</svg>
  </a>


        <a
          href="https://www.youtube.com/@Cantosdelcielo-dn"
          target="_blank"
className="p-3 rounded-full bg-white hover:bg-[#8799B6]/20 shadow-md hover:scale-110 transition"
>
<Youtube className="w-5 h-5 text-blue-700" />
</a>

      </div>
    </div>

    {/* Frase */}
    <div>
      <h3 className="text-xl text-[#5a6d8c] mb-4 font-light">
        Inspiración
      </h3>


      <p className="text-gray-600 italic">
        "El que canta ora dos veces."
      </p>

      <p className="text-gray-400 text-sm mt-2">
        — San Agustín
      </p>
    </div>


  {/* Imagen */}
  <img
    src="/1-09.png"
    alt="Coro Voces en Armonía"
    className="w-full h-full object-cover"
  />


  </div>

  {/* Línea inferior */}
  <div className="border-t border-pblue-100 text-center py-6 text-gray-400 text-sm">

    © {new Date().getFullYear()} Voces en Armonía — Ministerio de Música

  </div>

</footer>

    </main>
  );
}