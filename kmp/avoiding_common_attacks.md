***************************
* Avoiding Common Attacks *
***************************

Owner validation
================
The majority of the contracts inherit from Owned.sol. Most of the functions (even those that only read storage state) use ownerOnly() modifier to validate that only allowed users can interact with the contract.  


Gas Limit DoS
=============
To avoid having gas limit issues we took into account the following considerations:
* Arrays are limited to a fixed size: 
  uint8 constant public MAX_OWNER_COMPANIES = 3; // 1 owner could register up to 5 companies.
  uint8 constant public MAX_COMPANY_TOKENS = 5; // 1 company could register up to 10 tokens.
* Instead of iterating through arrays I am using mappings to access directly to the value.
  mapping (address => address[MAX_OWNER_COMPANIES]) internal companies; // (owner => companies[5]) 
  mapping (address => address[MAX_COMPANY_TOKENS]) internal tokens; // (company => token[]))
