const parse = require('csv-parse')
const got = require('got');

const { formatCaseDeathRatesPer100kForLastNDays, filterCaseDeathRatesByCountry } = require('../helpers/formatter')

const CSV_URL = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv"

/**
 * 
 * @typedef LastNDaysResult
 * @type {Object}
 * @property {string} dataRep
 * @property {string} country
 * @property {Object} cases
 * @property {Object} deaths
 */


/**
 * @name caseDeathRatesPer100kForLastNDays
 * @param {Array} days 
 * @returns {Array<LastNDaysResult>} 
 * @example
 *  { 
      "dateRep": "2020-09-04T09:00:00.000Z", 
      "country": "Aruba", 
      "cases": { 
        "7": 417.6465, 
        "14": 851.284 
      }, 
      "deaths": { 
        "7": 4.7032, 
        "14": 6.5845 
      } 
    }
 */

const caseDeathRatesPer100kForLastNDays = async ({ days }) => {
  try {
    const response = await got(CSV_URL)
    return new Promise((resolve, reject) => {
      parse(response.body, { columns: true }, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(formatCaseDeathRatesPer100kForLastNDays(rows, days))
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * 
 * @typedef ByCountryResult
 * @type {Object}
 * @property {string} dataRep
 * @property {number} day
 * @property {number} month
 * @property {number} year
 * @property {number} cases
 * @property {number} deaths
 * @property {string} countriesAndTerritories
 * @property {string} geoId
 * @property {string} countryterritoryCode
 * @property {number} popData2019
 * @property {string} continentExp
 * @property {number} Cumulative_number_for_14_days_of_COVID-19_cases_per_100000
 */

/**
 * @name caseDeathRatesByCountry
 * @param {string} country 
 * @returns {Array<ByCountryResult>} 
 * @example
 *  { 
      "dateRep": "04/09/2020", 
      "day": "4", 
      "month": "9", 
      "year": "2020", 
      "cases": "116", 
      "deaths": "5", 
      "countriesAndTerritories": "Albania", 
      "geoId": "AL", 
      "countryterritoryCode": "ALB", 
      "popData2019": "2862427", 
      "continentExp": "Europe", 
      "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": "65.57372467" 
    }
 */

const caseDeathRatesByCountry = async ({ country }) => {
  try {
    const response = await got(CSV_URL)
    return new Promise((resolve, reject) => {
      parse(response.body, { columns: true }, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(filterCaseDeathRatesByCountry(rows, country))
        }
      })
    })
  } catch (error) {

  }
}

/**
 * @name caseDeathDataForAllCountries
 * @returns {Array<ByCountryResult>} 
 * @example
 *  { 
      "dateRep": "04/09/2020", 
      "day": "4", 
      "month": "9", 
      "year": "2020", 
      "cases": "116", 
      "deaths": "5", 
      "countriesAndTerritories": "Albania", 
      "geoId": "AL", 
      "countryterritoryCode": "ALB", 
      "popData2019": "2862427", 
      "continentExp": "Europe", 
      "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": "65.57372467" 
    }
 */

const caseDeathDataForAllCountries = async () => {
  try {
    const response = await got(CSV_URL)
    return new Promise((resolve, reject) => {
      parse(response.body, { columns: true }, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  caseDeathRatesPer100kForLastNDays, caseDeathRatesByCountry, caseDeathDataForAllCountries
}