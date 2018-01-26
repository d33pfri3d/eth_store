// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 2000000
    },
    azureNetwork: {
      host: "http://ethl7razbwec.eastus.cloudapp.azure.com",
      network_id: 72,
      port: 8545
    }
  }
}
