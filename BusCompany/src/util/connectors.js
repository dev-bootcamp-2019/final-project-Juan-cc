import { Connect, SimpleSigner } from 'uport-connect'
//import Web3 from 'web3'
//import getWeb3 from './getWeb3';

/**
 * Register new application https://appmanager.uport.me/
 * 
 */

let uport = new Connect('KmPlatform', {
  clientId: '2oummAziABkcMMogqr83eFobGUG8VFCKx3S',
  network: 'rinkeby',
  signer: SimpleSigner('13c85dfd6991ae041413df5e9a169a154fce3ba0f423e7719a073d0ed8874a98')
})


// const web3 = new Web3(uport.getProvider()) // This is working only on rinkeby now, I'll change the provider.
//const web3 = getWeb3(); // This is to use my local ganache instead of rinkeby for now

export {/*web3, */uport}