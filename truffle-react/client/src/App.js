import React, { Component } from "react";
import KMP from "./contracts/KMP.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {

  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  constructor(props) {
    super(props);
    this.state = {
      companyCounter: 1,
      tokenCounter: 1,
      companyName: 'some name-1',
      phone: '123456789',
      url: 'www.wearoft.com',
      did: 'did:0xC123DAB13...',
      ethadd: '0xD6aE8250b8348C94847280928c79fb3b63cA453e',
      companyAddress: '',
      tokenName: 'Tokenzito-1',
      symbol: 'TKN',
      totalSupply: '1000'
    };

    //this.handleChange = this.handleChange.bind(this);

    //this.handleSubmitCompany = this.handleSubmitCompany.bind(this);
    //this.handleSubmitToken = this.handleSubmitToken.bind(this);

  }
  
  componentDidMount = async () => {
    
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(KMP);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }/*, this.runExample*/);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    var result;
    result = await contract.createBCCompany("Company Name 1", "44446666", "www.wearoft.com", "did:eth:0xC123D...", "0xD6aE8250b8348C94847280928c79fb3b63cA453e", { from: accounts[0]});
    console.log(result);

    
    result = await contract.createBCCompany.call("Company Name 2", "44446666", "www.wearoft.com", "did:eth:0xC123D...", "0xD6aE8250b8348C94847280928c79fb3b63cA453e", { from: accounts[0]});
    console.log(result);

    try {
        result = await contract.findBCownerUtil.call(result, { from: accounts[0]});
        console.log(result);
    } catch (err){
        //console.log(err);
    }
   

    result = await contract.returnTrue.call({ from: accounts[0], gas:2000000});
    console.log(result);

    // console.log(resultado);
    //function createBCCompany(string memory _companyName, string memory _phone, string memory _url, string memory _did, address _uPortAddress)

    // Get the value from the contract to prove it worked.
    //const response = await contract.get();

    // Update state with the result.
    //this.setState({ storageValue: response.toNumber() });
  };
 

  handleSubmitCompany = async (event) => {
    event.preventDefault();
    const { accounts, contract, companyName, phone, url, did, ethadd } = this.state;
    var result;
    try {
      result = await contract.createBCCompany(companyName, phone, url, did, ethadd, { from: accounts[0]});
      console.log(result);
    } catch (err) {
      //console.log(err);
    }
    this.setState({ 
      companyCounter: this.state.companyCounter + 1,
      companyName: `some name-${this.state.companyCounter}`
    });
    
  };

  inputChangeHandler = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmitToken = async (event) =>  {
    event.preventDefault();
    const { accounts, contract, companyAddress, tokenName, symbol, totalSupply } = this.state;
    var result;
    try {
      result = await contract.createTokenForBCCompany(companyAddress, tokenName, symbol, totalSupply, { from: accounts[0]});
      console.log(result);
    } catch (err) {
      //console.log(err);
    }
    this.setState({ 
      tokenCounter: this.state.tokenCounter + 1,
      tokenName: `Tokenzito-${this.state.tokenCounter}`
    });
    
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App"> 
        <h2>Create Company</h2>
         <form onSubmit={this.handleSubmitCompany}>
          <div>
            <div>Company name: <input type="text" id='companyName' defaultValue={ this.state.companyName } onChange={this.inputChangeHandler} /></div>
            <div>Phone: <input type="text" id='phone' defaultValue={this.state.phone} onChange={this.inputChangeHandler} /></div>
            <div>URL: <input type="text" id='url' defaultValue={this.state.url} onChange={this.inputChangeHandler} /></div>
            <div>DID: <input type="text" id='did' defaultValue={this.state.did} onChange={this.inputChangeHandler} /></div>
            <div>Eth add: <input type="text" id='ethadd' defaultValue={this.state.ethadd} onChange={this.inputChangeHandler}  /></div>
          </div>
          <input type="submit" value="Create company" />
        </form>
        <h2>Create Token</h2>
         <form onSubmit={this.handleSubmitToken}>
          <div>
          <div>Company address:
            <input type="text" id='companyAddress' defaultValue={this.state.companyAddress} onChange={this.inputChangeHandler} /></div>
          <div>Token name:
            <input type="text" id='tokenName' defaultValue={this.state.tokenName} onChange={this.inputChangeHandler} /></div>
            <div>Symbol:
            <input type="text" id='symbol' defaultValue={this.state.symbol} onChange={this.inputChangeHandler} /></div>
            <div>Total supply:
            <input type="text" id='totalSupply' defaultValue={this.state.totalSupply} onChange={this.inputChangeHandler} /></div>
          </div>
          <input type="submit" value="Create Token" />
        </form>

      </div>
    );
  }
}

export default App;
