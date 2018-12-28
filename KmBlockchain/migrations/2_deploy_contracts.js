var SimpleStorage = artifacts.require("SimpleStorage");
var KMP = artifacts.require("KMP");
var Owned = artifacts.require("Owned");
var BCFactory = artifacts.require("BCFactory");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(KMP); 
  deployer.deploy(Owned);
  deployer.deploy(BCFactory);

};
