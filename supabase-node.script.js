// supabase-node-script.js
require('dotenv').config(); // Carga las variables de entorno desde .env
const { createClient } = require('@supabase/supabase-js');

// Obtener las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// Para operaciones de backend que requieren más permisos:
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Validar que las variables de entorno estén cargadas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Las variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY son requeridas.");
  process.exit(1); // Salir si no están definidas
}

// Crear el cliente de Supabase
// Si usaras la service key para operaciones de backend:
// const supabase = createClient(supabaseUrl, supabaseServiceKey);
// Para este ejemplo, usaremos la anon key, asumiendo que RLS lo permite para 'todos'.
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función asíncrona para obtener los 'todos'
async function getTodos() {
  try {
    // Realizar la consulta a la tabla 'todos'
    const { data, error } = await supabase
      .from('todos') // Asegúrate que el nombre de tu tabla sea 'todos'
      .select();    // Selecciona todas las columnas

    // Manejar errores de la consulta
    if (error) {
      console.error('Error al obtener los todos:', error.message);
      return;
    }

    // Mostrar los datos si la consulta fue exitosa
    if (data) {
      console.log('Todos obtenidos:', data);
    } else {
      console.log('No se encontraron todos o la tabla está vacía.');
    }

  } catch (err) {
    // Manejar otros errores inesperados
    console.error('Error inesperado en la función getTodos:', err);
  }
}

// Ejecutar la función
getTodos();
