import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';
import { Dimmer, Form, Icon, Loader } from 'semantic-ui-react';
import LoaderButton from "../../components/ui/common/LoaderButton";
import "./ChangeEmail.css";

import { connect } from 'react-redux';
import { changeEmail, confirmChangeEmail } from '../../actions/authActions';

class ChangeEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: this.props.location.state && this.props.location.state.email ? this.props.location.state.email : "", //use values passed to it from transition from previous screen or default ""
      codeSent: this.props.location.state && this.props.location.state.codeSent ? this.props.location.state.codeSent : false,
      isConfirming: false,
      isSendingCode: false,
      changeSuccessful: false
    };
  }

  validatEmailForm() {
    return this.state.email.length > 0;
  }

  validateConfirmForm() {
    return this.state.code.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleUpdateClick = async event => {
    event.preventDefault();
    this.setState({ isSendingCode: true });
    try {
      await this.props.changeEmail(this.state.email);
      this.setState({ codeSent: true });
    } catch (e) {
      alert(e.message);
      this.setState({ isSendingCode: false });
    }
  };

  handleConfirmClick = async event => {
    event.preventDefault();
    this.setState({ isConfirming: true });
    try {
      await this.props.confirmChangeEmail(this.state.code);
      this.setState({ changeSuccessful: true });
      setTimeout(this.returnToSettings, 2000);
    } catch (e) {
      alert(e.message);
      this.setState({ isConfirming: false });
    }
  };

  returnToSettings = () => {
    this.props.history.push("/settings");
  }

  renderChangeSuccessful() {
    return (
      <div className="changeSuccessful">
        <Icon name="check" className="icon"/>
        <p>Email Changed Successfully</p>
      </div>
    );
  }

  renderUpdateForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isSendingCode} inverted page>
          <Loader inverted>Updating…</Loader>
        </Dimmer>
        <Form onSubmit={this.handleUpdateClick}>
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
                text="Update Email"
                loadingText="Updating…"
                disabled={!this.validatEmailForm()}
                isLoading={this.state.isSendingCode}
            />
        </Form>
      </Fragment>
    );
  }

  renderConfirmationForm() {
    return (
      <Fragment>
        <Dimmer active={this.state.isConfirming} inverted page>
          <Loader inverted>Confirming…</Loader>
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
            <LoaderButton
                fluid
                type="submit"
                text="Confirm"
                loadingText="Confirming…"
                isLoading={this.state.isConfirming}
                disabled={!this.validateConfirmForm()}
            />
        </Form>
      </Fragment>
    );
  }

  render() {
    return (
      <div className="ChangeEmail">
        {!this.state.codeSent
          ? this.renderUpdateForm()
          : !this.state.changeSuccessful
            ? this.renderConfirmationForm()
            : this.renderChangeSuccessful()
        }
      </div>
    );
  }
}

ChangeEmail.propTypes = {
    changeEmail: PropTypes.func.isRequired,
    confirmChangeEmail: PropTypes.func.isRequired,
};
  
const mapStateToProps = state => ({
});
  
const mapDispatchToProps = { changeEmail, confirmChangeEmail };

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);