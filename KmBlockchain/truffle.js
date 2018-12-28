module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  solc: { optimizer: { enabled: true, runs: 200 } },

  networks: {

    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
     // gas: 9000000,
     // gasLimit: 900000000
    },

    develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id
      accounts: 3,
      defaultEtherBalance: 500
    }
  }
};
