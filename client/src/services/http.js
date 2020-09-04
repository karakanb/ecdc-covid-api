const baseUrl = 'http://localhost:3333/api/'

class Http {
  static async request (method, url, data) {
    try {
      const response = await fetch(baseUrl + url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return await response.json()
    } catch (error) {
      console.error(error)
    }
  }
}

export default Http
