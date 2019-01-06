pragma solidity ^0.5.0;

import "./KMToken.sol";
import "./Owned.sol";
import "./BC.sol";
import "./TokenFactory.sol";
import "./Storage.sol";


contract KMP is Owned, Storage {

    // Events
    event KMPCompanyCreated(address company, string name, address owner);
    event KMPTokenCreated(address _company, address _token, string _name, string _symbol, uint256 _initialAmount);
    event KMMsgSender(address indexed msgSender);
    event KMUserTokenBalance(address indexed user, uint256 balance);
    event KMReturnedToken(KMToken returnToken);
    event KMReturnedBC(BC returnBC);
    event KMTokenAssigned(address _from, address _to, uint256 _amount);

    constructor() Owned() public {
        bcFactory = new BCFactory(); // Owner will be KMP contract.
        tkFactory = new TokenFactory(); // Owner will be KMP contract.
    }
    
      
     
    function getUserTokenBalance(address _company, address _token, address _user)
        public
        returns (uint256 aBalance)
    {
        require(msg.sender == findBCowner(_company), "Only company owner can query token balances.");
        require(EMPTY_ADDRESS != findBCToken(_company, _token), "Token not found."); 
        bytes memory payload = abi.encodeWithSignature("balanceOf(address)", _user);
        (bool result, bytes memory returnData) = _token.staticcall(payload);
        if (result) {
            emit KMMsgSender(msg.sender);
            aBalance = abi.decode(returnData, (uint256));
        }
        return aBalance;
    }
    
    
    
    function createBCCompany(string memory _companyName, string memory _phone, string memory _url, string memory _did, address _uPortAddress) 
    public 
   // ownerOnly(msg.sender) I want anybody to be able to create a new BC on my platform.
    returns(BC){
        (bool companyCreated, bytes memory returnData) = address(bcFactory).delegatecall(
            abi.encodeWithSignature("createBCCompany(string,string,string,string,address)",
            _companyName, _phone, _url, _did, _uPortAddress));
        if (companyCreated){
            (BC newCompany) = abi.decode(returnData, (BC));
            emit KMPCompanyCreated(address(newCompany), newCompany.name(), newCompany.owner());
            return newCompany;
        }
        revert("Your company was not created. Probably you reached MAX_LIMIT?. Reverting state changes."); 
    } 
    
    
    function findBCownerUtil(address company) // Util methods are for development purposes only. 
        public
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
        address[MAX_OWNER_COMPANIES] memory ownerCompanies = companies[msg.sender];
        for (uint8 i = 0; i < MAX_OWNER_COMPANIES; i++) {
            if (ownerCompanies[i] == aCompany){
                return BC(ownerCompanies[i]).owner();
            }
        }
        revert("Company address not found.");
    }
    

    function tokenInBC(address aCompany, address aToken)
        public 
        view
        returns (bool)
    {
        require(msg.sender == findBCowner(aCompany), "Only company owner can search for tokens.");
        address[MAX_COMPANY_TOKENS] memory companyTokens = tokens[aCompany];
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
    
    
    function createTokenForBCCompany(address _bcCompany, string memory _name, string memory _symbol, uint256 _initialAmount) 
    public 
    //ownerOnly(companies[bcCompany].owner()) // Only Company owner can create tokens.
    returns(KMToken){
        
        require (msg.sender == findBCowner(_bcCompany), "Only company owner can create tokens.");
        
        (bool tokenCreated, bytes memory returnData) = address(tkFactory).delegatecall(
            abi.encodeWithSignature("createTokenForBCCompany(address,string,string,uint256)",
            _bcCompany, _name, _symbol, _initialAmount));
        if (tokenCreated){
            (KMToken newToken) = abi.decode(returnData, (KMToken));
            emit KMPTokenCreated(_bcCompany, address(newToken), _name, _symbol, _initialAmount);
            return newToken;
        }
        revert("Unfortunately your token was not created correctly. Please contact KMP Support. Reverting state changes."); 
        
    }
    
}
