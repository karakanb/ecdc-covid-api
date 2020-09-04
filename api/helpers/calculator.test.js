const test = require('ava');
const parse = require('csv-parse')

const f = require('./formatter');

const csvExample = `dateRep,day,month,year,cases,deaths,countriesAndTerritories,geoId,countryterritoryCode,popData2019,continentExp,Cumulative_number_for_14_days_of_COVID-19_cases_per_100000
28/08/2020,28,8,2020,3,0,Afghanistan,AF,AFG,38041757,Asia,1.85322671
27/08/2020,27,8,2020,55,4,Afghanistan,AF,AFG,38041757,Asia,2.05300717
26/08/2020,26,8,2020,1,0,Afghanistan,AF,AFG,38041757,Asia,2.10820967
25/08/2020,25,8,2020,71,10,Afghanistan,AF,AFG,38041757,Asia,2.67074941
24/08/2020,24,8,2020,0,0,Afghanistan,AF,AFG,38041757,Asia,2.48411239
23/08/2020,23,8,2020,105,2,Afghanistan,AF,AFG,38041757,Asia,2.48411239
22/08/2020,22,8,2020,38,0,Afghanistan,AF,AFG,38041757,Asia,2.31061883
21/08/2020,21,8,2020,97,2,Afghanistan,AF,AFG,38041757,Asia,2.41576644
20/08/2020,20,8,2020,160,8,Afghanistan,AF,AFG,38041757,Asia,2.26855978
19/08/2020,19,8,2020,0,0,Afghanistan,AF,AFG,38041757,Asia,2.02409158
18/08/2020,18,8,2020,3,0,Afghanistan,AF,AFG,38041757,Asia,2.23964419
17/08/2020,17,8,2020,45,5,Afghanistan,AF,AFG,38041757,Asia,2.32901966
16/08/2020,16,8,2020,120,7,Afghanistan,AF,AFG,38041757,Asia,2.21072859
15/08/2020,15,8,2020,7,0,Afghanistan,AF,AFG,38041757,Asia,1.89528575`;

test('last 14 days rates calculated correctly', t => {
  return new Promise((resolve, reject) => {
    parse(csvExample, { columns: true }, (err, rows) => {
      const stats = f.calculateCaseDeathRatesPer100kForLastNDays(rows, 14);
      resolve(stats)
    });
  }).then((stats) => {
    t.deepEqual(stats, {
      cases: 1.8532,
      deaths: 0.0999
    });
  });
});

test('last 7 days rates calculated correctly', t => {
  return new Promise((resolve, reject) => {
    parse(csvExample, { columns: true }, (err, rows) => {
      const stats = f.calculateCaseDeathRatesPer100kForLastNDays(rows, 7);
      resolve(stats)
    });
  }).then((stats) => {
    t.deepEqual(stats, {
      cases: 0.7176,
      deaths: 0.0421
    });
  });
});