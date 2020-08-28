const parse = require('csv-parse')
const got = require('got');
const formatter = require('./lib/formatter');
const validator = require('./lib/validator');


const CSV_URL = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv"

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const formatRowsIntoResponse = (rows) => {
  const countries = {}
  const rawCountryData = {}
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (!validator.isRowValid(row)) {
      continue;
    }

    let rowCountry = row.countriesAndTerritories;
    rowCountry = rowCountry.replace(/_/g, " ")

    // initialize the country information
    if (!(rowCountry in rawCountryData)) {
      rawCountryData[rowCountry] = []
    }
    rawCountryData[rowCountry].push(row);

    // initialize the country information
    if (!(rowCountry in countries)) {
      countries[rowCountry] = {
        dateRep: null,
        country: rowCountry
      }
    }

    // if the latest data found, update the previous one.
    const rowDate = new Date(parseInt(row.year), parseInt(row.month) - 1, parseInt(row.day), 12, 0, 0, 0);
    if (!countries[rowCountry].dateRep || rowDate > countries[rowCountry].dateRep) {
      countries[rowCountry] = {
        dateRep: rowDate,
        country: rowCountry
      }
    }
  }

  for (const country in rawCountryData) {
    const stats7Days = formatter.calculateCaseDeathRatesPer100kForLastNDays(rawCountryData[country], 7);
    const stats14Days = formatter.calculateCaseDeathRatesPer100kForLastNDays(rawCountryData[country], 14);
    
    countries[country].casesPer100kLast7Days = stats7Days.cases;
    countries[country].deathsPer100kLast7Days = stats7Days.deaths;
    countries[country].casesPer100kLast14Days = stats14Days.cases;
    countries[country].deathsPer100kLast14Days = stats14Days.deaths;
  }

  const countryItems = Object.values(countries);
  countryItems.sort((a, b) => {
    return b.casesPer100kLast7Days - a.casesPer100kLast7Days;
  });

  return countryItems;
}

const handler = async (req, res) => {
  try {
    const response = await got(CSV_URL);
    parse(response.body, { columns: true }, (err, rows) => {
      res.setHeader('Cache-Control', 'max-age=0, s-maxage=10800')
      res.send(formatRowsIntoResponse(rows));
    });
  } catch (error) {
    console.log(error.response.body);
  }
}

module.exports = allowCors(handler)
