pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/KMP.sol";
import "../contracts/BC.sol";
import "../contracts/KMToken.sol";


contract TestKMPBC {

    // Global variables
    KMP kmp;
    BC bc;
    KMToken token;

    // Global constants
    address constant SOME_ADDRESS = 0xdA35deE8EDDeAA556e4c26268463e26FB91ff74f;
    uint256 constant TOTAL_SUPPLY = 1000;
    

    /*function beforeAll() public {
        kmp = KMP(DeployedAddresses.KMP());
        bc = kmp.createBCCompany("Global Company Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        token = kmp.createTokenForBCCompany(address(bc), "Tokenzito", "TKZT", TOTAL_SUPPLY);
}*/

    /*
    function testCreateMaxBC() public {
        KMP newKmp = new KMP();
        for (uint8 i=0; i < 1; i++){
            newKmp.createBCCompany("Some  Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        }
        
        //Assert.equal(newBc.name(), companyName, "Company name is incorrect.");
    }*/
    
}


// Proxy contract for testing throws
contract ThrowProxy {
    address public target;
    bytes data;

    
    constructor(address _target) public {
        target = _target;
    }

    //prime the data using the fallback function.
    function() external payable {
        data = msg.data;
    }

    function execute() public returns (bool) {
        (bool result,) = target.call(data);
        return result;
    }
}