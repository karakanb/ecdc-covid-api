module.exports = {
  /**
   * Validate a given row to see if it is ready to be processed.
   * @param {Object} row 
   * @returns {Boolean}
   */
  isRowValid: (row) => {
    if (!row || !row.dateRep) {
      return false;
    }

    if (!row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] || row['Cumulative_number_for_14_days_of_COVID-19_cases_per_100000'] === "") {
      return false;
    }

    if (!row.dateRep) {
      return false;
    }

    if (!("countriesAndTerritories" in row)) {
      return false;
    }

    let rowCountry = row.countriesAndTerritories;
    if (!rowCountry || rowCountry === "") {
      return false;
    }

    return true;
  }
} 
