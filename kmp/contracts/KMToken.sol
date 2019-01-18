pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Owned.sol";

contract KMToken is Owned, ERC20, ERC20Detailed {

    uint8 constant private NO_DECIMALS = 0;
    address private tokenFactory;
    address private company;
    
     
    constructor (address _company, address _owner, string memory tokenName, string memory tokenSymbol, uint256 initialSupply) 
        ERC20Detailed(tokenName, tokenSymbol, NO_DECIMALS)
        ERC20()
        Owned()
        public 
    {
        owner = _owner;  // TODO: refactor create from factory, but then transfer ownership
        tokenFactory = msg.sender;
        company = _company;
        _mint(_owner, initialSupply);
    }
    
}

