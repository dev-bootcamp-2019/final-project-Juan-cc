var KMToken = artifacts.require("./KMToken.sol");

contract('KMToken', function(accounts) {
  
  let tokenInstance;
  
  beforeEach('setup contract for each test', async function () {
    tokenInstance = await KMToken.deployed();
  });

  it("...should transfer 10 tokens.", async() => {
      await tokenInstance.transfer(accounts[1],10, {from: accounts[0]});
      let balance = await tokenInstance.balanceOf.call(accounts[1]);
      assert.equal(balance, 10, "The transfer for 10 tokens failed.");
  });

  it("...should transfer 10 more tokens.", async() => {
      await tokenInstance.transfer(accounts[1],10, {from: accounts[0]});
      let balance = await tokenInstance.balanceOf.call(accounts[1]);
      assert.equal(balance, 20, "The transfer for 10 tokens failed.");
  });

  it("...should error transferring from another account.", async() => {
      try {
        await tokenInstance.transfer(accounts[1],10, {from: accounts[2]});
      } catch (e){
        return true;
      }
      throw new Error("I should never see this!")
    });


 
});
