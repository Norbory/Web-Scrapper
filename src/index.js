const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Configurar CORS para permitir todas las solicitudes
app.use(cors())

// Limitar las solicitudes a 20 por minuto
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20 // limit each IP to 20 requests per windowMs
})

//  apply to all requests
app.use(limiter)

module.exports = app
