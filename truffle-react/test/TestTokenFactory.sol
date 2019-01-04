pragma solidity ^0.5.0;

contract TestTokenFactory {

    /* TokenFactory functionality is tested in TestKMPToken.sol because 
        storage space is not reachable. State variable "companies" is not
        accessible/modified by TokenFactory to add companies which is a prerequisite
        to add tokens, so we will use integration tests instead
        to test TokenFactory functionality. 
    */

}
