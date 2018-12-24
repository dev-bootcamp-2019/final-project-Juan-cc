pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Owned.sol";



contract TestOwned {

    uint public initialBalance = 50 ether;

    // Global variables
    Owned newOwnedInstance;
    Owned deployedOwned;    

  // Global constants
    address constant SOME_ADDRESS = 0xdA35deE8EDDeAA556e4c26268463e26FB91ff74f;
 
    function beforeAll() public {
        deployedOwned = Owned(DeployedAddresses.Owned());
        newOwnedInstance = new Owned();
    }

    function testChangeOwnership() public {
        newOwnedInstance.modifyOwner(SOME_ADDRESS);
        Assert.equal(address(newOwnedInstance.owner()), SOME_ADDRESS, "Owner modification failed.");
    }

    function testChangeOwnershipException() public {
        bytes memory payload = abi.encodeWithSignature("modifyOwner(address)", SOME_ADDRESS);
        (bool result, ) = address(deployedOwned).call(payload);
        Assert.isFalse(result, "Owner modification should fail.");
    }


}
