import React, { Component } from 'react';

export default class Hello extends Component {
  state = {
    counter: 0,
  }

  increment() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {
    return (
      <div>
        <div>Email settings</div>
        <div>
          for any event/weekly/never
        </div>
        <br />
        <div>Membership</div>
        <div>
          <div>You are currently a Platinum member</div>
          <div>You have 10/10 open applications remaining.</div>
          <a href="#">Upgrade</a>/<a href="#">cancel</a>
        </div>
      </div>
    );
  }
}
