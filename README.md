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
*  BCFactory: 0x922d59Ab7E59C021524BeD527f8A54EAb222d01C
*  KMP: 0x4bBE0120b505514C4CaAE571C9483a8D39c371e5
*  KMToken: 0x6E33d13aC68c9AE99F1fDf55e0014916e48EB41A
*  Migrations: 0xf771695DFc29fFAa4C9fdC5fC1a2B60bBC560A88
*  Owned: 0xD4E461F09740627Ee4945fE81F445FA173757A8E

Useful links
------------
- https://github.com/sc-forks/solidity-parser/pull/18 (solidity-coverage)
