const env = {
    PORT: process.env.PORT ?? 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '8h'
}

if (!env.JWT_SECRET) {
    throw new Error('Falta JWT_SECRET en el archivo .env')
}

module.exports = { env }
