// lib/monaco-setup.ts

export function setupMonacoEnvironment() {
  // Asegúrate de que este código se ejecute SOLO en el navegador.
  if (typeof window !== 'undefined') {
    // Solo configura si no ha sido configurado antes para evitar problemas con HMR
    // o múltiples intentos de configuración.
    // Verificamos ambas propiedades (getWorkerUrl y getWorker) para mayor robustez.
    if (!(window as any).MonacoEnvironment?.getWorkerUrl && !(window as any).MonacoEnvironment?.getWorker) {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: function (_moduleId: string, label: string): string {
          // Ruta base donde se encuentran los workers, relativa a la carpeta 'public'.
          // Por lo tanto, los workers deben estar en 'public/monaco-workers/'.
          const workerBasePath = '/monaco-workers/';

          let workerFile = 'editor.worker.js'; // Worker por defecto

          if (label === 'json') {
            workerFile = 'json.worker.js';
          } else if (label === 'css' || label === 'scss' || label === 'less') {
            workerFile = 'css.worker.js';
          } else if (label === 'html' || label === 'handlebars' || label === 'razor') {
            workerFile = 'html.worker.js';
          } else if (label === 'typescript' || label === 'javascript') {
            workerFile = 'ts.worker.js';
          }
          
          const finalWorkerPath = `${workerBasePath}${workerFile}`;
          
          // Descomenta la siguiente línea si necesitas depurar las rutas de los workers que se solicitan:
          // console.log(`[MonacoEnvironment] Solicitando worker: ${label}, Ruta generada: ${finalWorkerPath}`);
          
          return finalWorkerPath;
        },
      };
      // Mensaje de confirmación de que el entorno se ha configurado.
      console.log('[MonacoEnvironment] Entorno de Monaco Editor para workers configurado globalmente.');
      
      // Para probar la URL generada para un worker específico (descomenta si es necesario):
      // console.log('[MonacoEnvironment] Ejemplo de URL para TS worker:', (window as any).MonacoEnvironment.getWorkerUrl('', 'typescript'));
    }
  }
}
