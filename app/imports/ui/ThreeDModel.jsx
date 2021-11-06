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
        <div>3D room model</div>
        <div>
          3D-Model viewer
        </div>
      </div>
    );
  }
}
