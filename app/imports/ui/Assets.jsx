import React, { Component } from 'react';
const algosdk = require("algosdk");

export default class Assets extends Component {
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
    let priceField = document.getElementById("priceField")
    let receiverField = document.getElementById("receiverAField")

    select1.addEventListener("click", function () {
      priceField.value = 500*1000;
      updateMicroAlgoConverter(500*1000);
      receiverField.value = "PGPN6HSIXJT73IHLCSAH74NQB2KRGGZP3IPX5XKXA46LUIVOSOEYL3TOI4"
    });
    select2.addEventListener("click", function () {
      priceField.value = 1100*1000;
      updateMicroAlgoConverter(1100*1000);
      receiverField.value = "PGPN6HSIXJT73IHLCSAH74NQB2KRGGZP3IPX5XKXA46LUIVOSOEYL3TOI4"
    });
    select3.addEventListener("click", function () {
      priceField.value = 1400*1000;      
      updateMicroAlgoConverter(1400*1000);
      receiverField.value = "MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU"
    });

    document.getElementById('btnRefreshAccounts').addEventListener('click', fetchAccounts);
    document.getElementById('btnSignAndSend').addEventListener('click', executeSplitTransaction);

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
              <h1 className="title">Asset management</h1>

              <p className="subtitle">
                Pay or receive rent for your asset-backed PV tokens. The rent includes a maintenance fee which is automatically sent to Peer2Panel by the smart contract.
              </p>


              <table>
                <tr><th>Owner</th><th>Expiry</th><th>Asset name</th><th>Supplied electricity</th><th>Price per kWh</th><th>Total price</th><th></th></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>09/2022</td><td>PV Zurich 1</td><td>5000</td><td>0.1 mili-ALGO</td><td>0.5 ALGO</td><td><a id="select1">pay now</a></td></tr>
                <tr><td>PGPN6HSIXJT73IHLCSAH...</td><td>09/2022</td><td>PV Zurich 7</td><td>5500</td><td>0.2 mili-ALGO</td><td>1.1 ALGO</td><td><a id="select2">pay now</a></td></tr>
                <tr><td>MXGQURRN2EDHAEXDXEE4...</td><td>08/2022</td><td>PV Zurich 5</td><td>7000</td><td>0.2 mili-ALGO</td><td>1.4 ALGO</td><td><a id="select3">pay now</a></td></tr>
              </table>

              <div className="columns">
                <div className="column">
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">Sender</label>
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
              <div className="columns">
                <div className="column is-10">
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">PV NFT owner</label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <div className="select is-fullwidth">
                            <select id="receiverAField" disabled>
                              <option value="-1">Select PPA above</option>
                              <option value="PGPN6HSIXJT73IHLCSAH74NQB2KRGGZP3IPX5XKXA46LUIVOSOEYL3TOI4">PGPN6HSIXJT73IHLCSAH74NQB2KRGGZP3IPX5XKXA46LUIVOSOEYL3TOI4</option>
                              <option value="MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU">MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU</option>    
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
                <div className="column is-2">
                  <div className="field is-horizontal">
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input id="percentOfPaymentAField" className="input" type="number" value="90" onchange="balancePercentageFields(this.id);" disabled />
                          <div className="icon is-small is-left">
                            <i className="fas fa-percent"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="columns">
                <div className="column is-10">
                  <div className="field is-horizontal">
                    <div className="field-label is-normal">
                      <label className="label">SolarCoin <i>maintenance</i></label>
                    </div>
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <div className="select is-fullwidth">
                            <select id="receiverBField" disabled>
                              <option value="PGPN6HSIXJT73IHLCSAH74NQB2KRGGZP3IPX5XKXA46LUIVOSOEYL3TOI4">PGPN6HSIXJT73IHLCSAH74NQB2KRGGZP3IPX5XKXA46LUIVOSOEYL3TOI4</option>
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
                <div className="column is-2">
                  <div className="field is-horizontal">
                    <div className="field-body">
                      <div className="field">
                        <div className="control is-expanded has-icons-left">
                          <input id="percentOfPaymentBField" className="input" type="number" value="10" disabled
                            onchange="balancePercentageFields(this.id);" />
                          <div className="icon is-small is-left">
                            <i className="fas fa-percent"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal">
                <div className="field-label is-normal">
                  <label className="label">Total price</label>
                </div>
                <div className="field-body">
                  <div className="field has-addons">
                    <div className="control is-expanded has-icons-left">
                      <input className="input" id="priceField" placeholder="µAlgos" onchange="updateMicroAlgoConverter(this.value);" disabled />
                      <div className="icon is-small is-left">
                        <i className="fas fa-coins"></i>
                      </div>
                    </div>
                    <p className="control">
                      <a className="button is-static" id="microToAlgo">
                        0 Algos
                      </a>
                    </p>
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

function executeSplitTransaction() {
  let sender = document.getElementById('paymentAccountField').value;
  let recipient1 = document.getElementById('receiverAField').value;
  let recipient2 = document.getElementById('receiverBField').value;
  let ratio1 = document.getElementById('percentOfPaymentAField').value;
  let ratio2 = document.getElementById('percentOfPaymentBField').value;
  let amount = document.getElementById('priceField').value;
  let contractAddress = null;

  if(amount * ratio1 / 100 < 3000 || amount * ratio2 / 100 < 3000) {
    document.getElementById('errorMessage').innerHTML = 
    "The amount each recipient is paid must be at least 3000 µAlgos."
    document.getElementById('successDialog').classList.add("is-hidden");
    document.getElementById('errorDialog').classList.remove("is-hidden");

    return;
  }

  showProcessingModal("Creating split contract...");

  fetch(
      `createSplitContract?sender=${sender}&recipient1=${recipient1}&ratio1=${ratio1}&recipient2=${recipient2}&ratio2=${ratio2}`
    )
    .then((d) => d.json())
    .then((d) => {
      if (d["error"]) {
        var e = {"message": d["error"].response.text};
        throw e;
      } else {
        contractAddress = d.contractAddress;
        showProcessingModal("Funding contract...")
      }
    })
    // connect to AlgoSigner
    .then(
      () => AlgoSigner.connect()
    )
    // get the current params
    .then(() => AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/params'
    }))
    // send payment to be split + minimum & execution fees (one fee for each split payment)
    .then((txParams) => {
      console.log(txParams);
      let sdkTx = new algosdk.Transaction({
        from: sender,
        to: contractAddress,
        amount: +amount + 100000 + (txParams['min-fee'] * 2),
        //note: 'Payment to split', //note must be a Uint8Array.
        type: 'pay', // Payment (pay)
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
    // send signed transaction
    .then((signedTx) => {
      console.log(signedTx)
      const snd = AlgoSigner.send({
        ledger: 'TestNet',
        tx: signedTx[0].blob
      })
      console.log(snd);
      return snd;
    })
    // wait for confirmation from the blockchain
    .then((tx) => waitForAlgosignerConfirmation(tx))
    .then(() => {
      document.getElementById('processingMessage').innerHTML = "Executing contract...";
    })
    // after the contract funding is confirmed, execute the split
    .then(() => fetch(`executeSplitContract?address=${contractAddress}&amount=${amount}`))
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

function balancePercentageFields(sender) {
  var percentAElement = document.getElementById('percentOfPaymentAField');
  var percentBElement = document.getElementById('percentOfPaymentBField');

  if (sender == "percentOfPaymentAField") {
    percentAElement.value = Math.max(Math.min(percentAElement.value, 100), 0);
    percentBElement.value = 100 - percentAElement.value;
  } else if (sender == "percentOfPaymentBField") {
    percentBElement.value = Math.max(Math.min(percentBElement.value, 100), 0);
    percentAElement.value = 100 - percentBElement.value;
  }
}