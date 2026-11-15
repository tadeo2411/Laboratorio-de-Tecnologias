export const env = {
    API_URL: import.meta.env.VITE_API_URL ?? '/api',
    APP_NAME: import.meta.env.VITE_APP_NAME ?? 'Taller 303',
    APP_ENV: import.meta.env.VITE_APP_ENV ?? 'development',
};

// Validaciones
if (!env.API_URL) {
    throw new Error('Falta VITE_API_URL en el archivo .env');
}