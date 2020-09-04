const express = require('express')
const { caseDeathDataForAllCountries, caseDeathRatesByCountry, caseDeathRatesPer100kForLastNDays } = require('../ecdc')
const ratesRouter = express.Router()

ratesRouter.post('/day', async (request, response) => {
    const { days } = request.body
    try {
        const cases = await caseDeathRatesPer100kForLastNDays({days})
        response.send(cases)
    } catch (error) {
        response.sendStatus(500)
        response.send(error)
    }
})

ratesRouter.post('/country', async (request, response) => {
    const { country } = request.body
    try {
        const cases = await caseDeathRatesByCountry({country})
        response.send(cases)
    } catch (error) {
        response.sendStatus(500)
        response.send(error)
    }
})

ratesRouter.get('/all', async (request, response) => {
    try {
        const cases = await caseDeathDataForAllCountries()
        response.send(cases)
    } catch (error) {
        response.sendStatus(500)
        response.send(error)
    }
})

module.exports = { ratesRouter }


