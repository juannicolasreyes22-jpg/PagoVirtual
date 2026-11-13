const SUPABASE_URL = "https://akdfakntfsdwczaevvxu.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_GKZdiiIMez4xXKKadLGTsA_lJXYVbuI";

// Crear conexión
const { createClient } = supabase;

window.supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase conectado correctamente");