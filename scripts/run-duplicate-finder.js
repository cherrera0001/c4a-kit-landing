/**
 * Script auxiliar para ejecutar el identificador de duplicados
 */

const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// Verificar si TypeScript está instalado
try {
  console.log("Verificando dependencias...")
  execSync("npx tsc --version", { stdio: "ignore" })
} catch (error) {
  console.log("TypeScript no está instalado. Instalando...")
  execSync("npm install -D typescript ts-node @types/node dotenv", { stdio: "inherit" })
}

// Verificar si el archivo .env existe
const envPath = path.join(process.cwd(), ".env")
if (!fs.existsSync(envPath)) {
  console.log("Archivo .env no encontrado. Creando uno básico...")

  // Solicitar información de Supabase
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  readline.question("Ingrese la URL de Supabase: ", (supabaseUrl) => {
    readline.question("Ingrese la clave de servicio de Supabase: ", (supabaseKey) => {
      const envContent = `SUPABASE_URL=${supabaseUrl}\nSUPABASE_SERVICE_ROLE_KEY=${supabaseKey}\n`
      fs.writeFileSync(envPath, envContent)

      console.log("Archivo .env creado correctamente.")
      readline.close()
      runScript()
    })
  })
} else {
  runScript()
}

function runScript() {
  console.log("Ejecutando script de identificación de duplicados...")
  try {
    execSync("npx ts-node scripts/identify-duplicate-questions.ts", { stdio: "inherit" })
  } catch (error) {
    console.error("Error al ejecutar el script:", error.message)
  }
}
