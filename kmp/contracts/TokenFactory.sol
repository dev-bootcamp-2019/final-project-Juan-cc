pragma solidity ^0.5.0;

import "./BC.sol";
import "./KMToken.sol";
import "./CompanyFactory.sol";

library TokenFactory {
    
    // Constants
    uint8 constant public MAX_OWNER_COMPANIES = 3; // 1 owner could register up to 3 companies.
    uint8 constant public MAX_COMPANY_TOKENS = 5; // 1 company could register up to 10 tokens.
    address constant internal EMPTY_ADDRESS = address(0); 
   
    /*struct Data {
        mapping (address => address[MAX_OWNER_COMPANIES]) companies; // (owner => companies[3]) 
        mapping (address => address[MAX_COMPANY_TOKENS]) tokens; // (company => token[]))
    }*/

    
    function createTokenForBCCompany(CompanyFactory.Data storage self, address _bcCompany, string calldata _name, string calldata _symbol, uint256 _initialAmount) 
        external
        returns (KMToken)
    {
        require(msg.sender == CompanyFactory.findBCownerUtil(self, _bcCompany)); // 2nd time checking correct ownership.
        KMToken newToken = new KMToken(_bcCompany, msg.sender, _name, _symbol, _initialAmount);
        uint8 nextPosition = nextTokenAvailablePosition(self, address(_bcCompany));
        self.tokens[_bcCompany][nextPosition] = address(newToken);
        return newToken;
    }
    

    
    function nextTokenAvailablePosition(CompanyFactory.Data storage self, address aCompany)
        internal
        view
        returns (uint8)
    {
        require(msg.sender == CompanyFactory.findBCownerUtil(self, aCompany), "Only company owner can search for tokens.");
        address[MAX_COMPANY_TOKENS] memory companyTokens = self.tokens[aCompany];
        for (uint8 i = 0; i < MAX_COMPANY_TOKENS; i++) {
            if (companyTokens[i] == EMPTY_ADDRESS){
                return i; // first position available.
            }
        }
       return MAX_COMPANY_TOKENS; // No empty spot available. 
    }

    
}
