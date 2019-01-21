final-project-Juan-cc
=====================
[![Build Status](https://travis-ci.org/dev-bootcamp-2019/final-project-Juan-cc.svg?branch=master)](https://travis-ci.org/dev-bootcamp-2019/final-project-Juan-cc)
[![Coverage Status](https://coveralls.io/repos/github/Juan-cc/final-project-Juan-cc/badge.svg?branch=master)](https://coveralls.io/github/Juan-cc/final-project-Juan-cc?branch=master)

Documentation
-------------
* Description: https://docs.google.com/document/d/1Q8KoQVWiCFN1jqC8iK3s12gHI_9GBJevjq5aGZrJqHI/edit?usp=sharing
* Company Creation Diagram:https://drive.google.com/file/d/1YlAX9PJoqXrYRPz8QWjek3gCbtOwsT8S/view?usp=sharing
* Token Creation Diagram: https://drive.google.com/file/d/1XPeKMUTQRmNga701XV7o2m7x72-q4bqy/view?usp=sharing
* Token Transfer Diagram: https://drive.google.com/file/d/1PpXvaiI5DEarzPvsQgStGnJ73633Y0EP/view?usp=sharing


Prerequisites:
--------------
- Truffle v5.0.0 (core: 5.0.0)
- Solidity v0.5.0 (solc-js)
- Node v8.10.0
- Web3 ^1.0.0-beta.35

Try the app (Rinkeby):
----------------
- start your browser and authenticate metamask to Rinkeby
- go to https://kmpblockchain.herokuapp.com/
- you are all set!

Compile app Locally:
---------------
- download project source code.
- go to /final-project-Juan-cc/kmp/client and run: npm install
- go to /final-project-Juan-cc/kmp and run: npm install
- configure ganache on port 8545
- migrate contracts
- start your browser and authenticate metamask to your local ganache
- go to /final-project-Juan-cc/kmp/client and run: npm run start
- you are all set!

Used library:
--------------
- "openzeppelin-solidity": "2.1.2"

Network: rinkeby (id: 4)
-----------------------
*  BCFactory: 0xF1C8D0C0740F9684D561c28f7Df0a5Da5db30a27
*  KMP: 0x9cBa9C23ab1586B077DE6DC3f28c149F8F60164A
*  KMToken: 0x6A3B47B4096D80321916cdB45C585fe7cc499CB1
*  Migrations: 0x33Cc969033277e210F01454Fbe1905a7fc654981
*  Owned: 0x62EF94501c16888C28447c42C0ff0d8d66eBD494
*  TokenFactory: 0xc61C1c1eF3546650Cdf7e46774D90bda1869D806


Useful links
------------
- https://github.com/sc-forks/solidity-parser/pull/18 (solidity-coverage)
