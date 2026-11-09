import { env } from './env.js';

const allowedOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());

export const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
};
