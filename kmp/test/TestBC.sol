pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BC.sol";

contract TestBC {

    // Global variables
    BC bc;

    // Global constants
    address constant SOME_ADDRESS = 0xdA35deE8EDDeAA556e4c26268463e26FB91ff74f;
    address constant FAKE_OWNER = 0xD6aE8250b8348C94847280928c79fb3b63cA453e;


    function testCreateBC() public {
        string memory companyName = "Bus Company Name";
        bc = new BC(address(this), companyName, "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        Assert.equal(companyName, bc.name(), "Company not created");
    }
   

    function testModifyBCOwner() public {
        bc = new BC(address(this), "Bus Company Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        bc.modifyOwner(FAKE_OWNER);
        Assert.equal(bc.owner(), FAKE_OWNER, "Owner should be able to terminate company");
    }

    function testModifyBCOwnerException() public {
        bc = new BC(FAKE_OWNER, "Bus Company Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        bytes memory payload = abi.encodeWithSignature("modifyOwner(address)", address(this));
        (bool result, ) = address(bc).call(payload);
        Assert.isFalse(result, "Only the owner can terminate a company");
    }
  
    function testTerminateBCWithException() public {
        bc = new BC(FAKE_OWNER, "Bus Company Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        bytes memory payload = abi.encodeWithSignature("terminateCompany()");
        (bool result, ) = address(bc).call(payload);
        Assert.isFalse(result, "Only owner can terminate company");
    }

    function testTerminateBC() public {
        bc = new BC(address(this), "Bus Company Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        //bytes memory payload = abi.encodeWithSignature("terminateCompany()");
        //(bool result, ) = address(bc).call(payload);
        bc.terminateCompany();
        //Assert.isTrue(result, "Owner should be able to terminate company");
    }
}
