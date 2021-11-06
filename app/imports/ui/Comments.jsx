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
        <div>
          <div>
            <div>Question1</div>
            <div>Answer</div>
          </div>
          <div>
            <div>Question2</div>
            <div>Answer</div>
          </div>
        </div>
      </div>
    );
  }
}
