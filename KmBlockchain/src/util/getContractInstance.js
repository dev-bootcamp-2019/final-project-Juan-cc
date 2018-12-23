const getContractInstance = async (web3, contractDefinition) => {
  
  console.log("web3 version api (<1.0):" + web3.version.api);
  console.log("web3 version (>=1.0):" + web3.version);
  
  // get network ID and the deployed address
  const networkId = await web3.eth.net.getId()
  const protocol = await web3.eth.getProtocolVersion()
  /* I am using web3 v1.0 (set in package.json), so we use web3.version
      instead of web3.version.api.
      ref: https://ethereum.stackexchange.com/questions/47833/typeerror-web3-eth-contract-is-not-a-constructor-what-is-the-reason
    */
   console.log(" Web3:" + web3.version +
   " Ethereum:" +  protocol +
   " Provider:" + web3.eth.currentProvider + 
   " Network:" + networkId)

  const deployedAddress = contractDefinition.networks[networkId].address

  // create the instance
  const instance = new web3.eth.Contract(contractDefinition.abi, deployedAddress)
  return instance
}

export default getContractInstance
