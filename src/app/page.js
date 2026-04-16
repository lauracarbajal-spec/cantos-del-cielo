"use client";
import Image from "next/image";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
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
    <main className="relative min-h-screen flex flex-col bg-[#8799B6] px-6 py-3 sm:py-2 overflow-hidden">

<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none"></div>

<div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white opacity-30 blur-3xl rounded-full"></div>

<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white opacity-20 blur-3xl rounded-full"></div>
<div className="flex-grow">
      {/* Nube superior izquierda */}
<div className="cloud absolute -top-20 -left-20 w-[500px] h-[500px] bg-white opacity-20 rounded-full opacity-40 blur-3xl pointer-events-none"></div>

{/* Nube superior derecha */}
<div className="cloud-slow absolute pointer-events-none top-0 right-0 w-[400px] h-[400px] bg-white opacity-20 rounded-full opacity-40 blur-3xl"></div>

{/* Nube inferior */}
<div className="cloud absolute pointer-events-none bottom-0 left-1/3 w-[600px] h-[400px] bg-white opacity-10 rounded-full opacity-50 blur-3xl"></div>

{/* Rayo tipo lluvia divina */}
<div className="relative mb-6 pointer-events-none">

  {/* Lluvia divina */}
  <div className="divine-rain pointer-events-none" style={{ left: "45%", animationDelay: "0s" }}></div>
  <div className="divine-rain pointer-events-none" style={{ left: "50%", animationDelay: "0.5s" }}></div>
  <div className="divine-rain pointer-events-none" style={{ left: "55%", animationDelay: "1s" }}></div>
{/* Imagen del coro */}


<div className="relative w-full h-64 sm:h-80 md:h-[500px] rounded-3xl overflow-hidden pointer-events-none">
  <Image
    src="/1-14.png"
    alt="Coro"
    fill
    className="object-contain pointer-events-none"
  />
</div>
 

</div>

     
        <section className="max-w-6xl mx-auto mt-20 mb-20 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-center">

{/* Imagen del coro */}
<div className="relative w-full h-64 sm:h-80 md:h-[500px] rounded-3xl overflow-hidden">

  <Image
    src="/coro.jpg"
    alt="Coro Voces en Armonía"
    fill
    className="object-contain"
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
<section className="relative mt-32 px-4 sm:px-6 md:px-10 pb-20">
  
<h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-semibold mb-12 text-white">
    Cantos Disponibles
  </h2>

  <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

  {songs.map((song) => (
   <div
   key={song.id}
   className="glass card-hover p-4 sm:p-6 text-center transition duration-300"
 >
   <h3 className="text-xl font-semibold mb-4 text-white drop-shadow-md">
     {song.category}
   </h3>
 
   <p className="text-white/80 mb-6">
     {song.title}
   </p>
 
   <button
  onClick={() => {
    console.log("click OK");
    setSelectedSong(song);
    setOpen(true);
  }}
  className="px-6 py-3 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 transition select-none"
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
  className="px-6 py-3 sm:py-2 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 transition shadow-lg">
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

  <button className="btn"
  onClick={async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  }}
  className="px-6 py-3 sm:py-2 rounded-full bg-white text-[#5a6d8c] font-medium hover:scale-105 transition shadow-lg">
  Hacer Donatiivo
</button>

</section>

      </div>
  {/* MODAL PREMIUM */}
  {open && selectedSong && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-10 max-w-md w-[90%] text-center shadow-2xl"
          >

            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-light text-[#5a6d8c] mb-4">
              {selectedSong.title}
            </h3>

            <p className="text-gray-600 text-sm mb-8">
              Puedes descargar este canto gratuitamente.
              Si deseas apoyar este ministerio, puedes hacer un donativo.
            </p>

            <div className="flex flex-col gap-4">

              <a
                href={selectedSong.pdf_url}
                target="_blank"
                className="px-6 py-3 rounded-full border border-[#8799B6] text-[#5a6d8c] hover:bg-[#8799B6]/20 transition"
              >
                Descargar Gratis
              </a>

              <button
                className="px-6 py-3 rounded-full
                bg-gradient-to-r from-[#8799B6] to-[#5a6d8c]
                text-white
                hover:scale-105
                transition"
              
                  onClick={async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
    });

    const data = await res.json();
    window.location.href = data.url;
  }}>
                Hacer Donativo
              </button>

            </div>

          </motion.div>
        </div>
      )}


<footer className="mt-24 relative bg-gradient-to-b from-[#8799B6]/20 to-white border-t border-white/40 backdrop-blur-xl">

  {/* Glow superior elegante */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-white/40 blur-3xl rounded-full opacity-40"></div>

  <div className="relative max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

    {/* LOGO + MARCA */}
    <div className="flex flex-col items-center md:items-start">
    <div className="relative w-50 h-30 mb-4 flex items-center justify-center">

        {/* Aura */}
        
        <Image
          src="/1-14.png"
          alt="Cantos del Cielo"
          fill
          className="object-contain"
        />
      </div>

      
    </div>


    {/* MINISTERIO */}
    <div>
      <h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
        Ministerio
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        Compartimos música litúrgica que acompaña la oración, la paz interior y
        la conexión espiritual en cada celebración.
      </p>
    </div>


    {/* REDES */}
    <div>
      <h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
        Conecta
      </h3>

      <div className="flex gap-4">

        <a
          href="#"
          className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
        >
          <Facebook className="w-5 h-5 text-[#5a6d8c]" />
        </a>

        <a
          href="https://www.instagram.com/cantos.del.cielo"
          target="_blank"
          className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
        >
          <Instagram className="w-5 h-5 text-[#5a6d8c]" />
        </a>

        <a
          href="https://www.tiktok.com/@cantos.del.cielo"
          target="_blank"
          className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-[#5a6d8c]"
          >
            <path d="M12.5 2c.3 2.2 1.8 4 4 4.5v3.1c-1.4-.1-2.8-.6-4-1.4v6.4c0 3.5-2.8 6.4-6.4 6.4S-.3 18.1-.3 14.6s2.8-6.4 6.4-6.4c.3 0 .6 0 .9.1v3.2c-.3-.1-.6-.1-.9-.1-1.8 0-3.2 1.4-3.2 3.2S4.3 18 6.1 18s3.2-1.4 3.2-3.2V2h3.2z"/>
          </svg>
        </a>

        <a
          href="https://www.youtube.com/@Cantosdelcielo-dn"
          target="_blank"
          className="p-3 rounded-full bg-white/70 backdrop-blur shadow-md hover:scale-110 hover:shadow-lg transition"
        >
          <Youtube className="w-5 h-5 text-[#5a6d8c]" />
        </a>

      </div>
    </div>


    {/* FRASE */}
    <div>
      <h3 className="text-[#5a6d8c] font-semibold mb-4 tracking-wide">
        Inspiración
      </h3>

      <p className="text-gray-600 italic text-sm leading-relaxed">
        "El que canta ora dos veces."
      </p>

      <p className="text-gray-400 text-xs mt-2">
        — San Agustín
      </p>
    </div>

  </div>


  {/* LÍNEA INFERIOR PREMIUM */}
  <div className="relative border-t border-white/40 py-6 text-center">

    {/* Línea decorativa */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-[#8799B6] to-transparent"></div>

    <p className="text-gray-400 text-sm mt-2">
      © {new Date().getFullYear()} Cantos del Cielo — Coro católico
    </p>

  </div>

</footer>

  </main>
  );
}