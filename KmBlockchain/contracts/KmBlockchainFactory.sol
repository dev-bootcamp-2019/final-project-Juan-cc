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

    // Company specific fields
    string name;
    string description;
    string country;
    string phone;

    constructor() public {
        admin = msg.sender;
    }

}


