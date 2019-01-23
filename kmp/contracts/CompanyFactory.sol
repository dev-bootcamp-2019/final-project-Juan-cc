pragma solidity ^0.5.0;

import "./BC.sol";
import "./KMToken.sol";

library CompanyFactory {
   
    // Constants
    uint8 constant public MAX_OWNER_COMPANIES = 3; // 1 owner could register up to 3 companies.
    uint8 constant public MAX_COMPANY_TOKENS = 5; // 1 company could register up to 5 tokens.
    address constant public EMPTY_ADDRESS = address(0); 
   
    struct Data {
        mapping (address => address[MAX_OWNER_COMPANIES]) companies; // (owner => companies[3]) 
        mapping (address => address[MAX_COMPANY_TOKENS]) tokens; // (company => token[5]))

    }


    function createBCCompany(Data storage self, string calldata _companyName, string calldata _phone, string calldata _url, string calldata _did, address _uPortAddress)
        external 
        returns (BC)
    { 
        uint8 position = nextCompanyAvailablePosition(self);
        require(MAX_OWNER_COMPANIES > position, "You can't create a new company. Max limit reached (5 companies).");
        BC newCompany = new BC(msg.sender, _companyName, _phone, _url, _did, _uPortAddress);
        self.companies[msg.sender][position] = address(newCompany);
        return newCompany;
    }
    

    
    function nextCompanyAvailablePosition(Data storage self)
        internal
        view
        returns (uint8)
    {
        address[MAX_OWNER_COMPANIES] memory ownerCompanies = self.companies[msg.sender];
        for (uint8 i = 0; i < MAX_OWNER_COMPANIES; i++) {
            if (ownerCompanies[i] == EMPTY_ADDRESS){
                return i; // first position available.
            }
        }
       return MAX_OWNER_COMPANIES; // No empty spot available. 
    }

    function nextCompanyAvailablePositionUtil(Data storage self)
        external
        view
        returns (uint8)
    {
        return nextCompanyAvailablePosition(self);
    }

   

    
}