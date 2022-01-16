import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withTracker } from 'meteor/react-meteor-data';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import NavBar from './NavBar.jsx';
import RouterSwitch from './RouterSwitch.jsx';

import './app.css';

import i18n from 'meteor/universe:i18n';
const T = i18n.createComponent();

class App extends Component  {
  constructor(props) {
    super(props);
    this.state = { accountsData: null, assets: null }       
  }

  componentDidMount(){
    window.addEventListener("load", function () {
      setTimeout(()=>checkForAlgosigner(), 1000); // see algosignerutils.js
    });
  }

  fetchAccounts() {
    if(AlgoSigner){
        showProcessingModal("Please wait...");

        AlgoSigner.connect()
          // fetch accounts
          .then(() => AlgoSigner.accounts({
            ledger: 'TestNet'
          }))
          // populate account dropdowns
          .then((accountsData) => {
            this.setState({accountsData})
            hideProcessingModal();
            return accountsData;
          })
          .then((accountsData) => {
            // for demo we always take the first account in the wallet
            // it is easy to add a dropdown to select
            const address = accountsData[0].address;
            return AlgoSigner.algod({
              ledger: 'TestNet',
              path: `/v2/accounts/${address}`
            });
          })
          .then(async (accountsData) => {
            // for demo we always take the first account in the wallet
            // it is easy to add a dropdown to select
            console.log(accountsData)
            const assets = accountsData.assets;
            console.log(assets);
            for(var i=0; i<assets.length; i++){
              const assetInfo = await AlgoSigner.algod({
                ledger: 'TestNet',
                path: `/v2/assets/${assets[i]['asset-id']}`
              });
              console.log(assetInfo);
              const pvasset = PVContracts.findOne({assetID: assets[i]['asset-id']});
              if(pvasset){
                console.log(pvasset);
                const rent = pvasset.rent;
                accountsData.assets[i] = {...accountsData.assets[i], ...assetInfo, rent};  
              }
              else{
                accountsData.assets[i] = null;
              }
            };
            accountsData.assets = accountsData.assets.filter((el)=>el);
            return accountsData;
          })
          .then((accountsData) => {
            console.log(accountsData);
            let contracts = PVContracts.find({customer: accountsData.address}).fetch();
            if(contracts.length == 0){
              // for demo we use fake data
              contracts = [
                {"current_owner": "MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU", assetName: "Susanne's PV", assetID: 57939801, rent: 8},
                {"current_owner": "MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU", assetName: "Susanne's PV", assetID: 58331139, rent: 10},
                {"current_owner": "MXGQURRN2EDHAEXDXEE4H7XIDA4Q7PUSSXEXCC3Q2ABSKAKCHCLBRF46WU", assetName: "Susanne's PV", assetID: 58547046, rent: 7},
              ]
            }
            const assets = accountsData.assets;
            this.setState({assets, contracts})
          })
          .catch((e) => {
            console.log(e);
            handleClientError(e.message);
            hideProcessingModal();
          });
        }
  }
 
  render(){
    return (
      <div>
        {/*<T name="123" name2="456">Common.intro</T>*/}
        <Router {...this.props} {...this.state}>
          <NavBar fetchAcc={()=>this.fetchAccounts()} {...this.state}/>
          <RouterSwitch fetchAcc={()=>this.fetchAccounts()} {...this.state}/>
          <div className="modal" id="processingModal">
            <div className="modal-background"></div>
            <div className="modal-content">
              <div className="box">
                <span id="processingMessage">Processing, please wait...</span>
                <progress className="progress is-small is-primary mt-1" max="100">20%</progress>
              </div>
            </div>
          </div>
        </Router>
      </div>
    )
  }
};

const MeteorApp = withTracker(({ }) => {
  const user = Meteor.user();
  return {
    user,
  };
})(App);

export default MeteorApp;


