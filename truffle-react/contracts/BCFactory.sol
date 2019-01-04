pragma solidity ^0.5.0;

import "./Owned.sol";
import "./KMToken.sol";
import "./TokenFactory.sol";
import "./Storage.sol";


contract BCFactory is Owned, Storage {


    //event BCFactoryMsgSender(address indexed msgSender);
    //event BCFactoryCompanyCreated(address companyAddress, string _companyName, string _phone, string _url);
    //event BCFactoryPosition(uint8 position);

    /*constructor(address deployer) 
        public
    { 
        owner = deployer;
    }*/
    
    
    function createBCCompany(string memory _companyName, string memory _phone, string memory _url, string memory _did, address _uPortAddress)
        public 
        returns (BC)
    { 
        // emit BCFactoryMsgSender(msg.sender);
        uint8 position = nextCompanyAvailablePosition();
        require(MAX_OWNER_COMPANIES > position, "You can't create a new company. Max limit reached (5 companies).");
        BC newCompany = new BC(msg.sender, _companyName, _phone, _url, _did, _uPortAddress);
        companies[msg.sender][position] = address(newCompany);
        //emit BCFactoryCompanyCreated(address(newCompany), _companyName, _phone, _url);
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
                //emit BCFactoryPosition(i);
                return i; // This is the first available position.
            }
        }
       return MAX_OWNER_COMPANIES; // No empty spot available. 
    }

    function nextCompanyAvailablePositionUtil()
        public
        view
        returns (uint8)
    {
        return nextCompanyAvailablePosition();
    }
}