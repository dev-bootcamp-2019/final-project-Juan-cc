pragma solidity ^0.5.0;

import "./KMToken.sol";
import "./Owned.sol";
import "./BC.sol";
import "./CompanyFactory.sol";


contract KMP is Owned {
    using CompanyFactory for CompanyFactory.Data;

    CompanyFactory.Data private companyFactory;
  
    uint8 constant public MAX_OWNER_COMPANIES = 3; // 1 owner could register up to 3 companies.
    uint8 constant public MAX_COMPANY_TOKENS = 5; // 1 company could register up to 5 tokens.
    address constant public EMPTY_ADDRESS = address(0); 

    bool internal stopped = false;  // Circuit breaker


    // Events
    event KMPCompanyCreated(address company, string name, address indexed owner);
    event KMPTokenCreated(address indexed _company, address indexed _token, string _name, string _symbol, uint256 _initialAmount);

    constructor() Owned() public {
    }

    
    // Circuit breaker modifier
    modifier stopInEmergency() { 
        require(!stopped); 
        _; 
    }
    
    modifier onlyCompanyOwner(address companyOwner){
        require(msg.sender == companyOwner, "Only company owner can execute this function");
        _;
    }
    
    
    function createBCCompany(string calldata _companyName, string calldata _phone, string calldata _url, string calldata _did, address _uPortAddress) 
        external 
        stopInEmergency()
        returns(BC)
    {
        BC newCompany = companyFactory.createBCCompany(_companyName, _phone, _url, _did, _uPortAddress);
        emit KMPCompanyCreated(address(newCompany), newCompany.name(), newCompany.owner());
        return newCompany;
    } 


    function createTokenForBCCompany(address _bcCompany, string calldata _name, string calldata _symbol, uint256 _initialAmount) 
        external 
        stopInEmergency()
        onlyCompanyOwner(findBCowner(_bcCompany))
        returns(KMToken)
    {
           
        KMToken newToken = companyFactory.createTokenForBCCompany(_bcCompany, _name, _symbol, _initialAmount);
        emit KMPTokenCreated(_bcCompany, address(newToken), _name, _symbol, _initialAmount);
        return newToken;        
    }
 
    function getUserTokenBalance(address _company, address _token, address _user)
        external
        view
        onlyCompanyOwner(findBCowner(_company))
        returns (uint256 aBalance)
    {
        require(EMPTY_ADDRESS != findBCToken(_company, _token), "Token not found."); 
        bytes memory payload = abi.encodeWithSignature("balanceOf(address)", _user);
        (bool result, bytes memory returnData) = _token.staticcall(payload);
        if (result) {
            aBalance = abi.decode(returnData, (uint256));
        }
        return aBalance;
    }


    function findBCownerUtil(address company) // Util methods are for development purposes only. 
        external
        view
        returns (address)
    {
        return findBCowner(company);
    }
    
    
    function findBCowner(address aCompany)
        internal
        view
        returns (address)
    {
        address[MAX_OWNER_COMPANIES] memory ownerCompanies = companyFactory.companies[msg.sender];
        for (uint8 i = 0; i < MAX_OWNER_COMPANIES; i++) {
            if (ownerCompanies[i] == aCompany){
                return BC(ownerCompanies[i]).owner();
            }
        }
        return EMPTY_ADDRESS;
    }
    

    function tokenInBC(address aCompany, address aToken)
        public 
        view
        returns (bool)
    {
        require(msg.sender == findBCowner(aCompany), "Only company owner can search for tokens.");
        address[MAX_COMPANY_TOKENS] memory companyTokens = companyFactory.tokens[aCompany];
        for (uint8 i = 0; i < MAX_COMPANY_TOKENS; i++) {
            if (companyTokens[i] == aToken){
                return true; // Token found.
            }
        }
        return false; // Token not found. 
    }
    
    function findBCToken(address aCompany, address aToken)
        public 
        view
        returns (address)
    {
        if (tokenInBC(aCompany, aToken)){
            return aToken;
        }
        return EMPTY_ADDRESS;
    }
    
    
    function activateEmergency()
        ownerOnly(msg.sender) 
        external
        returns(bool)
    {
        if (stopped == false) {
            stopped = true;
        } else {
            stopped = false;
        }
        return stopped;
    }
}
