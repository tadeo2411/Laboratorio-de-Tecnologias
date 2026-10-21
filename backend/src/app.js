const express =require('express')
const cors = require('cors')
const ruta = './data/clientes-copy.json'
const fs = require('fs')
const router = require('./modules/clientes/clientes.routes')
const authRouter = require('./modules/auth/auth.routes')
const ordenesRouter = require('./modules/ordenes/ordenes.routes')
const { notFound } = require('./middlewares/notFound')
const { errorHandler } = require('./middlewares/errorHandler')
const app = express()


app.use(cors())
app.use(express.json())
app.use('/api/clientes', router)
app.use('/api/auth', authRouter)
app.use('/api/ordenes', ordenesRouter)

app.get('/api/health', (req, res) => {

  res.json({"estado":"ok"})
})

app.use(notFound)
app.use(errorHandler)


module.exports = app
