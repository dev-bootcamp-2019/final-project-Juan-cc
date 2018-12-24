pragma solidity ^0.5.0;

import "./Owned.sol";
import "./BC.sol";
import "./KMToken.sol";
import "./Storage.sol";


contract TokenFactory is Owned, Storage {
   
    //event TokenFactoryMsgSender(address msgSender);
    //event TokenFactoryTokenCreated(address _bcCompany, address _token, string _name, string _symbol, uint256 _initialAmount);
    //event TokenFactoryPositionAvailable(uint8 position);

    /* constructor(address deployer) 
        public
    { 
        owner = deployer;
    }*/
    
    function createTokenForBCCompany(address _bcCompany, string memory _name, string memory _symbol, uint256 _initialAmount) 
        public
        returns (KMToken)
    {
       // emit TokenFactoryMsgSender(msg.sender);
        require(msg.sender == findBCowner(_bcCompany)); // 2nd time checking correct ownership.
        KMToken newToken = new KMToken(_bcCompany, msg.sender, _name, _symbol, _initialAmount);
        uint8 nextPosition = nextTokenAvailablePosition(address(_bcCompany));
        tokens[_bcCompany][nextPosition] = address(newToken);
        //emit TokenFactoryTokenCreated(_bcCompany, address(newToken), _name, _symbol, _initialAmount);
        return newToken;
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
                //emit TokenFactoryPositionAvailable(i);
                return i; // This is the first available position.
            }
        }
       return MAX_COMPANY_TOKENS; // No empty spot available. 
    }

    
}
