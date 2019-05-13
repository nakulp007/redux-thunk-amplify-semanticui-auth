import React, { Component } from "react";
import { Header } from 'semantic-ui-react';
import "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <Header as='h1'>Scratch</Header>
          <p>A simple auth app. Created using AWS Amplify and SemanticUI.</p>
        </div>
      </div>
    );
  }
}