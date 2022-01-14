import React, { Component } from 'react';
const algosdk = require("algosdk");
import Dialogs from './Dialogs.jsx';
import axios from 'axios';

export default class Mint extends Component {
  state = {
    counter: 0,
  }

  render() {
    return (
      <div>
        <section className="section">
          <div className="container">
            <Dialogs/>

            <div id="divDemoBlock" className="">
              <h1 className="title">NFT minting</h1>

              <p className="subtitle">
                Mint an NFT for a PV installation. <i>admin only on mainnet</i>
              </p>
              {this.props.accountsData == null ? 
                <button className="button" id="btnRefreshAccounts" onClick={this.props.fetchAcc}>Authenticate</button>
                    : 
                  <div>
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
                      <div className="field is-horizontal">
                        <div className="field-label is-normal">
                          <label className="label">Name of PV installation</label>
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <div className="control is-expanded has-icons-left">
                              <input defaultValue="Zurich PV Caesar-Ritz-Strasse 5" className="input" id="assetNameField" />
                              <div className="icon is-small is-left">
                                <i className="fas fa-signature"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="field is-horizontal">
                        <div className="field-label is-normal">
                          <label className="label">Image of installation (stored on IPFS!)</label>
                        </div>
                        <div className="field-body">
                          <div className="field">
                            <div className="control is-expanded has-icons-left">
                            <form method="post" encType="multipart/form-data" action="/asset_upload">
                                <input className="input" type="file" name="file" id="imageUpload"/>
                            </form>
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
                              <input defaultValue={10} className="input" id="assetTotalUnitsField" />
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
                  <button onClick={()=>signAndSendTransaction()}className="button is-dark is-fullwidth" id="btnSignAndSend">Sign and mint</button>
                  </div>
              }

             
            </div>
          </div>
        </section>
      </div>
    );
  }
}

//////////////

async function signAndSendTransaction() {
  showProcessingModal("Sending transaction...");

  var bodyFormData = new FormData();
  bodyFormData.append('file', document.getElementById("imageUpload").files[0]);

  const asset = await axios({
    method: "post",
    url: "/asset_upload",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (asset) {
      return asset;
    })
    .catch(function (response) {
      console.log(response);
    });
  console.log(asset);
  const url = asset.data.url;
  const metadata = asset.data.metadata;
  const metadataUint8Array = new Uint8Array(metadata);

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
    .then((txParams) => {
      let sdkTx = new algosdk.Transaction({
        from: from,
        assetName: assetName,
        assetUnitName: assetUnit,
        assetTotal: +assetTotal,
        assetDecimals: +assetDecimals,
        note: algosdk.encodeObj(assetNote),
        assetURL: url,// "https://demo.peer2panel.com/assets/1",
        assetMetadataHash: metadataUint8Array,
        type: 'acfg', // ASA Configuration (acfg)
        fee: txParams['min-fee'],
        firstRound: txParams['last-round'],
        lastRound: txParams['last-round'] + 1000,
        genesisID: txParams['genesis-id'],
        genesisHash: txParams['genesis-hash'],
        flatFee: true,
        assetManager: "D3MSQ7UFLE7UEGHGMUZZW7OKPGX4HTOVCJY6FF3IJLYUZOLAYEES2N4JWU",
        assetReserve: "D3MSQ7UFLE7UEGHGMUZZW7OKPGX4HTOVCJY6FF3IJLYUZOLAYEES2N4JWU",
        assetFreeze: "D3MSQ7UFLE7UEGHGMUZZW7OKPGX4HTOVCJY6FF3IJLYUZOLAYEES2N4JWU",
        assetClawback: "D3MSQ7UFLE7UEGHGMUZZW7OKPGX4HTOVCJY6FF3IJLYUZOLAYEES2N4JWU"
      });
      let binaryTx = sdkTx.toByte();
      let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
      let signedTxs = AlgoSigner.signTxn([ // returns a promise
        {
          txn: base64Tx,
        },
      ]);
      return signedTxs;
    })
    // send signed transaction
    .then((signedTx) => AlgoSigner.send({
      ledger: 'TestNet',
      tx: signedTx[0].blob
    }))
    // wait for confirmation from the blockchain
    .then((tx) => waitForAlgosignerConfirmation(tx)) // see algosignerutils.js
    .then((tx) => {
      // was successful
      console.log(tx);
      document.getElementById('successMessage').innerHTML = "An asset named &quot;" + assetName +
        "&quot; was created. <a target=&quot;_blank&quot; href='https://testnet.algoexplorer.io/tx/" + tx.txId +
        "'>View on AlgoExplorer</a> "+"or <a target=&quot;_blank&quot; href='https://peer2panel.com/assets/"+tx.assetID+"'>View on Peer2Panel</a>";
      document.getElementById('errorDialog').classList.add("is-hidden");
      document.getElementById('successDialog').classList.remove("is-hidden");
      hideProcessingModal();
    })
    .catch((e) => {
      handleClientError(e.message);
      hideProcessingModal();
    });
}



