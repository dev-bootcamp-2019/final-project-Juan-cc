import React, { Component } from 'react'
import { web3 } from '../../util/connectors'
//import getWeb3 from '../../util/getWeb3';

import getContractInstance from '../../util/getContractInstance'
import contractDefinition from '../../../build/contracts/KMToken.json'



class Home extends Component {

  state = { web3: null, storageValue: 0, accounts: null, contract: null }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      //const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
     /* web3.eth.getAccounts(console.log);
      console.log("account:" + accounts[0]);
      console.log("balance:" + web3.fromWei(web3.eth.getBalance(accounts[0])));
*/
      // Get the contract instance by passing in web3 and the contract definition.
      const contract = await getContractInstance(web3, contractDefinition)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract }, this.runExample)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(`Failed to load web3, accounts, or contract. Check console for details.`)
      console.log(error)
    }
  }

  runExample = async () => {
alert("runExample1");
    // Here I need to set the account AFTER logged in
    //this.state.web3.eth.defaultAccount = '0xfc7206fd26ec626d76c58b2c522d09548e2785fe';
   
    
    const { accounts, contract } = this.state;



    // Stores a given value, 5 by default.
    await contract.methods.transfer(accounts[1], 10).send({ from: accounts[0] });
    alert("runExample2");

    // Get the value from the contract to prove it worked.
    //balanceOf.call(accounts[1])
    const response = await contract.methods.balanceOf.call(accounts[1], { from: accounts[0] });
    alert("runExample3");

    alert (response);
    // Update state with the result.
    //this.setState({ storageValue: response })
    
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>KmBlockchain Platform</h1>
            <p>KmBlockchain is a public distributed platform that enables Bus operating companies to build their own loyalty program (KM tokens) by following a few simple steps on a website. It also empower final users to exchange KM tokens among different Bus companies based on their current travel needs.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
