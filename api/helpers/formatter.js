const { isRowValid } = require('./validator')
const { calculateCaseDeathRatesPer100kForLastNDays } = require('./calculator')

const formatCaseDeathRatesPer100kForLastNDays = (rows, days = [7, 14]) => {
  const countries = {}
  const rawCountryData = {}
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (!isRowValid(row)) {
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
  /* 
    creates case and death number for country for each day in days
    days must be array 
    default value is [7, 14]
  */
  for (const country in rawCountryData) {
    days.forEach(day => {
      const stats = calculateCaseDeathRatesPer100kForLastNDays(rawCountryData[country], day)

      countries[country].cases = {...countries[country].cases, [day]: stats.cases };
      countries[country].deaths = {...countries[country].deaths, [day]: stats.deaths };
    })
  }

  const countryItems = Object.values(countries);
  countryItems.sort((a, b) => {
    /* 
      sort by first property of cases
      ...
      cases: {
        7: 52, <----
        14: 23,
      }
      ...
    */
    return b.cases[Object.keys(b.cases)[0]] - a.cases[Object.keys(a.cases)[0]];
  });

  return countryItems;
}

const filterCaseDeathRatesByCountry = (rows, country) => {
  return rows.filter(row => isRowValid(row) && row.countriesAndTerritories.toLowerCase() === country.toLowerCase())
}


module.exports = { formatCaseDeathRatesPer100kForLastNDays, filterCaseDeathRatesByCountry }
