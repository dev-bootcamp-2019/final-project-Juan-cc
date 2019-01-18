****************************
* Design Pattern Desicions *
****************************


Factory
=======
I built 2 factories. 1 factory to create Companies (BCFactory.sol) and 1 other factory to create Tokens (TokenFactory.sol). At the moment both factories are simple and they only create contracts, but the idea is to add the business logic/rules related with Companies or Token creation in those factories to simplify the main contract (KMP.sol).


Circuit Breaker
===============
In case I find the platform is being used unethically or I find a bug that requires a new contract update, there is a circuit breaker implemented that can be enabled by calling activateEmergency() from the KMP owner account.


Unstructured storage
====================
The storage belongs to KMP contract, and it's modified by both BCFactory and TokenFactory, and due to the use of delegatecalls they all have to have the same storage attributes and in the same order. 
So at the moment I only isolated my entire persistence layer in a separate contract Storage.sol file because I had to update 3 files every time I modify the persistence layer, but my goal is to implement Unstructured storage using a proxy contract that would let me upgrade my KMP contract without loosing all the data.


DelegateCall (not a Pattern)
============
I want this platform to be open decentralized and disintermediated, so I am using delegatecalls to enable users create their own Company and Token. This way both contract Company and Tokens will be owned by the user not by the platform.


