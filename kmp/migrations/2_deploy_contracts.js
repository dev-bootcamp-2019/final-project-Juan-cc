var KMP = artifacts.require("KMP");
var Owned = artifacts.require("Owned");
var BCFactory = artifacts.require("BCFactory");
var TokenFactory = artifacts.require("TokenFactory");
var KMToken = artifacts.require("KMToken");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Owned);
  deployer.deploy(BCFactory);
  deployer.deploy(TokenFactory);
  deployer.deploy(KMToken, "0x31b98d14007bdee637298086988a0bbd31184523", accounts[0], "Tokenizer", "TKN", 1000);
  deployer.deploy(KMP);
  deployer.then(async () => {
    var instance = await KMP.deployed();
    await instance.setup(BCFactory.address, TokenFactory.address);
  }); 

};