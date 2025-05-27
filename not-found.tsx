// app/not-found.tsx
import Link from 'next/link';
// NO importes getSupabaseBrowserClient aquí directamente
// Si necesitas datos de Supabase, debería ser con un cliente de servidor
// o la página debería ser completamente estática.

// Ejemplo: Si quisieras obtener algo de Supabase (ej. un mensaje de error dinámico)
// Deberías usar el createGenericSupabaseServerClient o similar, pero esto
// haría la página dinámica o necesitaría generar estos datos en tiempo de build.
// Para una página not-found, es mejor mantenerla simple.

// async function getNotFoundData() {
//   if (process.env.IS_BUILD_PROCESS) { // Intenta detectar si estás en build
//     return { customMessage: "Contenido no disponible en este momento." }
//   }
//   try {
//     const supabase = createGenericSupabaseServerClient(); // O createSupabaseServerClient si es una ruta dinámica
//     // const { data } = await supabase.from('configs').select('not_found_message').single();
//     // return data;
//     return { customMessage: "Algo salió mal al buscar esta página." }; // Placeholder
//   } catch (error) {
//     console.error("Error fetching data for not-found page:", error);
//     return { customMessage: "Página no encontrada." };
//   }
// }

export default async function NotFound() {
  // const data = await getNotFoundData(); // Si necesitas datos del servidor

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      {/* <p>{data?.customMessage}</p> */}
      <Link href="/">
        Volver al Inicio
      </Link>
    </div>
  );
}
