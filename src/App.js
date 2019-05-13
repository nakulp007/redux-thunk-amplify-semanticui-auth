import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";

import {
  Button,
  Header,
  Message
} from 'semantic-ui-react';

import Shell from './components/ui/Shell';

import { connect } from 'react-redux';

import { resendChangeEmail, checkCurrentSession, logoutUser } from './actions/authActions';
import { toggleSidebar } from './actions/generalActions';

class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      checkingCurrentSession: true,
      footerMessageEmailVerificationVisible: false,
    };
  }

  async componentDidMount() {
    try{
      await this.props.checkCurrentSession();
    } catch(e) {
      alert(e.message);
    }
    this.setState({
      checkingCurrentSession: false
    });
  }

  componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      // if user logs in or out
      // also gets called on initial load when default value of isAuthenticated changes from false to true
      if (this.props.email_verified !== prevProps.email_verified) {
        this.checkUserStatus();
      }
  }

  // checks if user email is verified
  checkUserStatus = () => {
      if(this.props.email_verified === this.state.footerMessageEmailVerificationVisible){
        //can't rely on default value because user can logout and login with different account
        //in that case this component never reloads and default is not valid
        //this way we always modify state depending on current user verification true or false
        //also we only change state when it needs to causing less refreshes
        this.setState({ footerMessageEmailVerificationVisible: !this.state.footerMessageEmailVerificationVisible });
      }
  }
 
  handleLogout = async event => {
    await this.props.logoutUser();
    //redirect user to login page
    this.props.history.push("/login");
  }

  onResendVerificationEmailClicked = () => {
    this.props.resendChangeEmail();
  }

  getFooterMessages() {
    const size = 'mini';
    var emailVerificationMsg = null;
    
    if(this.props.isAuthenticated){
      if(this.state.footerMessageEmailVerificationVisible && this.props.location.pathname !== "/settings/email"){
        const color = 'red';
        emailVerificationMsg = 
          <Message size={size} color={color} onDismiss={() => this.setState({ footerMessageEmailVerificationVisible: false }) } >
            <Message.Content>
              <Message.Header>Important! You have not verified your email address <Header as='h4'>{this.props.email}</Header></Message.Header>
              <Button as={Link} 
                to={{
                  pathname: '/settings/email',
                  state: {
                    email: this.props.email,
                    codeSent: true
                  }
                }} 
                onClick={this.onResendVerificationEmailClicked}
                size='mini' color={color}>Resend verification email
              </Button>
              <Button as={Link}
                to='/settings/email'
                size='mini' color={color}>Change email address
              </Button>
            </Message.Content>
          </Message>
      }
    }
    return (
      <Fragment>
        {emailVerificationMsg}
      </Fragment>
    );
  }

  getMenuItems() {
    const unauthenticatedMenuItems = [
      {
        as: Link,
        to: "/signup",
        content: "Signup"
      },{
        as: Link,
        to: "/login",
        content: "Login"
      }
    ];
    const authenticatedMenuItems = [
      {
        as: Link,
        to: "/settings",
        content: "Settings",
      },{
        content: "Logout",
        onClick: this.handleLogout,
      }
    ];
    var menuItems;
    this.props.isAuthenticated ? menuItems = authenticatedMenuItems : menuItems = unauthenticatedMenuItems;
    return menuItems
  }

  /*
  Since loading the user session is an asynchronous process, 
  we want to ensure that our app does not change states when it 
  first loads. To do this we’ll hold off rendering our app till 
  checkingCurrentSession is false.
  We’ll conditionally render our app based on the checkingCurrentSession flag.
  */
  render() {
    const { checkingCurrentSession } = this.state;

    
    const menuItems = this.getMenuItems();
    const footerMessages = this.getFooterMessages();
    
    return (
      !checkingCurrentSession  &&
      <Shell 
        isAuthenticated={this.props.isAuthenticated}
        sidebarVisible={this.props.sidebarVisible}
        toggleSidebar={this.props.toggleSidebar}
        menuItems={menuItems}
        footerMessages={footerMessages}
      />
    );
  }  
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  email: PropTypes.string, //isRequired doesn't allow null or undefined
  email_verified: PropTypes.bool, //isRequired doesn't allow null or undefined
  sidebarVisible: PropTypes.bool.isRequired,

  checkCurrentSession: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

//get state from redux store and map it to props of this component
const mapStateToProps = state => ({  
  isAuthenticated: state.user.isAuthenticated,
  email: state.user.email,
  email_verified: state.user.email_verified,
  sidebarVisible: state.ui.sidebarVisible,
});

//mapping available actions to props of the component
const mapDispatchToProps = { resendChangeEmail, checkCurrentSession, logoutUser, toggleSidebar };

/*
App component does not have access to the router props directly 
since it is not rendered inside a Route component. 
To be able to use the router props in our App component 
we will need to use the withRouter Higher-Order Component (or HOC).

We need router props so we can route user to login page after clicking logout.
*/
export default withRouter( connect(mapStateToProps, mapDispatchToProps)(App) );