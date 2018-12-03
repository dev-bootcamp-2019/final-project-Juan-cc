import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import Form from 'react-bootstrap/lib/Form';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

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
            <h1>Dashboard</h1>

            <h2>DID</h2>
            <p>{this.props.authData.did}</p>

            <Greeting isLoggedIn={false} />

            <h2>Token list</h2>
            <p><strong>Token1</strong>: 10 units</p>
            <p><strong>Token2</strong>: 32 units</p>
            <p><strong>Token4</strong>: 28 units</p>
            <h2>Create new token</h2>
            <p></p>
            <p></p>

  <Form horizontal>
  <FormGroup controlId="formHorizontalName">
    <Col componentClass={ControlLabel} sm={2}>
    Name:
    </Col>
    <Col sm={10}>
      <FormControl type="text" placeholder="Token Name" />
    </Col>
  </FormGroup>

  <FormGroup controlId="formHorizontalSupply">
    <Col componentClass={ControlLabel} sm={2}>
    Total supply:
    </Col>
    <Col sm={10}>
      <FormControl type="text" placeholder="Total Supply" />
    </Col>
  </FormGroup>
  <FormGroup controlId="formHorizontalSymbol">
    <Col componentClass={ControlLabel} sm={2}>
    Symbol:
    </Col>
    <Col sm={10}>
      <FormControl type="text" placeholder="Symbol" />
    </Col>
  </FormGroup>



  <FormGroup>
    <Col smOffset={2} sm={10}>
      <Button type="submit">Create</Button>
    </Col>
  </FormGroup>
</Form>
          </div>

        </div>
      </main>
    )
  }
}


function UserGreeting(props) {
  return <div><h2>Bus Company info</h2>
  <p><strong>Name:</strong> Chevallier</p>
  <p><strong>Phone:</strong> +506 62626262</p>
  <p><strong>URL:</strong> www.nuevachevallier.com</p></div>;
}

function GuestGreeting(props) {
  return  <div><h2>Bus Company registration</h2>
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
</Form></div>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}


export default Dashboard
