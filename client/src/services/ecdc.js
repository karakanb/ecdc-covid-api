import Http from './http'

const urls = {
  days: 'rates/day',
  country: 'rates/country',
  all: 'rates/all'
}

class ECDC extends Http {
  static async fetchCasesByDay (data) {
    return await super.request('POST', urls.days, data)
  }

  static async fetchCasesByCountry (data) {
    return await super.request('POST', urls.country, data)
  }

  static async fetchRawCases () {
    return await super.request('GET', urls.all)
  }
}

export const ecdc = ECDC
