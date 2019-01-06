const getContractInstance = async (web3, contractDefinition) => {
  
  console.log("web3 version api (<1.0):" + web3.version.api);
  console.log("web3 version (>=1.0):" + web3.version);
  
  // get network ID and the deployed address
  /*// web3 v.>=1.0
  const networkId = await web3.eth.net.getId()
  const protocol = await web3.eth.getProtocolVersion() 
  */

  // web3 v.<1.0
  const networkId = await web3.version.network; 
  const protocol = await web3.version.ethereum;
  /* I am using web3 v1.0 (set in package.json), so we use web3.version
      instead of web3.version.api.
      ref: https://ethereum.stackexchange.com/questions/47833/typeerror-web3-eth-contract-is-not-a-constructor-what-is-the-reason
    */
   console.log(" Web3:" + web3.version +
   " Ethereum:" +  protocol +
   " Provider:" + web3.eth.currentProvider + 
   " Network:" + networkId)
   var instance = null;
  try{
    const deployedAddress = contractDefinition.networks[networkId].address

    // create the instance
    instance = new web3.eth.Contract(contractDefinition.abi, deployedAddress)  
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert('Failed to load contract [' + contractDefinition.contractName + '] on network id:' + networkId + ' Check console for details.')
    console.log(error)
  }
  return instance
}

export default getContractInstance
