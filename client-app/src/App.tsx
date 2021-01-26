import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ImportsNotUsedAsValues } from "typescript";

class App extends Component {
  state = {
    values: [],
  };

  componentDidMount() {
    this.setState({
      values: [
        { id: 1, name: "Value 101" },
        { id: 2, name: "Value 102" },
        { id: 3, name: "Value 103" },
      ],
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <ul>
            {this.state.values.map((v: any) => {
              return <li>{v.name}</li>;
            })}
          </ul>
        </header>
      </div>
    );
  }
}

export default App;
