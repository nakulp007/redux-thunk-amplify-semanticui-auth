import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Dimmer, Form, Loader } from 'semantic-ui-react';
import LoaderButton from "../../components/ui/common/LoaderButton";
import "./Login.css";

import { connect } from 'react-redux';
import { loginUser, resendSignupUser } from '../../actions/authActions';


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoading: false,
        email: "",
        password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();    
    this.setState({ isLoading: true });
    try{
      await this.props.loginUser(this.state.email, this.state.password);
      //these probably doesn't work because wer are setup to automatic redirecto to AuthenticatedRoute
      /*
      if (user.challengeName === 'SMS_MFA' || 
          user.challengeName === 'SOFTWARE_TOKEN_MFA') {
          // You need to get the code from the UI inputs
          // and then trigger the following function with a button click
          const code = getCodeFromUserInput();          
          // If MFA is enabled, sign-in should be confirmed with the confirmation code
          const loggedUser = await Auth.confirmSignIn(
              user,   // Return object from Auth.signIn()
              code,   // Confirmation code  
              mfaType // MFA Type e.g. SMS, TOTP.
          );
      } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
          // You need to get the new password and required attributes from the UI inputs
          // and then trigger the following function with a button click
          // For example, the email and phone_number are required attributes
          const { username, email, phone_number } = getInfoFromUserInput();
          const loggedUser = await Auth.completeNewPassword(
              user,               // the Cognito User Object
              newPassword,       // the new password
              // OPTIONAL, the required attributes
              {
                  email,
                  phone_number,
              }
          );
      } else if (user.challengeName === 'MFA_SETUP') {
          // This happens when the MFA method is TOTP
          // The user needs to setup the TOTP before using it
          // More info please check the Enabling MFA part
          Auth.setupTOTP(user);
      } else {
          // The user directly signs in
      }
      */
    }catch (e){
      if (e.code === 'UserNotConfirmedException') {
        // The error happens if the user didn't finish the confirmation step when signing up
        // In this case you need to resend the code and confirm the user
        alert('User is not confirmed.');        
        this.props.resendSignupUser(this.state.email).then(() => {
          this.props.history.push({
            pathname: '/signup',
            state: { email: this.state.email, password: this.state.password, didSignup: true }
          });
        }).catch(e => {
            console.log(e);
            this.setState({ isLoading: false });
        });
      } 
      /*
      else if (err.code === 'PasswordResetRequiredException') {
        // The error happens when the password is reset in the Cognito console
        // In this case you need to call forgotPassword to reset the password
        // Please check the Forgot Password part.
      } else if (err.code === 'NotAuthorizedException') {
        // The error happens when the incorrect password is provided
      } else if (err.code === 'UserNotFoundException') {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
      } 
      */
      else {
        alert(e.message);
        this.setState({ isLoading: false });
      }      
    }    
  }
  
  render() {
    const { isLoading } = this.state;

    return (
      <div className="Login">
        <Dimmer active={isLoading} inverted page>
          <Loader inverted>Logging In</Loader>
        </Dimmer>
        <Form onSubmit={this.handleSubmit} >
          <Form.Input
              id='email'
              label='Email'
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              placeholder="admin@example.com"
          />
          <Form.Input 
              id='password'
              label='Password'
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
              placeholder="Passw0rd!"
          />
          <Form.Field>
            <Link to={{
                pathname: '/login/reset',
                state: {
                  email: this.state.email
                }
              }} >
              Forgot password?
            </Link>
          </Form.Field>
          <LoaderButton
            fluid
            disabled={!this.validateForm()}
            type="submit"
            isLoading={isLoading}
            text="Login"
            loadingText="Logging in…"
          />
        </Form>      
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  resendSignupUser: PropTypes.func.isRequired
};

//get state from redux store and map it to props of this component
const mapStateToProps = state => ({
  //user is the name we have given to userReducer in combineReducers
  //after this the compnent should have a prop named user 
  //that contains data from user object in global store
  //user: state.user,
});

const mapDispatchToProps = { loginUser, resendSignupUser };

export default connect(mapStateToProps, mapDispatchToProps)(Login);