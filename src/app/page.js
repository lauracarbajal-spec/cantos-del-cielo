"use client";
import { useState } from "react";
export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <main className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">

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
          VOCES EN ARMONÍA
        </p>

        <h1 className="text-6xl tracking-wide font-semibold text-gray-900 mb-4">
          Cantos del Cielo
        </h1>

        <p className="text-2xl italic text-purple-600 mb-6">
          Daniela y Nataly
        </p>

        <p className="tracking-[0.3em] text-gray-600 mt-6">
          CORO CATÓLICO
        </p>

        <button className="mt-10 px-8 py-3 border border-yellow-400 text-yellow-600 rounded-full hover:bg-yellow-100 transition">
          Ver Cantos
        </button>
        {/* Sección de PDFs */}
<section className="relative mt-32 px-10 pb-20">
  <h2 className="text-4xl text-center font-semibold mb-12 text-gray-800">
    Cantos Disponibles
  </h2>

  <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

    {/* Tarjeta PDF */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-purple-100">
      <h3 className="text-xl font-semibold mb-4">Canto de Entrada</h3>
      <p className="text-gray-600 mb-6">Partitura para coro</p>
      <button
  onClick={() => setOpen(true)}
  className="inline-block px-6 py-2 border border-yellow-400 text-yellow-600 rounded-full hover:bg-yellow-100 transition"
>
  Descargar
</button>
    </div>

    <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-purple-100">
      <h3 className="text-xl font-semibold mb-4">Canto de Comunión</h3>
      <p className="text-gray-600 mb-6">Arreglo coral</p>
      <button
  onClick={() => setOpen(true)}
  className="inline-block px-6 py-2 border border-yellow-400 text-yellow-600 rounded-full hover:bg-yellow-100 transition"
>
  Descargar
</button>
    </div>

  </div>
</section>
{/* Sección Donativo Voluntario */}
<section className="relative py-20 px-6 bg-gradient-to-b from-white to-purple-50 text-center">

  <h2 className="text-3xl font-semibold text-gray-800 mb-6">
    Apoya este Ministerio
  </h2>

  <p className="max-w-2xl mx-auto text-gray-600 mb-8">
    Todos los cantos pueden descargarse gratuitamente.  
    Si deseas apoyar este proyecto y ayudarnos a seguir compartiendo música que eleva el alma,
    puedes hacer un donativo voluntario.
  </p>

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
          href="/pdfs/canto-ejemplo.pdf"
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
    </main>
  );
}