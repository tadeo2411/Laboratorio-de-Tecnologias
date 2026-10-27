import express from 'express'
import cors  from 'cors'
import notfound from './middlewares/notFound.js'
import errorHandler from './middlewares/errorHandler.js'
import clientesRoutes  from './modules/clientes/clientes.routes.js'
import repuestosRoutes from "./modules/repuestos/repuestos.routes.js"
import authRoutes from './modules/auth/auth.routes.js'
import ordenesRoutes from './modules/ordenes/ordenes.routes.js'
import vehiculosRoutes from './modules/vehiculos/vehiculos.routes.js'
import trabajosRoutes from "./modules/trabajos/trabajos.routes.js"
import tablerosRoutes from './modules/tableros/tableros.routes.js'
import { corsOptions } from './config/cors.js';

const app = express()


app.use(cors(corsOptions));
app.use(express.json())
app.use('/api/clientes', clientesRoutes)
app.use('/api/repuestos', repuestosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/ordenes', ordenesRoutes)
app.use('/api/vehiculos', vehiculosRoutes)
app.use('/api/trabajos', trabajosRoutes)
app.use('/api/tableros', tablerosRoutes)

app.get('/api/health', (req, res) => {
  res.json({"estado":"ok"})
})

app.use(notfound)
app.use(errorHandler)

export default app
