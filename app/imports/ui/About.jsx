import React, { Component } from 'react';

export default class About extends Component {
  state = {
    counter: 0,
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {
    return (
      <div>
        <h2 className="title">Getting started</h2>
        <div className="notification is-info is-light">
            <p className="pb-2"><strong>Before you begin, you should have the <a target="_blank"
              href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm">AlgoSigner
              Google Chrome extension</a></strong>
            <br/>You can get play money from the <a target="_blank" href="https://testnet.algoexplorer.io/dispenser">faucet</a>
            <br/>You should have ALGO and USDC in your wallet.</p>
        </div>
      </div>
    );
  }
}
