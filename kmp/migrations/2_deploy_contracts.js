var KMP = artifacts.require("KMP");
var Owned = artifacts.require("Owned");
var CompanyFactory = artifacts.require("CompanyFactory");
var TokenFactory = artifacts.require("TokenFactory");
var KMToken = artifacts.require("KMToken");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Owned);
  deployer.deploy(CompanyFactory);
  deployer.link(CompanyFactory, TokenFactory);
  deployer.deploy(TokenFactory);
  deployer.link(CompanyFactory, KMP);
  deployer.link(TokenFactory, KMP);
  deployer.deploy(KMP);
  deployer.deploy(KMToken, "0x31b98d14007bdee637298086988a0bbd31184523", accounts[0], "Tokenizer", "TKN", 1000);

 
};