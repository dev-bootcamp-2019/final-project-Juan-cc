import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';


import React, { Component } from 'react'
//import { uport, web3 } from '../../util/connectors'

import getWeb3 from '../../util/getWeb3'

import getContractInstance from '../../util/getContractInstance'
import contractDefinition from '../../../build/contracts/SimpleStorage.json'


class Home extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

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

    // Here I need to set the account AFTER logged in
    //this.state.web3.eth.defaultAccount = '0xfc7206fd26ec626d76c58b2c522d09548e2785fe';
   
    
    const { accounts, contract } = this.state



    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] })
    
    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call({ from: accounts[0] })

    // Update state with the result.
    this.setState({ storageValue: response })
    
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
          <h2>The stored value is: {this.state.storageValue}</h2>
            <h1>Bus operating company</h1>
            <p>Register your company and start creating your own tokens.</p>
          </div>
        </div>
        <div><h2>Bus Company registration</h2>
        <p>DID: 0xfc7206fd26ec626d76c58b2c522d09548e2785fe</p>
  <Form horizontal>
  <FormGroup controlId="formHorizontalCompanyName">
    <Col componentClass={ControlLabel} sm={2}>
    Company Name:
    </Col>
    <Col sm={10}>
      <FormControl type="text" placeholder="Company Name" />
    </Col>
  </FormGroup>

  <FormGroup controlId="formHorizontalPhone">
    <Col componentClass={ControlLabel} sm={2}>
    Phone:
    </Col>
    <Col sm={10}>
      <FormControl type="text" placeholder="Phone" />
    </Col>
  </FormGroup>
  <FormGroup controlId="formHorizontalUrl">
    <Col componentClass={ControlLabel} sm={2}>
    URL:
    </Col>
    <Col sm={10}>
      <FormControl type="text" placeholder="URL" />
    </Col>
  </FormGroup>



  <FormGroup>
    <Col smOffset={2} sm={10}>
      <Button type="submit">Create</Button>
    </Col>
  </FormGroup>
</Form></div>
      </main>
    )
  }
}

export default Home
