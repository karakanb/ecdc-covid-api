const parse = require('csv-parse')
const got = require('got');

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

const handler = async (req, res) => {
  try {
    const response = await got(CSV_URL);
    parse(response.body, { columns: true }, (err, rows) => {
      const countries = {}
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        if(!row || !row.dateRep) {
          continue;
        }

        if (!row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] || row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] === "") {
          continue;
        }

        if(!row.dateRep) {
          continue;
        }

        if(!("countriesAndTerritories" in row)) {
          continue;
        }

        const rowCountry = row.countriesAndTerritories;
        if (!rowCountry || rowCountry === "") {
          continue
        }
        
        // initialize the country information
        if (!(rowCountry in countries)) {
          countries[rowCountry] = {
            dateRep: null,
            casesPer100k: null,
            country: rowCountry
          }
        }

        if(rowCountry == "Cases_on_an_international_conveyance_Japan") {
          console.log(row);
        }

        // if the latest data found, update the previous one.
        const rowDate = new Date(parseInt(row.year), parseInt(row.month) - 1, parseInt(row.day), 12, 0, 0, 0);
        if (!countries[rowCountry].dateRep || rowDate > countries[rowCountry].dateRep) {
          countries[rowCountry] = {
            dateRep: rowDate,
            casesPer100k: parseFloat(row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000']),
            country: rowCountry
          }
        }
      }

      const countryItems = Object.values(countries);
      countryItems.sort((a, b) => {
        return b.casesPer100k - a.casesPer100k;
      });

      res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600')
      res.send(countryItems);
    });
  } catch (error) {
    console.log(error.response.body);
  }
}

module.exports = allowCors(handler)
