import React, { Component } from 'react';

export default class About extends Component {
  state = {
    counter: 0,
  }

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">
            <h1 className="title">About</h1>
            <p>Renewable energy is necessary to avoid climate change. Installations have a high long-term savings potential but they need significant upfront capital investment and periodic maintenance. We focus on the residential solar energy sector, i.e. photovoltaik on houses. We offer a worry-free solution by allowing consumers to rent solar panels which includes their maintenance and insurance as well, with no upfront payment. The capital for this is provided with our blockchain solution on Algorand. In our DApp investors can buy parts of solar installations and receive monthly rent payments from the customers with the USDC stablecoin directly on the blockchain. This allows them to invest globally without worry about local exchange rates. They can also trade their virtual solar panels with other investors on our platform. In this way our Peer2Panel NFTs can give attractive returns and at the same time provide high liquidity to investors.</p>

            <h1 className="title">Getting started</h1>

            <div className="notification is-info is-light">
                <p className="pb-2"><strong>Before you begin, you should have the <a target="_blank"
                  href="https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm">AlgoSigner
                  Google Chrome extension</a></strong>
                <br/>You can get play money from the <a target="_blank" href="https://testnet.algoexplorer.io/dispenser">ALGO faucet</a>{" "}
                and the <a target="_blank" href="https://dispenser.testnet.aws.algodev.network">USDC faucet</a>
                <br/>You should have ALGO and USDC in your wallet.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
