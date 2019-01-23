pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/KMP.sol";
import "../contracts/BC.sol";
import "../contracts/KMToken.sol";


contract TestKMP {

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
    
    
    function testCreateToken() public {
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

    function testFindBCOwnerNotFound() public {
        address owner = kmp.findBCownerUtil(address(SOME_ADDRESS));
        Assert.equal(owner, address(0), "We found an owner and we shouldn't.");
    }

    
}


