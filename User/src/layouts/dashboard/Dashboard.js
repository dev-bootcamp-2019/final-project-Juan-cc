import React, { Component } from 'react'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>User Dashboard</h1>
            <h2>Account Public Key</h2>
            <p>{this.props.authData.publicEncKey}</p>
            <img src={this.props.authData.avatar.uri} alt="Avatar" height="120" width="120"></img>
            <h2>DID</h2>
            <p>{this.props.authData.did}</p>
            <h2>Name</h2>
            <p>{this.props.authData.name}</p>
            <h2>Country</h2>
            <p>{this.props.authData.country}</p>
            <h2>Phone</h2>
            <p>{this.props.authData.phone}</p>
            
            <h1>Tokens List</h1>
            <h2>BC1</h2>
            <p>Quantity: 10</p>
            <h2>BC2</h2>
            <p>Quantity: 35</p>
            <h2>BC39</h2>
            <p>Quantity: 83</p>
            
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
