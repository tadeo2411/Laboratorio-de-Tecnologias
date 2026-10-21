const express =require('express')
const cors = require('cors')
const notfound = require ('./middlewares/notFound')
const errorHandler =require('./middlewares/errorHandler')
const router = require('./modules/clientes/clientes.routes')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/clientes', router)

app.get('/api/health', (req, res) => {

  res.json({"estado":"ok"})
})


app.use(notfound)
app.use(errorHandler)

module.exports = app
