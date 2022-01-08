import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {
    NavLink
  } from "react-router-dom";
import AccountsUIWrapper from './AccountsUIWrapper.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import LanguageSelector from './LanguageSelector';

function NavBar (props) {
    const {isLoggedIn, username, openLoginModal, logout} = props;
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>
          <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/">
            <img src={"/peer2panel_logo.jpg"} style={{height: "80px"}}/>
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/trade">Trade</Nav.Link>
            <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/mint">Mint</Nav.Link>
            <Nav.Link as={NavLink} exact activeClassName="activeNav" to="/assets">Assets</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        {/*<Navbar.Collapse className="justify-content-end" style={{paddingRight: "0px"}}>
          <AccountsUIWrapper />
        </Navbar.Collapse>*/}
        <Navbar.Collapse className="justify-content-end" style={{paddingRight: "0px"}}>
          <div style={{marginLeft: "0px"}}>
            <LanguageSelector />
          </div>
          <div>
            <button id="btnRefreshAccounts">Authenticate</button>
          </div>
        </Navbar.Collapse>
      </Navbar>
    )
  }

export default NavBar;