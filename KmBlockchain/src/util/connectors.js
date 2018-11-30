import { Connect, SimpleSigner } from 'uport-connect'

// export let uport = new Connect('TruffleBox')


export let uport = new Connect('Truffle React Uport box', {
    clientId: '2oummAziABkcMMogqr83eFobGUG8VFCKx3S',
    network: 'rinkeby',
    signer: SimpleSigner('13c85dfd6991ae041413df5e9a169a154fce3ba0f423e7719a073d0ed8874a98')
  })

  export const web3 = uport.getWeb3()
