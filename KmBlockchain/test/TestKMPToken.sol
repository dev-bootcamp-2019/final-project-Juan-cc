pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/KMP.sol";
import "../contracts/BC.sol";
import "../contracts/KMToken.sol";
import "../contracts/ThrowProxy.sol";


contract TestKMPToken {

    uint public initialBalance = 50 ether;

    // Global variables
    KMP kmp;
    BC bc;
    KMToken token;

    // Global constants
    address constant SOME_ADDRESS = 0xdA35deE8EDDeAA556e4c26268463e26FB91ff74f;
    uint256 constant TOTAL_SUPPLY = 1000;
    

    function beforeAll() public {
        kmp = KMP(DeployedAddresses.KMP());
        bc = kmp.createBCCompany("Global Company Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        token = kmp.createTokenForBCCompany(address(bc), "Tokenzito", "TKZT", TOTAL_SUPPLY);
    }

    function testCreateBC() public {
        string memory companyName = "Some  Name";
        BC newBc = kmp.createBCCompany(companyName, "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        Assert.equal(newBc.name(), companyName, "Company name is incorrect.");
    }
    
    
    function testCreateToken() public{
        KMToken aToken = kmp.createTokenForBCCompany(address(bc), "AnotherToken", "ATK", TOTAL_SUPPLY);
        Assert.notEqual(address(aToken), address(token), "New token should have been created.");
        Assert.equal(aToken.totalSupply(), TOTAL_SUPPLY, "Total supply is incorrect");
    }
    

    function testGetUserTokenBalance() public{
        uint256 userBalance = kmp.getUserTokenBalance(address(bc), address(token), address(this));
        Assert.equal(userBalance, TOTAL_SUPPLY, "User token balance incorrect");
    }

    function testGetUserTokenZeroBalance() public{
        uint256 userBalance = kmp.getUserTokenBalance(address(bc), address(token), SOME_ADDRESS);
        Assert.equal(userBalance, 0, "User token balance incorrect");
    }

    function testTokenInBC() public {
        bool result = kmp.tokenInBC(address(bc), address(token));
        Assert.isTrue(result, "Token not found.");
        address nonExistentToken = 0xFC18Cbc391dE84dbd87dB83B20935D3e89F5dd91;
        result = kmp.tokenInBC(address(bc), address(nonExistentToken));
        Assert.isFalse(result, "Non-Existent Token was found, but shouldn't.");
    }

    function testFindBCOwner() public {
        address owner = kmp.findBCownerUtil(address(bc));
        Assert.equal(owner, bc.owner(), "BC owner found not correct.");
    }

    function testFindBCOwnerNotPresent() public {
        bytes memory payload = abi.encodeWithSignature("findBCownerUtil(address)", SOME_ADDRESS);
        (bool result,) = address(kmp).call(payload);
        Assert.isFalse(result, "Exception was expected finding BC owner.");
    }

   /* function testFindBCOwnerNotFoundProxy() public {
        ThrowProxy proxy = new ThrowProxy(address(kmp)); 
        kmp.modifyOwner(address(proxy));
        KMP(address(proxy)).findBCownerUtil(address(bc));
        bool r = proxy.execute.gas(8000000000)(); 
        Assert.isTrue(r, "Should be true!");
    } */

    function testFindBCOwnerNotFound() public {
        bytes memory payload = abi.encodeWithSignature("findBCownerUtil(address)", SOME_ADDRESS);
        (bool result, ) = address(kmp).call(payload);
        Assert.isFalse(result, "Onwer found while we shouldn't find this fake owner.");
    } 

    function testKmpOwner() public {
        Assert.equal(address(kmp.owner()), address(0xA5997F29f13E85d34C7112ff92cC113cE62FFAD4), "Kmp owner is not Test contract, it's accounts[0].");
    }

}


