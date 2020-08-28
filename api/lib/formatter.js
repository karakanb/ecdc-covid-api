module.exports = {
  calculateCaseDeathRatesPer100kForLastNDays: (rows, days) => {
    let totalCaseCount = 0;
    let totalDeathCount = 0;

    for (let index = 0; index < days; index++) {
      const row = rows[index];
      totalCaseCount += parseInt(row.cases);
      totalDeathCount += parseInt(row.deaths);
    }

    const population = rows[0].popData2019;
    if (!population || population === 0) {
      return {
        cases: -1000,
        deaths: -1000,
      }
    }

    return {
      cases: parseFloat((totalCaseCount * 100000 / population).toFixed(4)),
      deaths: parseFloat((totalDeathCount * 100000 / population).toFixed(4)),
    }
  }
} 
