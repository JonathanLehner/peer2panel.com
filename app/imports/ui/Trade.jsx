import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import './trade.css';
import Dialogs from './Dialogs.jsx';
const algosdk = require("algosdk");

class Trade extends Component {
  state = {
    counter: 0,
    priceField_value: 0,
    contractField_value: 0,
    selectedIndex: -1,
    assetField: null,
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
    console.log("listing");
    console.log(this.props.listings[index]);
    this.setState({
      isListing: false, 
      selectedIndex: index, 
      priceField_value: this.props.listings[index].price,
      contractField_value: this.props.listings[index].contractAddress,
      assetField: this.props.listings[index]
    })
  }

  openListing(){
    this.setState({isListing: true, selectedIndex: -1});
  }

  cancelPurchase(){
    this.setState({selectedIndex: -1});
  }

  cancelListing(){
    this.setState({isListing: false});
  }

  createLimitContract() {
    let paymentAccount = document.getElementById('paymentAccountField').value;
    let price = document.getElementById('priceField').value;
    let assetID = parseInt(document.getElementById('assetField').value);
    let contractAddress = null;
  
    showProcessingModal("Creating limit contract...");
  
    fetch(`createPVLimitContract?account=${paymentAccount}&price=${price}&assetID=${assetID}`)
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
      // send PV token to contract
      .then((txParams) => {
        console.log(txParams);
        let sdkTx = new algosdk.Transaction({ //signTxn
          assetIndex: assetID,
          from: paymentAccount,
          amount: 1,
          to: "7H2A2LV4ZWZPZQ3CWAAXTGDSESNK4SBJIGXDTG45IRKVDTIFMUNYNYHH7A",
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
      // wait for confirmation from the blockchain
      .then((tx) => waitForAlgosignerConfirmation(tx))
      .then(() => {
        const assetInfo = this.props.assets.find(asset => asset['asset-id'] == assetID);
        const rent = assetInfo.rent;

        PVListings.insert({address: paymentAccount, assetID, location: assetInfo.params.name, price, rent, contractAddress})
        hideProcessingModal();
        }
      )
      .catch((e) => {
        handleClientError(e.message);
        hideProcessingModal();
      });
  }

  fundContract(contractAddress){
    let paymentAccount = document.getElementById('paymentAccountField').value;
    let price = document.getElementById('priceField').value;
    const asset = this.state.assetField;
    console.log("fundContract")
    console.log(asset);
    console.log(asset.assetID)

    AlgoSigner.connect()
    .then(()=>showProcessingModal("Sending opt-in transaction..."))
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
        assetIndex: parseInt(asset.assetID),
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
    // fetch updated parameters
    .then(() => AlgoSigner.algod({
      ledger: 'TestNet',
      path: '/v2/transactions/params'
    }))
    // pay for PV
    .then((txParams) => {
      console.log("next transaction")
      console.log(txParams);
      let sdkTx = new algosdk.Transaction({
        from: paymentAccount,
        to: contractAddress,
        amount: +1000000*price,
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
        this.setState({selectedIndex: -1});
        PVListings.remove({_id: asset['_id']});
      }

      hideProcessingModal();
    })
    .catch((e) => {
      handleClientError(e.message);
      hideProcessingModal();
    });
  }

  render() {
    console.log(this.props);
    console.log(this.state);
    return (
      <div>
        <section className="section">
          <div className="container">
            <Dialogs />

            <div id="divDemoBlock" className="">
              <h1 className="title">PV token marketplace</h1>

              <p>
                Pay ALGO to another investor, to get Photovoltaic (PV) tokens. Or sell your own PV tokens.
              </p> 
              <p>
                Since the tokens are on the blockchain you can also trade them on platforms like <a href="https://opensea.io" target="_blank">Opensea.io</a> or directly with your friends.
              </p>
              <table>
                <tbody>
                  <tr><th>Owner</th><th>Asset name</th><th>Asset ID</th><th>Rent per month (USD)</th><th>Asking price (ALGO)</th><th></th></tr>
                  {this.props.listings && this.props.listings.map((dexEntry, index) => {
                    return (<tr style={this.state.selectedIndex == index?{background: "lightgray"}:{}} key={index}>
                              <td>{dexEntry.address.substr(0,12)}...</td>
                              <td>{dexEntry.location}</td>
                              <td><a target="_blank" href={`/assets/${dexEntry.assetID}`}>{dexEntry.assetID}</a></td>
                              <td>{dexEntry.rent}</td>
                              <td>{dexEntry.price}</td>
                              <td><a style={{textDecoration: "underline"}} onClick={()=>this.select(index)}>buy</a></td>
                            </tr>)
                  })}
                </tbody>
              </table>
              <div style={{padding: "20px"}}>
                <button className="button" id="btnList" onClick={()=>this.openListing()}>List a PV token</button>
                {this.state.isListing == false ? "" :
                                  <div style={{marginTop: "20px"}}>{this.props.accountsData == null ? 
                                    <button className="button" id="btnRefreshAccounts" onClick={this.props.fetchAcc}>Authenticate to list</button>
                                    : <div>
                                    <div className="columns" style={{border: "solid thin grey"}}>
                                      <div className="column">
                                        <h5>List a PV token</h5>
                                        <div className="field is-horizontal">
                                          <div className="field-label is-normal">
                                            <label className="label">Asking price</label>
                                          </div>
                                          <div className="field-body">
                                            <div className="field">
                                              <div className="control is-expanded has-icons-left">
                                                <div className="select is-fullwidth">
                                                  <input defaultValue={100} className="input" id="priceField" />
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
                                            <label className="label">Asset</label>
                                          </div>
                                          <div className="field-body">
                                            <div className="field">
                                              <div className="control is-expanded has-icons-left">
                                                <div className="select is-fullwidth">
                                                  <select id="assetField" defaultValue={this.props.assets && this.props.assets[0]["asset-id"]}>
                                                    {this.props.assets && this.props.assets.map((asset)=>{
                                                      return <option key={asset["asset-id"]} value={asset["asset-id"]}>{asset.params.name} ({asset["asset-id"]})</option>
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
                                        <div className="field is-horizontal">
                                          <div className="field-label is-normal">
                                            <label className="label">Account</label>
                                          </div>
                                          <div className="field-body">
                                            <div className="field">
                                              <div className="control is-expanded has-icons-left">
                                                <div className="select is-fullwidth">
                                                  <select id="paymentAccountField" defaultValue={this.props.accountsData && this.props.accountsData[0].address}>
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
                                        <div>
                                          <button className="button" id="btnRefreshAccounts" onClick={this.props.fetchAcc}>refresh assets</button>
                                        </div>
                                      </div>
                                    </div>
                                    <button onClick={()=>{this.createLimitContract()}} className="button is-dark is-fullwidth" id="btnSignAndSend">Sign and list</button>
                                    <a style={{textDecoration: "underline"}} onClick={()=>this.cancelListing()}>Cancel</a>
                                  </div>
                                    }
                                </div>
                  }
              </div>

              {
              this.state.selectedIndex == -1 ? "" : 
                <div style={{padding: "20px"}}>{this.props.accountsData == null ? 
                    <button className="button" id="btnRefreshAccounts" onClick={this.props.fetchAcc}>Authenticate to buy</button>
                    : <div>
                    <div className="columns" style={{border: "solid thin grey"}}>
                      <div className="column">
                        <h5>Buy "{this.props.listings[this.state.selectedIndex].location}" token</h5>
                        <div className="field is-horizontal">
                          <div className="field-label is-normal">
                            <label className="label">Asset</label>
                          </div>
                          <div className="field-body">
                            <div className="field">
                              <div className="control is-expanded has-icons-left">
                                <div className="select is-fullwidth">
                                  <select id="assetField" defaultValue={this.state.assetField.assetID} disabled>
                                    <option key={this.state.assetField.assetID} value={this.state.assetField.assetID}>{this.state.assetField.location} ({this.state.assetField.assetID})</option>
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
                            <label className="label">Contract address</label>
                          </div>
                          <div className="field-body">
                            <div className="field">
                              <div className="control is-expanded has-icons-left">
                                <div className="select is-fullwidth">
                                  <input value={this.state.contractField_value} className="input" id="contractField" disabled />
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
                                  <select id="paymentAccountField" defaultValue={this.props.accountsData && this.props.accountsData[0].address}>
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
                    <button onClick={()=>{this.fundContract(this.state.contractField_value)}} className="button is-dark is-fullwidth" id="btnSignAndSend">Sign and buy</button>
                    <a style={{textDecoration: "underline"}} onClick={()=>this.cancelPurchase()}>Cancel</a>
                  </div>
                    }
                </div>
              }
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const TradeTracked = withTracker(({ }) => {
  const listings = PVListings.find({}).fetch();
  return {
    listings,
  };
})(Trade);

export default TradeTracked;
