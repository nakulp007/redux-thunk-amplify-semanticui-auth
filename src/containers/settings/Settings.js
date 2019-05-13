import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoaderButton from "../../components/ui/common/LoaderButton";
import "./Settings.css";

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="Settings">
        <LoaderButton
            fluid
            text="Change Email"
            as={Link}
            to="/settings/email"
        />
        <LoaderButton
            fluid
            text="Change Password"
            as={Link}
            to="/settings/password"
        />
      </div>
    );
  }
}