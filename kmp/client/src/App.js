import React, { Component } from "react";
import KMP from "./contracts/KMP.json";
import KMToken from "./contracts/KMToken.json";
import getWeb3 from "./utils/getWeb3";
//import getContractInstance from "./utils/getContractInstance";
//import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      storageValue: 0, web3: null, accounts: null, 
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
      companyCounter: 0,
      companySelected: 0,
      tokenCounter: 0,
      companyName: 'Company name',
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
    const {tokensList, companiesList, companyCounter} = this.state;
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract companyInstance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = KMP.networks[networkId];
      const kmpContractInstance = new web3.eth.Contract(
        KMP.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Getting PAST company events
      const companyEventFilter = { filter:{owner: accounts[0]}, fromBlock: 0, toBlock: 'latest'};
      const companyEventsList = await kmpContractInstance.getPastEvents('KMPCompanyCreated', companyEventFilter);
      var allCompaniesCreatedByUser = companiesList;
      var newTokenList = tokensList;
      var companiesCount = 0;
      /*if (companyEventsList.length > 0){
        this.setState({ companySelected: 0});
      }*/
      for (var i = 0; i < companyEventsList.length; i++){
        const aCompanyAddress = companyEventsList[i].returnValues['company'];
        const tokenEventFilter = { filter:{_company: aCompanyAddress}, fromBlock: 0, toBlock: 'latest'};
        // Getting PAST token events
        const tokenEventsList = await kmpContractInstance.getPastEvents('KMPTokenCreated', tokenEventFilter);
        newTokenList[i]=[];
        for (var j = 0; j < tokenEventsList.length; j++){
          newTokenList[i][j] = tokenEventsList[j].returnValues['_token'];
    
        }
        allCompaniesCreatedByUser[i] = aCompanyAddress;
        companiesCount++;
      }
      this.setState({ 
        web3, 
        accounts, 
        kmpContract: kmpContractInstance,
        activeAccount: accounts[0],
        companiesList: allCompaniesCreatedByUser,
        tokensList : newTokenList,
        companyCounter : companiesCount
      });

       /** Subscribe to all NEW events */
      await kmpContractInstance.events.allEvents({
        filter:{owner: accounts[0]} 
      },(error, evento) => {
        if (error) {
          console.error(error)
          return false
        }
        if (evento.event === "KMPCompanyCreated"){
          const newCompany = evento.returnValues['company'];
          var newTokenList = tokensList;
          newTokenList[companyCounter]=[];
          this.setState({ 
            companyCounter: companyCounter + 1,
            companyName: 'Company name',
            companiesList: companiesList.concat(newCompany),
            companyAddress: newCompany,
            tokensList: newTokenList,
            companySelected: companyCounter
          });
        } else if (evento.event === "KMPTokenCreated"){
          const {companySelected, tokensList, tokenCounter} = this.state;
          const newToken = evento.returnValues['_token'];
          var newTokenList = tokensList;
          newTokenList[companySelected][tokensList[companySelected].length] = newToken;
          this.setState({ 
            tokenCounter: tokenCounter + 1,
            tokenName: `Tokenzito-${tokenCounter}`,
            tokenAddress: newToken,
            tokensList: newTokenList
          });
        }
        console.log(evento)
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  


  handleCreateCompany = async (event) => {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract, companyName, phone, url, did, ethadd, companiesList, companyCounter, tokensList} = this.state;
    const sendMethod = kmpContract.methods.createBCCompany(companyName, phone, url, did, ethadd);
    await sendMethod.send({from: accounts[0]})
    .once('receipt', (receipt) => {
      // receipt example
      //console.log(receipt);
    })
    .on('error', /*console.error*/)
    .then((receipt) => {
      /*const newCompany = receipt.events.KMPCompanyCreated.returnValues['company'];
      var newTokenList = tokensList;
      newTokenList[companyCounter]=[];
      this.setState({ 
        companyCounter: companyCounter + 1,
        companyName: 'Company name',
        companiesList: companiesList.concat(newCompany),
        companyAddress: newCompany,
        tokensList: newTokenList,
        companySelected: companyCounter
      });*/
    });
  
  };

  handleCreateToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract, companyAddress, tokenName, symbol, totalSupply, tokenCounter, tokensList, companySelected} = this.state;
    const sendMethod = kmpContract.methods.createTokenForBCCompany(companyAddress, tokenName, symbol, totalSupply);
    await sendMethod.send({from: accounts[0]})
    .once('receipt', (receipt) => {
      // receipt example
      //console.log(receipt);
    })
    .on('error', /*console.error*/)
    .then((receipt) => {
      /* Moved to EVENTS 
      const newToken = receipt.events.KMPTokenCreated.returnValues['_token'];
      var newTokenList = tokensList;
      newTokenList[companySelected][tokensList[companySelected].length] = newToken;
      this.setState({ 
        tokenCounter: tokenCounter + 1,
        tokenName: `Tokenzito-${tokenCounter}`,
        tokenAddress: newToken,
        tokensList: newTokenList
        
      });*/
    });
          
  };

  handleTransferToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, web3, tokenAddress, destUser, amountToTransfer} = this.state;
    // Get the contract instance.
    const tokenContract = new web3.eth.Contract(
      KMToken.abi,
      tokenAddress
    );
    const sendMethod = tokenContract.methods.transfer(destUser, amountToTransfer);
    await sendMethod.send({from: accounts[0]})
    .once('receipt', (receipt) => {
      // receipt example
      //console.log(receipt);
    })
    .on('error', () => {this.setState({transferResult: "Ooops!"});
    })
    .then((receipt) => {
      console.log(receipt);
      //receipt.events.KMPTokenCreated.returnValues['_token']
      this.setState({
        transferResult: receipt.events.Transfer.returnValues.value
      })
    });
  };


  inputChangeHandler = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  
  handleUserTokenBalance = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract, companyAddress, tokenAddress, userAddress } = this.state;
    const callMethod = kmpContract.methods.getUserTokenBalance(companyAddress, tokenAddress, userAddress);
    await callMethod.call({ from: accounts[0]})
    .then((receipt) => {
      console.log(receipt);
      this.setState({
        userTokenBalance: receipt
      });
    });
  };


  handleFindBCOwner = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract, companyAddress } = this.state;
    const callMethod = kmpContract.methods.findBCownerUtil(companyAddress);
    await callMethod.call({ from: accounts[0]})
    .then((receipt) => {
      console.log(receipt);
      this.setState({
        companyOwner: receipt
      });
    });
  };


  handleFindCompanyToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract, companyAddress, tokenAddress} = this.state;
    const callMethod = kmpContract.methods.findBCToken(companyAddress, tokenAddress);
    await callMethod.call({ from: accounts[0]})
    .then((receipt) => {
      console.log(receipt);
      this.setState({
        tokenFound: receipt
      });
    });
  };

 

  handleCurrentAddress = async (event) => {
    event.preventDefault();
    await this.handleAccountChange();
    const {accounts} = this.state;
    this.setState({
      userAddress: accounts[0]
    });
  }

  handleUseCompany = async (company, companyIndex) => {
    await this.handleAccountChange();
    this.setState({
      companyAddress: company.toString(),
      companySelected: companyIndex
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

        <h4>Current User: {this.state.activeAccount}</h4>

        <div style={{backgroundColor: '#b3d9ff'}}>
          <h3>Companies -> Tokens created</h3>
            <div>
              <ul>
                {this.state.companiesList.map((aCompany, i) => (
                  <li onClick={ () => this.handleUseCompany(aCompany, i)} key={aCompany}>{aCompany}
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
        </div>

        <div style={{backgroundColor: '#ccffcc'}}>
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

        <div style={{backgroundColor: '#ffd1b3'}}>

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
        </div>
        
        <div>
          <h3>IPFS Image example</h3>
          <img alt='Loading...'   src='https://ipfs.infura.io:5001/api/v0/cat?arg=QmQbSJhdokBuazR7LXFpGcVQVEMmUGdxeCq2GNbLjN88yV'/>        
          {/* <img alt='Loading...' src='https://gateway.ipfs.io/ipfs/QmQbSJhdokBuazR7LXFpGcVQVEMmUGdxeCq2GNbLjN88yV/' />
            <img alt='Loading...'   src='https://gateway.ipfs.io/ipfs/QmTDfwTbTkq8k36wPcpAaJWKgUkdmfUFWotWEmKJscHFxE'/>
          */}
        </div>
      </div>
    );
  }
}

export default App;
