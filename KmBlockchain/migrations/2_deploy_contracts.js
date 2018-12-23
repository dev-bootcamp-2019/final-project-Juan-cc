var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var KMP = artifacts.require("./KMP.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(KMP);

};
