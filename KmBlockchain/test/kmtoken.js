var KMToken = artifacts.require("./KMToken.sol");

contract('KMToken', function(accounts) {

  it("...should transfer 10 tokens.", function() {
    return KMToken.deployed().then(function(instance) {
      tokenInstance = instance;

      return tokenInstance.transfer(accounts[1],10, {from: accounts[0]});
    }).then(function() {
      return tokenInstance.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance, 10, "The transfer for 10 tokens failed.");
    });
  });

  it("...should transfer 10 more tokens.", function() {
    return KMToken.deployed().then(function(instance) {
      tokenInstance = instance;

      return tokenInstance.transfer(accounts[1],10, {from: accounts[0]});
    }).then(function() {
      return tokenInstance.balanceOf.call(accounts[1]);
    }).then(function(balance) {
      assert.equal(balance, 20, "The transfer for 10 tokens failed.");
    });
  });

  it("...should error transferring from another account.", async() => {
      let tokenInstance = await KMToken.deployed();
      try {
        await tokenInstance.transfer(accounts[1],10, {from: accounts[2]});
      } catch (e){
        return true;
      }
      throw new Error("I should never see this!")
    });


 
});
