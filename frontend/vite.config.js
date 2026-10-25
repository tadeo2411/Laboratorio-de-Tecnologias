import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';
// vite-plugin-svgr: permite importar un .svg como componente de React
// (import Icono from './icono.svg?react'). Se usa en FooterGestor para que
// los íconos hereden el color del link (currentColor) y cambien con itemActivo.
import svgr from 'vite-plugin-svgr';
import { readFile } from 'node:fs/promises';

function servirBackend() {
    const carpetaDatos = new URL(
        '../backend/data/',
        import.meta.url
    );

    return {
        name: 'servir-backend',

        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const ruta = req.url?.split('?')[0] ?? '';

                // Acepta archivos JSON directamente dentro de data.
                const coincidencia = ruta.match(
                    /^\/backend\/data\/([a-zA-Z0-9_-]+\.json)$/
                );

                if (!coincidencia) {
                    return next();
                }

                res.setHeader('Content-Type', 'application/json; charset=utf-8');

                if (req.method !== 'GET') {
                    res.statusCode = 405;
                    res.setHeader('Allow', 'GET');
                    return res.end(JSON.stringify({
                        mensaje: 'Solo se permite consultar'
                    }));
                }

                try {
                    const archivo = new URL(coincidencia[1], carpetaDatos);
                    const contenido = await readFile(archivo, 'utf8');

                    res.setHeader('Cache-Control', 'no-store');
                    res.end(contenido);
                } catch (error) {
                    console.error(error);
                    res.statusCode = error.code === 'ENOENT' ? 404 : 500;
                    res.end(JSON.stringify({
                        mensaje: 'No se pudo leer el archivo'
                    }));
                }
            });
        }
    };
}

export default defineConfig({
    plugins: [
        react(),
        svgr(),
        babel({ presets: [reactCompilerPreset()] }),
        servirBackend()
    ]
});