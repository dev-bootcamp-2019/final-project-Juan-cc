pragma solidity ^0.4.21;

import 'tokens/eip20/EIP20.sol';
import "tokens/eip20/EIP20Factory.sol";
import "tokens/eip20/EIP20Interface.sol";


contract KmBlockchainFactory{
    address[] internal companies;
    address internal owner;

    constructor() public {
        owner = msg.sender;
    }

    
}

contract BusCompany{
    address private admin;
    address[] internal tokens;

    constructor() public {
        admin = msg.sender;
    }

}


