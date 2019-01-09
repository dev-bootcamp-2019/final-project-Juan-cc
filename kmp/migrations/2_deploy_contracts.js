var KMP = artifacts.require("KMP");
var Owned = artifacts.require("Owned");
var BCFactory = artifacts.require("BCFactory");
var KMToken = artifacts.require("KMToken");

module.exports = function(deployer) {
  deployer.deploy(KMP); 
  deployer.deploy(Owned);
  deployer.deploy(BCFactory);
  deployer.deploy(KMToken, "0x31b98d14007bdee637298086988a0bbd31184523", "0xA5997F29f13E85d34C7112ff92cC113cE62FFAD4", "Tokenizer", "TKN", 1000);
};