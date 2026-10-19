const express =require('express')
const cors = require('cors')
const ruta = './data/clientes-copy.json'
const fs = require('fs')
const router = require('./modules/clientes/clientes.routes')
const app = express()


app.use(cors())
app.use(express.json())
app.use('/api/clientes', router)

app.get('/api/health', (req, res) => {

  res.json({"estado":"ok"})
})



module.exports = app
