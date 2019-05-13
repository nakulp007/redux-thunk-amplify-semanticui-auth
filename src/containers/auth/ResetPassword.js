import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Button, Dimmer, Form, Icon, Loader } from 'semantic-ui-react';
import LoaderButton from "../../components/ui/common/LoaderButton";
import "./ResetPassword.css";

import { connect } from 'react-redux';
import { forgotPassword, resetPassword, loginUser } from '../../actions/authActions';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: this.props.location.state && this.props.location.state.email ? this.props.location.state.email : "", //use values passed to it from transition from previous screen or default "",
      password: "",
      codeSent: false,
      confirmed: false,
      confirmPassword: "",
      isConfirming: false,
      isSendingCode: false,
      isLoggingIn: false
    };
  }

  validateCodeForm() {
    return this.state.email.length > 0;
  }

  validateResetForm() {
    return (
      this.state.code.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSendCodeClick = async event => {
    event.preventDefault();
    this.setState({ isSendingCode: true });
    try {
      await this.props.forgotPassword(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isSendingCode: false });
  };

  handleConfirmClick = async event => {
    event.preventDefault();
    this.setState({ isConfirming: true });
    try {
      await this.props.resetPassword(this.state.email, this.state.password, this.state.code);
      this.setState({ confirmed: true });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isConfirming: false });
  };

  handleLogin = async event => {
    event.preventDefault();
    this.setState({ isLoggingIn: true });
    try{
      await this.props.loginUser(this.state.email, this.state.password);
    }catch (e){
      console.error(e);
      alert("Error logging in.")
      this.setState({ isLoggingIn: false });
    }
  }

  renderRequestCodeForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isSendingCode} inverted page>
          <Loader inverted>Sending Code…</Loader>
        </Dimmer>
        <Form onSubmit={this.handleSendCodeClick}>
            <Form.Input 
              id='email'
              label='Email'
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
            <LoaderButton
              fluid
              type="submit"
              loadingText="Sending Code…"
              text="Send Confirmation"
              isLoading={this.state.isSendingCode}
              disabled={!this.validateCodeForm()}
            />
        </Form>
      </Fragment>
    );
  }

  renderConfirmationForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isConfirming} inverted page>
          <Loader inverted>Confirm…</Loader>
        </Dimmer>
        <Form onSubmit={this.handleConfirmClick}>
            <Form.Input
              id='code'
              label='Confirmation Code'
              autoFocus
              type="tel"
              value={this.state.code}
              onChange={this.handleChange}
            />
            <p>Please check your email ({this.state.email}) for the confirmation code.</p>
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
              type="submit"
              text="Confirm"
              loadingText="Confirm…"
              isLoading={this.state.isConfirming}
              disabled={!this.validateResetForm()}
            />
        </Form>
      </Fragment>
    );
  }

  renderSuccessMessage() {
    /*
    <Link to="/login">
            Click here to login with your new credentials.
          </Link>
    */
    return (
      <div className="success">
        <Icon name="check" className="icon"/>
        <p>Your password has been reset.</p>
        <p>
          <Button onClick={this.handleLogin} className="link-button">
            Click here to login with your new credentials.
          </Button>
        </p>
      </div>
    );
  }

  renderLoggingIn() {
    return (
      <div className="loggingIn">
        <Loader active inline='centered'>Logging in...</Loader>      
      </div>
    );
  }

  render() {
    return (
      <div className="ResetPassword">
        {!this.state.codeSent
          ? this.renderRequestCodeForm()
          : !this.state.confirmed
            ? this.renderConfirmationForm()
            : !this.state.isLoggingIn
              ? this.renderSuccessMessage()
              : this.renderLoggingIn()
        }
      </div>
    );
  }
}

ResetPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired
};

//get state from redux store and map it to props of this component
const mapStateToProps = state => ({
    //user is the name we have given to userReducer in combineReducers
    //after this the compnent should have a prop named user 
    //that contains data from user object in global store
    //user: state.user,
});

const mapDispatchToProps = { forgotPassword, resetPassword, loginUser };

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);