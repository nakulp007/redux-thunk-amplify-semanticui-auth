import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Dimmer, Form, Icon, Loader } from 'semantic-ui-react';
import LoaderButton from "../../components/ui/common/LoaderButton";
import "./ChangePassword.css";

import { connect } from 'react-redux';
import { changePassword } from '../../actions/authActions';

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      oldPassword: "",
      isChanging: false,
      confirmPassword: "",
      changeSuccessful: false
    };
  }

  validateForm() {
    return (
      this.state.oldPassword.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleChangeClick = async event => {
    event.preventDefault();
    this.setState({ isChanging: true });
    try {
        await this.props.changePassword(this.state.oldPassword, this.state.password);
        this.setState({ changeSuccessful: true });
        setTimeout(this.returnToSettings, 2000);
    } catch (e) {
      alert(e.message);
      this.setState({ isChanging: false });
    }
  };

  returnToSettings = () => {
    this.props.history.push("/settings");
  }

  renderChangeSuccessful() {
    return (
      <div className="changeSuccessful">
        <Icon name="check" className="icon"/>
        <p>Password Changed Successfully</p>
      </div>
    );
  }

  renderChangeForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isChanging} inverted page>
          <Loader inverted>Changing Password…</Loader>
        </Dimmer>
        <Form onSubmit={this.handleChangeClick}>
          <Form.Input
              id='oldPassword'
              label='Old Password'
              autoFocus
              type="password"
              onChange={this.handleChange}
              value={this.state.oldPassword}
          />
          <hr />
          <Form.Input
              id='password'
              label='New Password'
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
          />
          <Form.Input
              id='confirmPassword'
              label='Confirm Password'
              type="password"
              onChange={this.handleChange}
              value={this.state.confirmPassword}
          />
          <LoaderButton
              fluid
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isChanging}
              text="Change Password"
              loadingText="Changing…"
          />
        </Form>
      </Fragment>
    );
  }

  render() {
    return (
      <div className="ChangePassword">
        {!this.state.changeSuccessful
          ? this.renderChangeForm()
          : this.renderChangeSuccessful()
        }
      </div>
    );
  }
}

ChangePassword.propTypes = {
    changePassword: PropTypes.func.isRequired
};
  
const mapStateToProps = state => ({
});

const mapDispatchToProps = { changePassword };

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);