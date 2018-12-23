pragma solidity ^0.5.0;

import "./BCFactory.sol";
import "./TokenFactory.sol";

contract Storage {
     // Shared storage
    uint8 constant internal MAX_OWNER_COMPANIES = 5; // 1 owner could register up to 5 companies.
    uint8 constant internal MAX_COMPANY_TOKENS = 10; // 1 company could register up to 10 tokens.
    address constant internal EMPTY_ADDRESS = address(0); 
    mapping (address => address[MAX_OWNER_COMPANIES]) internal companies; // (owner => companies[5]) 
    mapping (address => address[10]) internal tokens; // (company => token[]))
    BCFactory internal bcFactory;
    TokenFactory internal tkFactory;
}
