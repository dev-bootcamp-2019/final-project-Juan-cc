pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/KMToken.sol";
import "./ThrowProxy.sol";


contract TestKMToken {
    address constant COMPANY = 0x6635F83421Bf059cd8111f180f0727128685BaE4;
    address owner;
    string constant NAME = "Token Name";
    string constant SYMBOL = "TKN";
    uint256 constant INITIAL_SUPPLY = 1000;
    uint256 constant EMPTY_BALANCE = 0;
    uint256 constant AMOUNT_TO_TRANSFER = 100;    
    address constant FAKE_ADDRESS = 0x82bB943fda5dB43f6622464f26808EDdf40Bb9fE;

    function beforeAll() public {
        owner = address(this);
    }

    function testConstructor() public {
        KMToken token = new KMToken(COMPANY, owner, NAME, SYMBOL, INITIAL_SUPPLY);
        Assert.equal(token.totalSupply(), INITIAL_SUPPLY, "Incorrect total supply");
    }

    function testBalanceOf() public {
        KMToken token = new KMToken(COMPANY, owner, NAME, SYMBOL, INITIAL_SUPPLY);
        Assert.equal(token.balanceOf(owner), token.totalSupply(), "Owner should own all newly created tokens");
        Assert.equal(token.balanceOf(FAKE_ADDRESS), EMPTY_BALANCE, "Incorrect balance of FAKE_ADDRESS");
    }

    function testTransfer() public {
        KMToken token = new KMToken(COMPANY, owner, NAME, SYMBOL, INITIAL_SUPPLY);
        Assert.equal(token.balanceOf(FAKE_ADDRESS), EMPTY_BALANCE, "Balance of FAKE_ADDRESS should be 0");
        token.transfer(FAKE_ADDRESS, AMOUNT_TO_TRANSFER);
        Assert.equal(token.balanceOf(FAKE_ADDRESS), AMOUNT_TO_TRANSFER, "New FAKE_ADDRESS balance should be AMOUNT_TO_TRANSFER");
        Assert.equal(token.balanceOf(owner), (INITIAL_SUPPLY - AMOUNT_TO_TRANSFER), "New FAKE_ADDRESS balance should be AMOUNT_TO_TRANSFER");
    }

    function testTransferFromAnotherAddressException() public {
        KMToken token = new KMToken(COMPANY, FAKE_ADDRESS, NAME, SYMBOL, INITIAL_SUPPLY);
        bytes memory payload = abi.encodeWithSignature("transfer(address,uint256)", owner, INITIAL_SUPPLY + 1);
        (bool result, ) = address(token).call(payload);
        Assert.isFalse(result, "I should get an error transferring from another account.");
    }

    function testExceedTransferAmount() public {
        KMToken token = new KMToken(COMPANY, owner, NAME, SYMBOL, INITIAL_SUPPLY);
        bytes memory payload = abi.encodeWithSignature("transfer(address,uint256)", FAKE_ADDRESS, INITIAL_SUPPLY + 1);
        (bool result, ) = address(token).call(payload);
        Assert.isFalse(result, "I should get an error transferring more than my balance");
    }
}