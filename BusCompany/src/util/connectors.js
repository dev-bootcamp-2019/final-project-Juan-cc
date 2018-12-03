import { Connect, SimpleSigner } from 'uport-connect'
//import Web3 from 'web3'

// export let uport = new Connect('TruffleBox')


let uport = new Connect('Company site', {
    clientId: '2oummAziABkcMMogqr83eFobGUG8VFCKx3S',
    network: 'rinkeby',
    signer: SimpleSigner('13c85dfd6991ae041413df5e9a169a154fce3ba0f423e7719a073d0ed8874a98')
  })

/*const web3 = new Web3(uport.getProvider())

web3.eth.defaultAccount = '0xB42E70a3c6dd57003f4bFe7B06E370d21CDA8087'
console.log(uport.state)
console.log("Network:" + web3.eth.network + " Default Account:" + web3.eth.defaultAccount)
*/
export {/*web3, */uport}