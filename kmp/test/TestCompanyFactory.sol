pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CompanyFactory.sol";
import "../contracts/KMP.sol";

contract TestCompanyFactory {
    CompanyFactory.Data private data;

    // Global variables
    CompanyFactory private factory;
    KMP private kmp;

  // Global constants
    address constant SOME_ADDRESS = 0xdA35deE8EDDeAA556e4c26268463e26FB91ff74f;
 
    function beforeAll() public {
        factory = CompanyFactory(DeployedAddresses.CompanyFactory());
        kmp = KMP(DeployedAddresses.KMP());
    }
    
    function testNextCompanyAvailablePositionEmpty() public {
        uint256 position = CompanyFactory.nextCompanyAvailablePositionUtil(data);
        Assert.isZero(position, "The first position available should be Zero.");
    }


    function testCreateBCCompany() public {
        string memory companyName = "Some  Name";
        BC newBc = CompanyFactory.createBCCompany(data, companyName, "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        Assert.equal(newBc.name(), companyName, "Company name is incorrect.");
        uint256 position = CompanyFactory.nextCompanyAvailablePositionUtil(data);
        Assert.equal(position, 1, "The first position available should be 1.");
    }


    function testNextCompanyAvailablePosition1() public {
        uint256 position = CompanyFactory.nextCompanyAvailablePositionUtil(data);
        Assert.equal(position, 1, "We should be in position 1.");

    }

    function testCompleteBCArray() public {
        for (uint8 i = 0; i < kmp.MAX_OWNER_COMPANIES() - 1; i++) {
            CompanyFactory.createBCCompany(data, "Some  Name", string(abi.encode(i)), "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        }
    }

    /*function testCreateBCCompanyMaxLimitException() public {
        bytes memory payload = abi.encodeWithSignature(
            "createBCCompany(string,string,string,string,address)", 
            "Out of Range Name", "123456789", "www.google.com", "did:eth:0x2f3fcf4c3", SOME_ADDRESS);
        (bool result, ) = address(factory).call(payload);
        Assert.isFalse(result, "Company MAX LIMIT not reached.");
    }*/

    function testNextCompanyAvailablePositionMAX() public {
        uint256 position = CompanyFactory.nextCompanyAvailablePositionUtil(data);
        Assert.equal(position, kmp.MAX_OWNER_COMPANIES(), "We should have reached MAX LIMIT (MAX_OWNER_COMPANIES).");
    }


}
