import React, { Component } from 'react';
const algosdk = require("algosdk");
import './trade.css';
import Dialogs from './Dialogs.jsx';

export default class Trade extends Component {
  state = {
    counter: 0,
    dexData: [
      {address: "PGPN6HSIXJT73IHLCSAH", location: "PV Zurich 1", price: "80", rent: "10"},
      {address: "PGPN6HSIXJT73IHLCSAH", location: "PV Zurich 1", price: "88", rent: "11"},
      {address: "PGPN6HSIXJT73IHLCSAH", location: "PV Zurich 5", price: "85", rent: "14"},
      {address: "PGPN6HSIXJT73IHLCSAH", location: "PV Zurich 3", price: "80", rent: "10"},
      {address: "PGPN6HSIXJT73IHLCSAH", location: "PV Zurich 7", price: "83", rent: "12"},
    ],
    priceField_value: 0,
    selectedIndex: -1,
    isListing: false
  }

  componentDidMount(){

    var closeButtonElements = document.getElementsByClassName('delete');
  
    for (var i = 0; i < closeButtonElements.length; i++) {
      closeButtonElements[i].addEventListener('click', (e) => {
        e.target.parentElement.parentElement.classList.add('is-hidden');
      });
    }
    
  }

  select(index){
    this.setState({isListing: false, selectedIndex: index, priceField_value: this.state.dexData[index].price})
  }

  openListing(){
    this.setState({isListing: true, selectedIndex: -1});
  }

  cancelPurchase(){
    this.setState({selectedIndex: -1});
  }

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">
            <Dialogs />

            <div id="divDemoBlock" className="">
              <h1 className="title">PV token marketplace</h1>

              <p className="subtitle">
                Pay USDC to another investor, to get Photolvoltaic (PV) NFTs. Or sell your own PV tokens.
              </p>
              <table>
                <tbody>
                  <tr><th>Owner</th><th>Asset name</th><th>Rent per month (USDC)</th><th>Asking price (USDC)</th><th></th></tr>
                  {this.state.dexData.map((dexEntry, index) => {
                    return <tr style={this.state.selectedIndex == index?{background: "gray"}:{}} key={index}><td>{dexEntry.address}</td><td>{dexEntry.location}</td><td>{dexEntry.rent}</td><td>{dexEntry.price}</td><td><a style={{textDecoration: "underline"}} onClick={()=>this.select(index)}>buy</a></td></tr>
                  })}
                </tbody>
              </table>
              <div style={{padding: "20px"}}>
                <button className="button" id="btnList" onClick={()=>this.openListing()}>List a PV token</button>
                {this.state.isListing == false ? "" :
                  <div>
                    Put listing price
                  </div>
                  }
              </div>

              {this.state.selectedIndex == -1 ? "" : 
                  <div style={{padding: "20px"}}>{this.props.accountsData == null ? 
                    <button className="button" id="btnRefreshAccounts" onClick={this.props.fetchAcc}>Authenticate to buy</button>
                    : <div>
                    <div className="columns" style={{border: "solid thin grey"}}>
                      <div className="column">
                        <div className="field is-horizontal">
                          <div className="field-label is-normal">
                            <label className="label">Price</label>
                          </div>
                          <div className="field-body">
                            <div className="field">
                              <div className="control is-expanded has-icons-left">
                                <div className="select is-fullwidth">
                                  <input value={this.state.priceField_value} className="input" id="priceField" disabled />
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
                                    {this.props.accountsData.map((account)=>{
                                      return <option key={account.address} value={account.address}>{account.address}</option>
                                    })}
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
                    <button onClick={()=>{executePVTransaction()}} className="button is-dark is-fullwidth" id="btnSignAndSend">Sign and buy</button>
                    <a style={{textDecoration: "underline"}} onClick={()=>this.cancelPurchase()}>Cancel</a>
                  </div>
                    }
                </div>}
            </div>
          </div>
        </section>
        {/* DEX html */}
        <table className="blueTable" style={{borderCollapse: "collapse", width: "100%"}} border="1">
         <tbody>
            <tr style={{"height": "21px"}}>
               <td style={{ width: "33.3333%", height: "21px" }}>
                  <p><span style={{ color: "#808080" }}><strong>Execute Order</strong></span></p>
               </td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>Current Open Orders</strong></span></td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>Open Order</strong></span></td>
            </tr>
            <tr style={{height: "285px"}}>
               <td style={{width: "33.3333%", height: "285px"}}>&nbsp;</td>
               <td style={{width: "33.3333%", height: "285px", textAlign: "center"}}>
                  <div>
                     <label>N-D-Max-Min-Asset</label>
                     <form>
                        <select id="ta" size="20" width='250px'>
                        </select>
                     </form>
                     <label id='listingaccount' className="orders">Select Order</label>
                  </div>
               </td>
               <td style={{width: "33.3333%", height: "285px"}}>
                  <div>
                     <div><span style={{ color: "#808080" }}><strong>N units of the asset per D microAlgos</strong></span></div>
                  </div>
               </td>
            </tr>
            <tr style={{ height: "21px" }}>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>Spending Asset ID: </strong></span><input id="buyer_assetid" type="number" /></td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>Asset ID:</strong></span></td>
               <td style={{ width: "33.3333%", height: "21px" }}><input id="assetid" type="number" /></td>
            </tr>
            {/*<tr style={{ height: "21px" }}>
               <td style={{ width: "33.3333%", height: "21px" }}><strong>Asset Amount: </strong></span><input id="buyer_assets" type="number" /></td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>Min MicroAlgos:</strong></span></td>
               <td style={{ width: "33.3333%", height: "21px" }}><input id="min" type="number" /></td>
            </tr>
            <tr style={{ height: "21px" }}>
               <td style={{ width: "33.3333%", height: "21px" }}><strong>Receive MicroAlgo: </strong></span><input id="buyer_algos" type="number" /></td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>Max MicroAlgos:</strong></span></td>
               <td style={{ width: "33.3333%", height: "21px" }}><input id="max" type="number" /></td>
            </tr>*/}
            <tr style={{ height: "21px" }}>
               <td style={{ width: "33.3333%", height: "21px" }}>&nbsp;</td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>N:</strong></span></td>
               <td style={{ width: "33.3333%", height: "21px" }}><input id="N" type="number" /></td>
            </tr>
            <tr style={{ height: "21px" }}>
               <td style={{ width: "33.3333%", height: "21px" }}>&nbsp;</td>
               <td style={{ width: "33.3333%", height: "21px" }}><span style={{ color: "#808080" }}><strong>D:</strong></span></td>
               <td style={{ width: "33.3333%", height: "21px" }}><input id="D" type="number" /></td>
            </tr>
            <tr>
               <td style={{ width: "33.3333%" }}><button id="eo" className="myButton" type="button">Execute Order </button><button id="ro" className="myButton" type="button">Refresh Orders </button></td>
               <td style={{ width: "33.3333%" }}><button id="oi" className="myButton" type="button">Opt In to App </button><button id="oo" className="myButton" type="button">Opt Out of App </button></td>
               <td style={{ width: "33.3333%" }}><button id="po" className="myButton" type="button">Place Order </button><button id="co" className="myButton" type="button">Close Order </button></td>
            </tr>
         </tbody>
        </table>

      </div>
    );
  }
}

//////////////

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