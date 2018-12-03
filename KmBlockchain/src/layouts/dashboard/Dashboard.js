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
            <h1>KmBlockchain Platform Dashboard</h1>
            <h2>Account Public Key</h2>
            <p>{this.props.authData.publicEncKey}</p>
            <h2>DID</h2>
            <p>{this.props.authData.did}</p>
            <h2>Name</h2>
            <p>{this.props.authData.name}</p>
            <h2>Companies list</h2>
            <p><strong>BC1</strong>:Token1, Token2, Token3</p>
            <p><strong>BC2</strong>:Token1, Token2</p>
            <p><strong>BC4</strong>:Token9, Token4, Token2</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
