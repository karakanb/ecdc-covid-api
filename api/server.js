const express = require('express')
const bodyParser = require('body-parser')
const { ratesRouter } = require('./routes')

const PORT = 3333
const app = express()

/*
    JSON Parse Middleware
*/

app.use(bodyParser.json())

/*
    CORS Middleware
*/

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Credentials', true)
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    response.setHeader('Cache-Control', 'max-age=0, s-maxage=10800')
    next()
})

/*
    Routes
*/

app.use('/api/rates', ratesRouter)

app.listen(PORT, () => {
    console.info(`Started at ${PORT}`)
})