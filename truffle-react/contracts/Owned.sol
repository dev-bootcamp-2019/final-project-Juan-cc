pragma solidity ^0.5.0;

contract Owned{
    /* TODO: Can be changed for Ownable from zepellin*/
    address public owner;
    
    constructor() public{
        owner = msg.sender;    
    }
    
    modifier ownerOnly(address _owner){
        require(owner == _owner, "Access denied. Company owner only.");    
        _;
    }
    
    
    function modifyOwner(address _owner)
        public
        ownerOnly(msg.sender)
    {
        owner = _owner;
    }
}
