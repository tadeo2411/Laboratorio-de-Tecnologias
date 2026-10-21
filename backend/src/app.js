import express from 'express'
import cors from 'cors'

import router  from'./modules/clientes/clientes.routes.js'
import repuestosRoutes from "./modules/repuestos/repuestos.routes.js";

const app = express();

app.use(cors())
app.use(express.json())
app.use('/api/clientes', router)
app.use('/api/repuestos', repuestosRoutes)

app.get('/api/health', (req, res) => {

  res.json({"estado":"ok"})
})



export default app
