import express from'express'
import cors  from'cors'
import notfound from './middlewares/notFound.js'
import errorHandler from './middlewares/errorHandler.js'
import router  from './modules/clientes/clientes.routes.js'
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/clientes', router)

app.get('/api/health', (req, res) => {

  res.json({"estado":"ok"})
})


app.use(notfound)
app.use(errorHandler)

export default app
