/*
Since we need to show the user a form to enter the confirmation code, 
we are conditionally rendering two forms based on if we have a 
user object or not.

We are using the LoaderButton component that we created earlier 
for our submit buttons.

Since we have two forms we have two validation methods called 
validateForm and validateConfirmationForm.

We are setting the autoFocus flags on the email and the confirmation 
code fields.


In handleSubmit we make a call to signup a user and set didSignup to true

In handleConfirmationSubmit use the confirmation code 
to confirm the user.

With the user now confirmed, 
Cognito now knows that we have a new user that can login to our app.

Use the email and password to authenticate exactly 
the same way we did in the login page.

Finally, redirect to the homepage.





A quick note on the signup flow here. 
If the user refreshes their page at the confirm step, 
they won’t be able to get back and confirm that account. 
It forces them to create a new account instead. 

We are keeping things intentionally simple but here are a 
couple of hints on how to fix it.
1. Check for the UsernameExistsException in the handleSubmit method’s catch block.
2. Use the Auth.resendSignUp() method to resend the code if the user has not been previously confirmed. Here is a link to the Amplify API docs.
3. Confirm the code just as we did before.


Now while developing you might run into cases 
where you need to manually confirm an unauthenticated user. 
You can do that with the AWS CLI using the following command.

aws cognito-idp admin-confirm-sign-up \
   --region YOUR_COGNITO_REGION \
   --user-pool-id YOUR_COGNITO_USER_POOL_ID \
   --username YOUR_USER_EMAIL
*/

import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Dimmer, Form, Icon, Loader } from 'semantic-ui-react';
import LoaderButton from "../../components/ui/common/LoaderButton";
import "./Signup.css";

import { connect } from 'react-redux';
import { signupUser, confirmUser, loginUser } from '../../actions/authActions';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoggingIn: false,
      email: this.props.location.state && this.props.location.state.email ? this.props.location.state.email : "", //use values passed to it from transition from previous screen or default "",
      password: this.props.location.state && this.props.location.state.password ? this.props.location.state.password : "",
      didSignup: this.props.location.state && this.props.location.state.didSignup ? this.props.location.state.didSignup : false,
      confirmPassword: this.props.location.state && this.props.location.state.password ? this.props.location.state.password : "",
      confirmationCode: "",
      emailConfirmed: false,
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this.props.signupUser(this.state.email, this.state.password);
      this.setState({ didSignup: true });
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }
  
  handleConfirmationSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await this.props.confirmUser(this.state.email, this.state.confirmationCode);
      this.setState({ emailConfirmed: true });
      setTimeout(this.handleLogin, 2000);
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  handleLogin = async () => {
    //we are calling this directly so there would be no event variable
    //event.preventDefault();
    this.setState({ isLoggingIn: true });
    try{
      await this.props.loginUser(this.state.email, this.state.password);
    }catch (e){
      console.error(e);
      //sometimes login can fail when came in through non normal route (/login) to just confirm user without providing correct password.
      alert(e.message);
      this.props.history.push('/login');
    }
  }

  renderConfirmationForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isLoading} inverted page>
          <Loader inverted>Verifying…</Loader>
        </Dimmer>
        <Form onSubmit={this.handleConfirmationSubmit}>
            <Form.Input
              id='confirmationCode'
              label='Confirmation Code'
              autoFocus
              type="tel"
              value={this.state.confirmationCode}
              onChange={this.handleChange}
            />
            <p>Please check your email for code.</p>
            <LoaderButton
              fluid
              disabled={!this.validateConfirmationForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Verify"
              loadingText="Verifying…"
            />
        </Form>
      </Fragment>
    );
  }

  renderForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isLoading} inverted page>
          <Loader inverted>Signing up…</Loader>
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
          <Form.Input 
            id='confirmPassword'
            label='Confirm Password'
            type="password"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            placeholder="Passw0rd!"
          />
          <LoaderButton
            fluid
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Signup"
            loadingText="Signing up…"
          />
        </Form>
      </Fragment>
    );
  }

  renderEmailConfirmationSuccess() {
    return (
      <div className="confirmationSuccess">
        <Icon name="check" className="icon"/>
        <p>Email Confirmed Successfully</p>
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
      <div className="Signup">
        {!this.state.didSignup
          ? this.renderForm()
          : !this.state.emailConfirmed
            ? this.renderConfirmationForm()
            : !this.state.isLoggingIn
              ? this.renderEmailConfirmationSuccess()
              : this.renderLoggingIn()
        }
      </div>
    );
  }
}

Signup.propTypes = {
  //isAuthenticated is being passed to props from Routes to childs
  isAuthenticated: PropTypes.bool.isRequired,

  signupUser: PropTypes.func.isRequired,
  confirmUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = { signupUser, confirmUser, loginUser };

export default connect(mapStateToProps, mapDispatchToProps)(Signup);