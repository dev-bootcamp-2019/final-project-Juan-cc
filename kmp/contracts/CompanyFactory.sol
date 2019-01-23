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
        mapping (address => address[MAX_COMPANY_TOKENS]) tokens; // (company => token[]))

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


    function createTokenForBCCompany(Data storage self, address _bcCompany, string calldata _name, string calldata _symbol, uint256 _initialAmount) 
        external
        returns (KMToken)
    {
        require(msg.sender == findBCowner(self, _bcCompany)); // 2nd time checking correct ownership.
        KMToken newToken = new KMToken(_bcCompany, msg.sender, _name, _symbol, _initialAmount);
        uint8 nextPosition = nextTokenAvailablePosition(self, address(_bcCompany));
        self.tokens[_bcCompany][nextPosition] = address(newToken);
        return newToken;
    }
    

    function findBCownerUtil(Data storage self, address aCompany)
        external
        view
        returns (address)
    {
        return findBCowner(self, aCompany);
    }

    function findBCowner(Data storage self, address aCompany)
        internal
        view
        returns (address)
    {
        address[MAX_OWNER_COMPANIES] memory ownerCompanies = self.companies[msg.sender];
        for (uint8 i = 0; i < MAX_OWNER_COMPANIES; i++) {
            if (ownerCompanies[i] == aCompany){
                return BC(ownerCompanies[i]).owner();
            }
        }
        return EMPTY_ADDRESS;
    }
    
    function nextTokenAvailablePosition(Data storage self, address aCompany)
        internal
        view
        returns (uint8)
    {
        require(msg.sender == findBCowner(self, aCompany), "Only company owner can search for tokens.");
        address[MAX_COMPANY_TOKENS] memory companyTokens = self.tokens[aCompany];
        for (uint8 i = 0; i < MAX_COMPANY_TOKENS; i++) {
            if (companyTokens[i] == EMPTY_ADDRESS){
                return i; // first position available.
            }
        }
       return MAX_COMPANY_TOKENS; // No empty spot available. 
    }

    
}