import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CantosPage() {
  const { data: songs } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div style={{ padding: "40px" }}>
      <h1>Lista de Cantos</h1>

      {songs?.map((song) => (
        <div
          key={song.id}
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>{song.title}</h2>
          <p>Categoría: {song.category}</p>

          <a href={song.pdf_url} target="_blank">
            Ver / Descargar PDF
          </a>
        </div>
      ))}
    </div>
  )
}