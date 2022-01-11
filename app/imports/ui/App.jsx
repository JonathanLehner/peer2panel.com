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
    this.state = { accountsData: null }       
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
          })
          .catch((e) => {
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
                <progress className="progress is-small is-primary mt-1" max="100">15%</progress>
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


