pragma solidity ^0.5.0;

import "./Owned.sol";
import "./KMToken.sol";
import "./TokenFactory.sol";
import "./Storage.sol";


contract BCFactory is Owned, Storage {

   
    function createBCCompany(string calldata _companyName, string calldata _phone, string calldata _url, string calldata _did, address _uPortAddress)
        external 
        returns (BC)
    { 
        uint8 position = nextCompanyAvailablePosition();
        require(MAX_OWNER_COMPANIES > position, "You can't create a new company. Max limit reached (5 companies).");
        BC newCompany = new BC(msg.sender, _companyName, _phone, _url, _did, _uPortAddress);
        companies[msg.sender][position] = address(newCompany);
        return newCompany;
    }
    

    
    function nextCompanyAvailablePosition()
        internal
        view
        returns (uint8)
    {
        address[MAX_OWNER_COMPANIES] memory ownerCompanies = companies[msg.sender];
        for (uint8 i = 0; i < MAX_OWNER_COMPANIES; i++) {
            if (ownerCompanies[i] == EMPTY_ADDRESS){
                return i; // first position available.
            }
        }
       return MAX_OWNER_COMPANIES; // No empty spot available. 
    }

    function nextCompanyAvailablePositionUtil()
        external
        view
        returns (uint8)
    {
        return nextCompanyAvailablePosition();
    }
}