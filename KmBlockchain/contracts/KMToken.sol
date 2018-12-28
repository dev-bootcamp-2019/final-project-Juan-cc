pragma solidity ^0.5.0;

//import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
//import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";
//import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./Owned.sol";

contract KMToken is Owned, ERC20, ERC20Detailed {

    uint8 constant private NO_DECIMALS = 0;
    address private tokenFactory;
    address private company;
    
    event KMTokenMsgSender(address msgSender);
    event KMTokenValue(uint256 value);
    event KMTokenFromToValor(address from, address to,uint256 value,uint256 _balanceFrom);

    
        
    constructor (address _company, address _owner, string memory tokenName, string memory tokenSymbol, uint256 initialSupply) 
        ERC20Detailed(tokenName, tokenSymbol, NO_DECIMALS)
        ERC20()
        public 
    {
        owner = _owner;  // TODO: refactor create from factory but transfer ownership
        tokenFactory = msg.sender;
        company = _company;
        _mint(_owner, initialSupply);
    }
   
}

