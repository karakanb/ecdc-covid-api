# ECDC API - Number of Covid Cases and Deaths

This is a simple project that renders the latest information from the [European Centre for Disease Prevention and Control](https://opendata.ecdc.europa.eu/covid19/casedistribution/) website.

## API

**Case and Death Rates by Last N Days**
----
  Returns json data about number of cases and deaths last N days per 100k population for all the countries .

* **URL**
```
  /api/rates/day
```
* **Method:**
```
  POST
``` 
* **Data Params**
```json
    {
        "days":[7, 14]
    }
```
* **Response:**

```json
[
    { 
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
    },
    {
        "dateRep": "2020-09-04T09:00:00.000Z",
        "country": "Guam",
        "cases": {
            "7": 196.0609,
            "14": 511.671
        },
        "deaths": {
            "7": 1.7932,
            "14": 4.1842
        }
    }
]
```

* **Sample Call:**

```javascript
    fetch('/api/rates/day', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({days:[7, 4]})
    })
```

**Case and Death Number by Country**
----
  Returns json  detailed data about given country .

* **URL**
```
  /api/rates/country
```
* **Method:**
```
  POST
``` 
* **Data Params**
```json
    {
        "country": "Albania"
    }
```
* **Response:**

```json
[
    {
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
    },
    {
        "dateRep": "03/09/2020",
        "day": "3",
        "month": "9",
        "year": "2020",
        "cases": "122",
        "deaths": "6",
        "countriesAndTerritories": "Albania",
        "geoId": "AL",
        "countryterritoryCode": "ALB",
        "popData2019": "2862427",
        "continentExp": "Europe",
        "Cumulative_number_for_14_days_of_COVID-19_cases_per_100000": "66.93620484"
    }
]
```

* **Sample Call:**

```javascript
    fetch('/api/rates/country', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({country:"Albania"})
    })
```

## Website
[Demo can be found here.](https://ecdc-covid-cases.vercel.app/)