const { Config } = require('./Config')
const fetch = require('node-fetch')
const pickBy = require('lodash.pickby')
const qs = require('query-string')

class Request {
  /**
   * @param {Config} config
   */
  constructor (config) {
    if (!(config instanceof Config)) {
      throw new Error('config must be a instanceof Config')
    }

    this.config = config
  }

  /**
   * execute request on stream codes server
   *
   * @param {string} [action]
   * @param {{ [ key: string ]: string }} [filter]
   * @returns {Promise<any>}
   */
  execute (action, filter) {
    const { username, password } = this.config
    const query = pickBy({ auth: { username, password }, action, ...filter })

    return fetch(`${this.config.baseUrl}/player_api.php?${qs.stringify(query)}`)
      .then(response => {
        if (!response.ok) {
          return Promise.reject(new Error(`Response status ${response.status}`))
        }

        const contentType = response.headers.get('content-type')

        if (!contentType || contentType.indexOf('application/json') === -1) {
          return Promise.reject(new Error('Response is not json'))
        }

        return response.json()
      })
      .then(data => {
        if (action && data.hasOwnProperty('user') &&
          data.user.hasOwnProperty('status') &&
          data.user_info.status === 'Disabled') {
          return Promise.reject(new Error('account disabled'))
        }

        return data
      })
  }
}

module.exports = { Request }
