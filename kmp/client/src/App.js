import React, { Component } from "react";
import KMP from "./contracts/KMP.json";
import KMToken from "./contracts/KMToken.json";
import getWeb3 from "./utils/getWeb3";

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
      companySelected: -1,
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
    const {tokensList, companiesList} = this.state;
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
      }
      this.setState({ 
        web3, 
        accounts, 
        kmpContract: kmpContractInstance,
        activeAccount: accounts[0],
        companiesList: allCompaniesCreatedByUser,
        tokensList : newTokenList,
        companyCounter : allCompaniesCreatedByUser.length
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
          var newEmptyTokenList = this.state.tokensList;
          newEmptyTokenList[this.state.companyCounter]=[];
          this.setState({ 
            companySelected: this.state.companyCounter,
            companyCounter: this.state.companyCounter + 1,
            companiesList: this.state.companiesList.concat(newCompany),
            companyAddress: newCompany,
            tokensList: newEmptyTokenList
           
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
        console.log(evento);
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
    const { accounts, kmpContract, companyName, phone, url, did, ethadd} = this.state;
    const sendMethod = kmpContract.methods.createBCCompany(companyName, phone, url, did, ethadd);
    await sendMethod.send({from: accounts[0]})
    .once('receipt', (receipt) => {
      // receipt example
      //console.log(receipt);
    })
    .on('error', console.error);
  
  };

  handleCreateToken = async (event) =>  {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract, companyAddress, tokenName, symbol, totalSupply} = this.state;
    const sendMethod = kmpContract.methods.createTokenForBCCompany(companyAddress, tokenName, symbol, totalSupply);
    await sendMethod.send({from: accounts[0]})
    .once('receipt', (receipt) => {
      // receipt example
      //console.log(receipt);
    })
    .on('error', console.error);
          
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
    if (this.state.accountNumber > 0) {
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

  handleDisableEnablePlatform = async (event) => {
    event.preventDefault();
    await this.handleAccountChange();
    const { accounts, kmpContract } = this.state;
    const callMethod = kmpContract.methods.activateEmergency();
    await callMethod.send({ from: accounts[0]})
    .on('error', () => { console.log("Error Disabling/Enabling platform");
    }).then((receipt) => {
      console.log(receipt);
    });
  }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App"> 
        <div className="py-3">
        <p className="font-weight-bold">Current User: {this.state.activeAccount}</p>
        <button className="btn btn-outline-danger" onClick={this.handleDisableEnablePlatform} >Circuit Breaker</button>

        </div>

        <div style={{backgroundColor: '#b3d9ff'}}>
        <h2 className="font-weight-bold py-2">STORAGE</h2>
          <h5 className="font-weight-normal">Companies &raquo; Tokens</h5>
            <div className="py-2">
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
        <h2 className="font-weight-bold py-2">UPDATES</h2>
        <div  className="py-2">
          <h5 className="font-weight-normal">Create Company</h5>
          <form onSubmit={this.handleCreateCompany}>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3"><label htmlFor="companyName" className="col-form-label">Company name</label></div>
              <div className="col-4"><input type="text" className="form-control form-control-sm" id="companyName" defaultValue={ this.state.companyName } onChange={this.inputChangeHandler}/></div>
              <div className="col"></div>
            </div>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3"><label htmlFor="phone" className="col-form-label">Phone</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="phone" defaultValue={ this.state.phone } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>
            </div>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3"><label htmlFor="url" className="col-form-label">URL</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="url" defaultValue={ this.state.url } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>
            </div>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3"><label htmlFor="did" className="col-form-label">DID</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="did" defaultValue={ this.state.did } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>
            </div> 
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3"><label htmlFor="ethadd" className="col-form-label">ETH Add</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="ethadd" defaultValue={ this.state.ethadd } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>
            </div>

            <input className="btn btn-outline-secondary btn-sm" type="submit" value="Create company" />
          </form>
        </div>

        <div className="py-4">
          <h5 className="font-weight-normal">Create Company Token</h5>
          <form onSubmit={this.handleCreateToken}>
          <div className="form-row">
              <div className="col"></div>
              <div className="col-3">
              <label htmlFor="companyAddress" className="col-form-label">Company address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="companyAddress" defaultValue={ this.state.companyAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3">
              <label htmlFor="tokenName" className="col-form-label">Token name</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="tokenName" defaultValue={ this.state.tokenName } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3">
              <label htmlFor="symbol" className="col-form-label">Symbol</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="symbol" defaultValue={ this.state.symbol } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>
            </div>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="totalSupply" className="col-form-label">Total supply</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="totalSupply" defaultValue={ this.state.totalSupply } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <input  className="btn btn-outline-secondary btn-sm" type="submit" value="Create Token" />
          </form>
        </div>

        <div className="py-4">
          <h5 className="font-weight-normal">Transfer Token</h5>
          <form onSubmit={this.handleTransferToken}>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3">

              <label htmlFor="tokenAddress" className="col-form-label">Token address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="tokenAddress" defaultValue={ this.state.tokenAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="destUser" className="col-form-label">To</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="destUser" defaultValue={ this.state.destUser } onChange={this.inputChangeHandler}/>
                
              </div>
              <div className="col"><button className="btn btn-outline-secondary btn-sm" onClick={this.handlePreviousAccount}>&laquo;Prev</button> [{this.state.accountNumber}] <button className="btn btn-outline-secondary btn-sm" onClick={this.handleNextAccount}>Next&raquo;</button></div>

            </div>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="amountToTransfer" className="col-form-label">Amount</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="amountToTransfer" defaultValue={ this.state.amountToTransfer } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div>
              <input  className="btn btn-outline-secondary btn-sm" type="submit" value="Transfer Token" />
            </div>
            Result: {this.state.transferResult}

          </form>
        </div>

        </div> {/** Color Div */}

        <div style={{backgroundColor: '#ffd1b3'}}>
        <h2 className="font-weight-bold py-2">QUERIES</h2>
        <div className="py-2">
          <h5 className="font-weight-normal">Get User Token Balance</h5>
          <form onSubmit={this.handleUserTokenBalance}>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="companyAddress" className="col-form-label">Company address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="companyAddress" defaultValue={ this.state.companyAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="tokenAddress" className="col-form-label">Token address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="tokenAddress" defaultValue={ this.state.tokenAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="userAddress" className="col-form-label">User address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="userAddress" defaultValue={ this.state.userAddress } onChange={this.inputChangeHandler}/>
                
              </div>
              <div className="col"><button  className="btn btn-outline-secondary btn-sm" onClick={this.handleCurrentAddress}>My address</button></div>

            </div>
            <div>
              <input  className="btn btn-outline-secondary btn-sm" type="submit" value="Get Balance"/>
            </div>
            Result:{this.state.userTokenBalance}

          </form>
        </div>


        <div className="py-4">
          <h5 className="font-weight-normal">Find Company Owner</h5>
          <form onSubmit={this.handleFindBCOwner}>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="companyAddress" className="col-form-label">Company address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="companyAddress" defaultValue={ this.state.companyAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div>
              <input  className="btn btn-outline-secondary btn-sm" type="submit" value="Get Owner" />
              </div>
              Result: {this.state.companyOwner}
          </form>
        </div>

        <div className="py-4">
          <h5 className="font-weight-normal">Find Company Token</h5>
          <form onSubmit={this.handleFindCompanyToken}>
            <div className="form-row">
            <div className="col"></div>
            <div className="col-3">
              <label htmlFor="companyAddress" className="col-form-label">Company address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="companyAddress" defaultValue={ this.state.companyAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>

            </div>
            <div className="form-row">
              <div className="col"></div>
              <div className="col-3">
              <label htmlFor="tokenAddress" className="col-form-label">Token address</label></div>
              <div className="col-4">
                <input type="text" className="form-control form-control-sm" id="tokenAddress" defaultValue={ this.state.tokenAddress } onChange={this.inputChangeHandler}/>
              </div>
              <div className="col"></div>
            </div>

            <div>
              <input  className="btn btn-outline-secondary btn-sm" type="submit" value="Get Company Token" />
            </div>
            Result: {this.state.tokenFound}
          </form>
        </div>
        </div> {/** Colour div */}
        
        <div>
          <h5 className="font-weight-normal">IPFS Image example</h5>
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
