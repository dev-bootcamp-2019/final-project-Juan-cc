pragma solidity ^0.5.0;

import "./Owned.sol";
import "./BC.sol";
import "./KMToken.sol";
import "./Storage.sol";


contract TokenFactory is Owned, Storage {
   
    
    function createTokenForBCCompany(address _bcCompany, string calldata _name, string calldata _symbol, uint256 _initialAmount) 
        external
        returns (KMToken)
    {
        require(msg.sender == findBCowner(_bcCompany)); // 2nd time checking correct ownership.
        KMToken newToken = new KMToken(_bcCompany, msg.sender, _name, _symbol, _initialAmount);
        uint8 nextPosition = nextTokenAvailablePosition(address(_bcCompany));
        tokens[_bcCompany][nextPosition] = address(newToken);
        return newToken;
    }
    

    function findBCownerUtil(address aCompany)
        external
        view
        returns (address)
    {
        return findBCowner(aCompany);
    }

    function findBCowner(address aCompany)
        internal
        view
        returns (address)
    {
        address[MAX_OWNER_COMPANIES] memory ownerCompanies = companies[msg.sender];
        for (uint8 i = 0; i < MAX_OWNER_COMPANIES; i++) {
            if (ownerCompanies[i] == aCompany){
                return BC(ownerCompanies[i]).owner();
            }
        }
        revert("Company address not found.");
    }
    
    function nextTokenAvailablePosition(address aCompany)
        internal
        view
        returns (uint8)
    {
        require(msg.sender == findBCowner(aCompany), "Only company owner can search for tokens.");
        address[MAX_COMPANY_TOKENS] memory companyTokens = tokens[aCompany];
        for (uint8 i = 0; i < MAX_COMPANY_TOKENS; i++) {
            if (companyTokens[i] == EMPTY_ADDRESS){
                return i; // first position available.
            }
        }
       return MAX_COMPANY_TOKENS; // No empty spot available. 
    }

    
}
