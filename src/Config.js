class Config {
  /**
   * @param {{ username: string, password: string, baseUrl: string }} options
   */
  constructor (options) {
    const { username, password, baseUrl } = options
    this.username = username
    this.password = password
    this.baseUrl = baseUrl
  }
}

module.exports = { Config }
