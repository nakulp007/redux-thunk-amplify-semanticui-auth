import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/routes/AppliedRoute";
import AuthenticatedRoute from "./components/routes/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/routes/UnauthenticatedRoute";

//A higher order component for loading components with promises so components and their imports will only load when they are needed.
import Loadable from 'react-loadable';
import LoadingComponent from './components/ui/loadable/LoadingComponent';

const loadableSettings = {
  loading: LoadingComponent,
  delay: 400, //200 ms is default
  timeout: 10000,
}
const AsyncHome = Loadable({ loader: () => import("./containers/Home"), ...loadableSettings });
const AsyncLogin = Loadable({ loader: () => import("./containers/auth/Login"), ...loadableSettings });
const AsyncResetPassword = Loadable({ loader: () => import("./containers/auth/ResetPassword"), ...loadableSettings });
const AsyncSignup = Loadable({ loader: () => import("./containers/auth/Signup"), ...loadableSettings });
const AsyncChangePassword = Loadable({ loader: () => import("./containers/auth/ChangePassword"), ...loadableSettings });
const AsyncChangeEmail = Loadable({ loader: () => import("./containers/auth/ChangeEmail"), ...loadableSettings });
const AsyncSettings = Loadable({ loader: () => import("./containers/settings/Settings"), ...loadableSettings });
const AsyncNotFound = Loadable({ loader: () => import("./containers/error/NotFound"), ...loadableSettings });

export default class Routes extends Component{
  componentDidMount(){
    //Always need these. Load these after whatever component is done mounting.
    AsyncHome.preload();

    this.preloadFutureComponents();
  }

  componentDidUpdate(){
    this.preloadFutureComponents();
  }

  //preload some components depending on what we predict we will need in future
  preloadFutureComponents(){
    try{
      switch(window.location.pathname){
        case '/':
          AsyncLogin.preload();
          AsyncSettings.preload();
          break;
        case '/login':
          AsyncResetPassword.preload();
          AsyncSignup.preload();
          break;
        case '/signup':
          AsyncLogin.preload();
          break;
        case '/settings':
          AsyncChangeEmail.preload();
          AsyncChangePassword.preload();
          break;
        default:
          break;
      }
    }catch(e){
      console.error(e);
    }
  }

  render(){
    return  <Switch>
              <AppliedRoute path="/" exact component={AsyncHome} props={this.props.childProps} />
              <UnauthenticatedRoute path="/login" exact component={AsyncLogin} props={this.props.childProps} />
              <UnauthenticatedRoute path="/login/reset" exact component={AsyncResetPassword} props={this.props.childProps}/>
              <UnauthenticatedRoute path="/signup" exact component={AsyncSignup} props={this.props.childProps} />

              <AuthenticatedRoute path="/settings" exact component={AsyncSettings} props={this.props.childProps}/>
              <AuthenticatedRoute path="/settings/password" exact component={AsyncChangePassword} props={this.props.childProps}/>
              <AuthenticatedRoute path="/settings/email" exact component={AsyncChangeEmail} props={this.props.childProps}/>

              { /* Finally, catch all unmatched routes */ }
              <Route component={AsyncNotFound} />
            </Switch>; 
  }
}

//Above we only load components when we need them
//To take it further, in future if only want to load only the visible components inside the page we can use react-loadable-visibility
//https://github.com/stratiformltd/react-loadable-visibility