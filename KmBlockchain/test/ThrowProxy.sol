pragma solidity ^0.5.0;

// Proxy contract for testing throws
contract ThrowProxy {
    address public target;
    bytes data;

    
    constructor(address _target) public {
        target = _target;
    }

    //prime the data using the fallback function.
    /** IMPORTANT: only works with functions without return value. */
    function() external {
        data = msg.data;
    }

    function execute() public returns (bool) {
        (bool result,) = address(target).call(data);
        return result;
    }
}