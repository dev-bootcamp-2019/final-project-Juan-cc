import React, { Component } from "react";
import KMP from "./contracts/KMP.json";
import KMToken from "./contracts/KMToken.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0, web3: null, accounts: null, contract: null,
      companiesList: [],
      tokensList: [[]],
      activeAccount: '',
      accountNumber: 0,
      accountsCustomList: ['0xA5997F29f13E85d34C7112ff92cC113cE62FFAD4',
                            '0xcfdE7c549bB247889B55262102870b2eEc1aFAD9',
                            '0xF0bC3c6D4A07803dC801651D5486BECc261f3E92',
                            '0x634283b413FF924899Fd7A78385834a6C09194ED',
                            '0xdD886e112825053aa65F41b35e7BFf7DA6E519E7',
                            '0x3F2207e6Fdd838cE08b29aCF5C5766283F041c55',
                            '0x456E83Df3d13483EF096f72356A6D3a4894Bb487',
                            '0xc9a22b776F2F9E9a269d4DAC4DA7D1Ef0b09fd06',
                            '0x42698dF6eAE1F13b52423BDFbbBF670Ea32729A8',
                            '0x65DC4b39c3c372B20497c9676FeD8D1cba663995'
                          ],
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


  }
  
  handleAccountChange = async () => {
    const { web3, activeAccount } = this.state;
    const refreshedAccounts = await web3.eth.getAccounts();
    if (refreshedAccounts[0] !== activeAccount){
      this.setState({
        accounts: refreshedAccounts,
        activeAccount: refreshedAccounts[0]
      });
      alert("Account[0] changed -> Refresh page");
    }
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
      this.setState({ 
        web3, 
        accounts, 
        contract: instance,
        activeAccount: accounts[0]
        //destUser: this.state.accountsCustomList[this.state.accountNumber]
      }/*, this.runExample*/);
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
 

  handleCreateCompany = async (event) => {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, contract, companyName, phone, url, did, ethadd, companiesList, companyCounter, tokensList} = this.state;
    try {
      //contract.once('KMPCompanyCreated', { fromBlock: 0}, function(error, event){ console.log(event); });
      const result = await contract.createBCCompany(companyName, phone, url, did, ethadd, { from: accounts[0]});
      const newCompany = result.logs[0].args[0];
      console.log(result);
      var newTokenList = tokensList;
      newTokenList[companyCounter]=[];
      this.setState({ 
        companyCounter: companyCounter + 1,
        companyName: `some name-${companyCounter}`,
        companiesList: companiesList.concat(newCompany),
        companyAddress: newCompany,
        tokensList: newTokenList
      });
    } catch (err) {
      //console.log(err);
    }
  };

  inputChangeHandler = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleCreateToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, contract, companyAddress, tokenName, symbol, totalSupply, tokenCounter, tokensList, companyCounter } = this.state;
    try {
      var result = await contract.createTokenForBCCompany(companyAddress, tokenName, symbol, totalSupply, { from: accounts[0]});
      console.log(result);
      const newToken = result.logs[0].args[1];
      var newTokenList = tokensList;
      newTokenList[companyCounter-2][tokensList[companyCounter-2].length] = newToken;
      this.setState({ 
        tokenCounter: tokenCounter + 1,
        tokenName: `Tokenzito-${tokenCounter}`,
        tokenAddress: newToken,
        tokensList: newTokenList
        
      });
    } catch (err) {
      //console.log(err);
    }
   
    
  };

  handleUserTokenBalance = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, contract, companyAddress, tokenAddress, userAddress } = this.state;
    var result;
    try {
      result = await contract.getUserTokenBalance.call(companyAddress, tokenAddress, userAddress, { from: accounts[0]});
      console.log(result);
      this.setState({
        userTokenBalance: result.toString()
      });
    } catch (err) {
      console.log(err);
    }
  };


  handleFindBCOwner = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, contract, companyAddress } = this.state;
    var result;
    try {
      result = await contract.findBCownerUtil.call(companyAddress, { from: accounts[0]});
      console.log(result);
      this.setState({
        companyOwner: result.toString()
      });
    } catch (err) {
      //console.log(err);
    }
  };


  handleFindCompanyToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, contract, companyAddress, tokenAddress} = this.state;
    var result;
    try {
      result = await contract.findBCToken.call(companyAddress, tokenAddress, { from: accounts[0]});
      console.log(result);
      this.setState({
        tokenFound: result.toString()
      })
    } catch (err) {
      //console.log(err);
    }
  };

  handleTransferToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, web3, tokenAddress, destUser, amountToTransfer} = this.state;
    const Contract = await truffleContract(KMToken);
    Contract.setProvider(web3.currentProvider);
    const tokenContract = await Contract.at(tokenAddress);

    var result;
    try {
      result = await tokenContract.transfer( destUser, amountToTransfer, { from: accounts[0]});
      console.log(result);
      this.setState({
        transferResult: result.logs[0].args[2].toString()
      })
    } catch (err) {
      //console.log(err);
      this.setState({
        transferResult: "Ooops!"
      })
    }
  };

  handleCurrentAddress = async (event) => {
    event.preventDefault();
    await this.handleAccountChange();
    const {accounts} = this.state;
    this.setState({
      userAddress: accounts[0]
    });
  }

  handleUseCompany = async (company) => {
    await this.handleAccountChange();
    this.setState({
      companyAddress: company.toString()
    });
  }

  handleUseToken = async (token) => {
    await this.handleAccountChange();
    this.setState({
      tokenAddress: token.toString()
    });
  }


  handlePreviousAccount = (event) => {
    event.preventDefault();
    if (this.state.accountNumber > 1) {
      const newAccountNum = this.state.accountNumber - 1;
      const newDestAddress = this.state.accountsCustomList[newAccountNum];
      this.setState({
        accountNumber: newAccountNum,
        destUser: newDestAddress
      });
    }
  }

  handleNextAccount = (event) => {
    event.preventDefault();
    if (this.state.accountNumber < (this.state.accountsCustomList.length - 1)) {
      const newAccountNum = this.state.accountNumber + 1;
      const newDestAddress = this.state.accountsCustomList[newAccountNum];
      this.setState({
        accountNumber: newAccountNum,
        destUser: newDestAddress
      });
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App"> 
        <h4>User: {this.state.activeAccount}</h4>

        <h3>Companies -> Tokens created</h3>
          <div>
            <ul>
              {this.state.companiesList.map((aCompany, i) => (
                <li onClick={ () => this.handleUseCompany(aCompany)} key={aCompany}>{aCompany}
                  <ul>
                    {this.state.tokensList[i].map(aToken => (
                      <li onClick={ () => this.handleUseToken(aToken)} key={aToken}>{aToken}
                      
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          
        <div>
          <h3>Create Company</h3>
          <form onSubmit={this.handleCreateCompany}>
            <div>
              <div>Company name: <input type="text" id='companyName' defaultValue={ this.state.companyName } onChange={this.inputChangeHandler} /></div>
              <div>Phone: <input type="text" id='phone' defaultValue={this.state.phone} onChange={this.inputChangeHandler} /></div>
              <div>URL: <input type="text" id='url' defaultValue={this.state.url} onChange={this.inputChangeHandler} /></div>
              <div>DID: <input type="text" id='did' defaultValue={this.state.did} onChange={this.inputChangeHandler} /></div>
              <div>Eth add: <input type="text" id='ethadd' defaultValue={this.state.ethadd} onChange={this.inputChangeHandler}  /></div>
            </div>
            <input type="submit" value="Create company" />
          </form>

          <h3>Create Company Token</h3>
          <form onSubmit={this.handleCreateToken}>
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

        <div>

          <h3>Get User Token Balance</h3>
          <form onSubmit={this.handleUserTokenBalance}>
            <div>
            <div>Company address:
              <input type="text" id='companyAddress' defaultValue={this.state.companyAddress} onChange={this.inputChangeHandler} /></div>
            <div>Token address:
              <input type="text" id='tokenAddress' defaultValue={this.state.tokenAddress} onChange={this.inputChangeHandler} /></div>
              <div>User Address:
              <input type="text" id='userAddress' defaultValue={this.state.userAddress} onChange={this.inputChangeHandler} /> <button onClick={this.handleCurrentAddress}>My address</button></div>
            </div>
            <div><input type="submit" value="Get Balance" /></div>
            Result:{this.state.userTokenBalance}
          </form>

          <h3>Find Company Owner</h3>
          <form onSubmit={this.handleFindBCOwner}>
            <div>
            <div>Company address:
              <input type="text" id='companyAddress' defaultValue={this.state.companyAddress} onChange={this.inputChangeHandler} /></div>
            </div>
            <div><input type="submit" value="Get Owner" /></div>
            Result: {this.state.companyOwner}
          </form>

          <h3>Find Company Token</h3>
          <form onSubmit={this.handleFindCompanyToken}>
            <div>
            <div>Company address:
              <input type="text" id='companyAddress' defaultValue={this.state.companyAddress} onChange={this.inputChangeHandler} /></div>
            <div>Token address:
              <input type="text" id='tokenAddress' defaultValue={this.state.tokenAddress} onChange={this.inputChangeHandler} /></div>
            
            </div>
            <div><input type="submit" value="Get Company Token" /></div>
            Result: {this.state.tokenFound}
          </form>

          <h3>Transfer Token</h3>
          <form onSubmit={this.handleTransferToken}>
            <div>
            <div>Token address:
              <input type="text" id='tokenAddress' defaultValue={this.state.tokenAddress} onChange={this.inputChangeHandler} /></div>
              <div>To:
              <input type="text" id='destUser' defaultValue={this.state.destUser} onChange={this.inputChangeHandler} /><button onClick={this.handlePreviousAccount}>&laquo;Prev</button> [{this.state.accountNumber}] <button onClick={this.handleNextAccount}>Next&raquo;</button></div>
              <div>Amount:
              <input type="text" id='amountToTransfer' defaultValue={this.state.amountToTransfer} onChange={this.inputChangeHandler} /></div>
            </div>
            <div><input type="submit" value="Transfer Token" /></div>
            Result: {this.state.transferResult}
          </form>

          
        </div>
      </div>
    );
  }
}

export default App;
