import React, { Component } from 'react';
const algosdk = require("algosdk");

export default class Mint extends Component {
  state = {
    counter: 0,
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  componentDidMount(){
    document.getElementById('btnRefreshAccounts').addEventListener('click', fetchAccounts);
    document.getElementById('btnSignAndSend').addEventListener('click', signAndSendTransaction);

    var closeButtonElements = document.getElementsByClassName('delete');
  
    for (var i = 0; i < closeButtonElements.length; i++) {
      closeButtonElements[i].addEventListener('click', (e) => {
        e.target.parentElement.parentElement.classList.add('is-hidden');
      });
    }
    
  }

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">
            <article id="successDialog" className="message is-success is-hidden">
              <div className="message-header">
                <p>Success</p>
                <button className="delete" aria-label="delete"></button>
              </div>
              <div className="message-body">
                <span id="successMessage"></span>
              </div>
            </article>
            <article id="errorDialog" className="message is-danger is-hidden">
              <div className="message-header">
                <p>Error</p>
                <button className="delete" aria-label="delete"></button>
              </div>
              <div className="message-body">
                An error occurred: <span id="errorMessage"></span>
              </div>
            </article>

            <div id="divDemoBlock" className="">
              <h1 className="title">NFT minting</h1>

              <p className="subtitle">
                Mint an NFT for a PV installation. <i>admin only</i>
              </p>
              <div className="columns">
                <div className="column">
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Admin wallet address</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <div className="select is-fullwidth">
                            <select id="paymentAccountField">
                              <option value="-1">No accounts available</option>
                            </select>
                          </div>
                          <div className="icon is-small is-left">
                            <i className="fas fa-wallet"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Name of PV installation</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input className="input" id="assetNameField" />
                          <div className="icon is-small is-left">
                            <i className="fas fa-signature"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Asset Unit Name</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input className="input" id="assetUnitField" value="PV" disabled />
                          <div className="icon is-small is-left">
                            <i className="fas fa-signature"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Total Units</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input className="input" id="assetTotalUnitsField" />
                          <div className="icon is-small is-left">
                            <i className="fas fa-coins"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Decimals</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input className="input" id="assetNumberOfDecimalsField" value={0} disabled />
                          <div className="icon is-small is-left">
                            <i className="fas fa-coins"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Note</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input className="input" id="noteField" placeholder="(optional)" />
                          <div className="icon is-small is-left">
                            <i className="fas fa-sticky-note"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="button is-dark is-fullwidth" id="btnSignAndSend">Sign and Send</button>

             
            </div>
          </div>
          <div className="modal" id="processingModal">
            <div className="modal-background"></div>
            <div className="modal-content">
              <div className="box">
                <span id="processingMessage">Processing, please wait...</span>
                <progress className="progress is-small is-primary mt-1" max="100">15%</progress>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

//////////////

function fetchAccounts() {
  showProcessingModal("Please wait...");

  let paymentAccountSelect = document.getElementById('paymentAccountField');

  renderLoadingSelect(paymentAccountSelect);

  AlgoSigner.connect()
    // fetch accounts
    .then(() => AlgoSigner.accounts({
      ledger: 'TestNet'
    }))
    // populate account dropdowns
    .then((accountsData) => {
      renderAccountSelect(paymentAccountSelect, accountsData);
      hideProcessingModal();
    })
    .catch((e) => {
      handleClientError(e.message);
      hideProcessingModal();
    });
}    

function signAndSendTransaction() {
  showProcessingModal("Sending transaction...");

  let from = document.getElementById('paymentAccountField').value;
  let assetName = document.getElementById('assetNameField').value;
  let assetUnit = document.getElementById('assetUnitField').value;
  let assetTotal = document.getElementById('assetTotalUnitsField').value;
  let assetDecimals = document.getElementById('assetNumberOfDecimalsField').value;
  let assetNote = document.getElementById('noteField').value;

  AlgoSigner.connect()
    // fetch current parameters
    .then(() => AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/params'
    }))
    // sign new transaction
    .then((txParams) => AlgoSigner.sign({
      from: from,
      assetName: assetName,
      assetUnitName: assetUnit,
      assetTotal: +assetTotal,
      assetDecimals: +assetDecimals,
      note: assetNote,
      type: 'acfg', // ASA Configuration (acfg)
      fee: txParams['min-fee'],
      firstRound: txParams['last-round'],
      lastRound: txParams['last-round'] + 1000,
      genesisID: txParams['genesis-id'],
      genesisHash: txParams['genesis-hash'],
      flatFee: true
    }))
    // send signed transaction
    .then((signedTx) => AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTx.blob
    }))
    // wait for confirmation from the blockchain
    .then((tx) => waitForAlgosignerConfirmation(tx)) // see algosignerutils.js
    .then((tx) => {
      // was successful
      document.getElementById('successMessage').innerHTML = "An asset named &quot;" + assetName +
        "&quot; was created. <a target=&quot;_blank&quot; href='https://testnet.algoexplorer.io/tx/" + tx.txId +
        "'>View on AlgoExplorer</a>"
      document.getElementById('errorDialog').classList.add("is-hidden");
      document.getElementById('successDialog').classList.remove("is-hidden");
      hideProcessingModal();
    })
    .catch((e) => {
      handleClientError(e.message);
      hideProcessingModal();
    });
}



