import React, { Component } from 'react';
const algosdk = require("algosdk");

export default class Trade extends Component {
  state = {
    counter: 0,
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  componentDidMount(){
    
    let select1 = document.getElementById("select1")
    let select2 = document.getElementById("select2")
    let select3 = document.getElementById("select3")
    let select4 = document.getElementById("select4")
    let select5 = document.getElementById("select5")
    let priceField = document.getElementById("priceField")

    console.log(select1);
    select1.addEventListener("click", function () {
      priceField.value = 80
    });
    select2.addEventListener("click", function () {
      priceField.value = 88
    });
    select3.addEventListener("click", function () {
      priceField.value = 85
    });
    select4.addEventListener("click", function () {
      priceField.value = 80
    });
    select5.addEventListener("click", function () {
      priceField.value = 83
    });

    document.getElementById('btnRefreshAccounts').addEventListener('click', fetchAccounts);
    document.getElementById('btnSignAndSend').addEventListener('click', executePVTransaction);

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
              <h1 className="title">PV NFT marketplace</h1>

              <p className="subtitle">
                Pay Algos to another investor, get 1 Photolvoltaic (PV) token.
              </p>
              <table>
                <tr><th>Owner</th><th>Asset name</th><th>Price</th><th></th></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>PV Zurich 1</td><td>80</td><td><a id="select1">select</a></td></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>PV Zurich 1</td><td>88</td><td><a id="select2">select</a></td></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>PV Zurich 5</td><td>85</td><td><a id="select3">select</a></td></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>PV Zurich 3</td><td>80</td><td><a id="select4">select</a></td></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>PV Zurich 7</td><td>83</td><td><a id="select5">select</a></td></tr>
                <div><a>Create listing</a></div>
              </table>

              <div className="columns">
                <div className="column">
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Price</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <div className="select is-fullwidth">
                            <input className="input" id="priceField" disabled />
                            <div className="icon is-small is-left">
                              <i className="fas fa-coins"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Payment Account</label>
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

function executePVTransaction() {
  let paymentAccount = document.getElementById('paymentAccountField').value;
  let price = document.getElementById('priceField').value;
  let contractAddress = null;

  showProcessingModal("Creating limit contract...");

  fetch(`createPVLimitContract?account=${paymentAccount}&price=${price}`)
    .then((d) => d.json())
    /*{
      console.log(d); console.log(await d.json());//return d.json();
    })*/
    .then((d) => {
      console.log(d);
      if (d["error"]) {
        var e = {"message": d["error"].response.text};
        throw e;
      } else {
        // was successful
        contractAddress = d.contractAddress;
        showProcessingModal("Sending opt-in transaction...");
      }
    })
    // connect to AlgoSigner
    .then(
      () => AlgoSigner.connect()
    )
    // fetch current parameters
    .then(() => {
      return AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/transactions/params'
      })
      }
    )
    // opt in to PV
    .then((txParams) => {
      console.log(txParams);
      let sdkTx = new algosdk.Transaction({ //signTxn
        assetIndex: 41927159,
        from: paymentAccount,
        amount: 0,
        to: paymentAccount,
        type: 'axfer',  // ASA Transfer (axfer)
        fee: txParams['min-fee'],
        firstRound: txParams['last-round'],
        lastRound: txParams['last-round'] + 1000,
        genesisID: txParams['genesis-id'],
        genesisHash: txParams['genesis-hash'],
        flatFee: true
      });
      let binaryTx = sdkTx.toByte();
      let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
      let signedTxs = AlgoSigner.signTxn([ // returns a promise
        {
          txn: base64Tx,
        },
      ]);
      console.log(signedTxs);
      return signedTxs;
    }
    )
    // send signed transaction
    .then((signedTx) => {
      console.log(signedTx)
      const snd = AlgoSigner.send({
        ledger: 'TestNet',
        tx: signedTx[0].blob
      })
      console.log(snd);
      return snd;
    }
    )
    .then(() => showProcessingModal("Funding contract..."))
    // fetch updated parameters
    .then(() => AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/params'
    }))
    // pay for PV
    .then((txParams) => {
      console.log(txParams);
      let sdkTx = new algosdk.Transaction({
        from: paymentAccount,
        to: contractAddress,
        amount: +1000000,
        //note: 'Pay for PV', // note must be a Uint8Array.
        type: 'pay',  // Payment (pay)
        fee: txParams['min-fee'],
        firstRound: txParams['last-round'],
        lastRound: txParams['last-round'] + 1000,
        genesisID: txParams['genesis-id'],
        genesisHash: txParams['genesis-hash'],
        flatFee: true
      });
      let binaryTx = sdkTx.toByte();
      let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
      let signedTxs = AlgoSigner.signTxn([ // returns a promise
        {
          txn: base64Tx,
        },
      ]);
      console.log(signedTxs);
      return signedTxs;
    })
    .then((signedTx) => AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTx[0].blob
    }))
    // wait for confirmation from the blockchain
    .then((tx) => waitForAlgosignerConfirmation(tx))
    .then(() => showProcessingModal("Executing contract..."))
    // after the contract funding is confirmed, execute the swap
    .then(() => fetch(`executePVLimitContract?address=${contractAddress}&price=${price}`))
    .then((d) => {
      console.log(d); return d.json();
    })
    .then((d) => {
      if (d["error"]) {
          throw d["error"];
      } else {
        // was successful
        document.getElementById('successMessage').innerHTML = "The transaction with TxID " + d['txId'] +
          " was successfully sent. <a target=&quot;_blank&quot; href='https://testnet.algoexplorer.io/tx/" + d[
            'txId'] +
          "'>View on AlgoExplorer</a>";
        document.getElementById('successDialog').classList.remove("is-hidden");
        document.getElementById('errorDialog').classList.add("is-hidden");
      }

      hideProcessingModal();
    })
    .catch((e) => {
      handleClientError(e.message);
      hideProcessingModal();
    });
}