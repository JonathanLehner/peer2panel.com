
  import React from 'react';
  import {
      BrowserRouter as Router,
      Switch,
      Route,
      Link,
      Redirect
    } from "react-router-dom";
  import UserProfile from './UserProfile.jsx';
  import RoomDetail from './RoomDetail.jsx';
  import SearchPage from './SearchPage.jsx';
  import Applications from './Applications.jsx';
  import Settings from './Settings.jsx';

  function RouteSwitch(props) {
      return (
          <Switch>
              <Route path="/login">
                  Please log in
              </Route>
              <Route exact path="/">
                <Redirect to="/search" />
              </Route>
              <PrivateRoute exact path="/profile">
                <UserProfile {...props} />
              </PrivateRoute>
              <PrivateRoute exact path="/room/:id">
                <RoomDetail {...props} />
              </PrivateRoute>
              <PrivateRoute exact path="/search">
                <SearchPage {...props} />
              </PrivateRoute>
              <PrivateRoute exact path="/applications">
                <Applications {...props} />
              </PrivateRoute>
              <PrivateRoute exact path="/settings">
                <Settings {...props} />
              </PrivateRoute>
          </Switch>
      )
    }
  
  export default RouteSwitch;
  
  function PrivateRoute({ children, ...rest }) {
      const isAuthenticated = !!Meteor.userId();
      return (
        <Route
          {...rest}
          render={({ location }) =>
              isAuthenticated ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
          }
        />
      );
    }