
  import React from 'react';
  import {
      BrowserRouter as Router,
      Switch,
      Route,
      Link,
      Redirect
    } from "react-router-dom";
  import About from './About.jsx';
  import Trade from './Trade.jsx';
  import Mint from './Mint.jsx';
  import Rent from './Rent.jsx';
  import Assets from './Assets.jsx';
  import Asset from './Asset.jsx';

  function RouteSwitch(props) {
      return (
          <Switch>
              <Route path="/login">
                  Please log in
              </Route>
              <Route exact path="/">
                <Redirect to="/about" />
              </Route>
              <Route exact path="/about">
                <About {...props} />
              </Route>
              <Route path="/assets/:assetID/"
              children={({ match }) => (<Asset {...props} match />)} />
              <Route exact path="/trade">
                <Trade {...props} />
              </Route>
              <Route exact path="/mint">
                <Mint {...props} />
              </Route>
              <Route exact path="/rent">
                <Rent {...props} />
              </Route>
              <Route exact path="/assets">
                <Assets {...props} />
              </Route>

          </Switch>
      )
    }
  
  export default RouteSwitch;