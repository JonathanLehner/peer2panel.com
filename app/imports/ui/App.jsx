import React from 'react';
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

const App = (props) => (
  <div>
    <T name="123" name2="456">Common.intro</T>
    <Router {...props}>
      <NavBar />
      <RouterSwitch />
    </Router>
  </div>
);

const MeteorApp = withTracker(({ }) => {
  const user = Meteor.user();
  return {
    user,
  };
})(App);

export default MeteorApp;
