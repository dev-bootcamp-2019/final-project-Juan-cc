pragma solidity ^0.5.0;

import "./Owned.sol";

contract BC is Owned {
    mapping (address => bool) public admins;
    string public name;
    string public phone;
    string public url;
    string private did;
    address private uPortAddress;
    mapping (address => address[]) public tokens;
    
    event BCCreated(address indexed companyAddress, string _companyName, string _phone, string _url);
    event BCTokenAdded(address indexed tokenAdded);
    event BCMsgSender(address indexed msgSender);
    event BCTerminated(address indexed companyAddress, string _companyName, string _phone, string _url);

    constructor(address _owner, string memory _companyName, string memory _phone, string memory _url, string memory _did, address _uPortAddress) 
        public 
    {
        owner = _owner;   
        //emit BCMsgSender(msg.sender);
        name = _companyName;
        phone = _phone;
        url = _url;
        did = _did;
        uPortAddress = _uPortAddress;
        admins[owner] = true;
        //emit BCCreated(address(this), _companyName, _phone, _url);

    }

    function terminateCompany(/*address newCompanyContract*/)
        public
        ownerOnly(msg.sender)
    {
        // TOTO: before selfdestruction delegate token ownership to newCompanyContract.
        selfdestruct(msg.sender);
        emit BCTerminated(address(this), name, phone, url);
    }
}
