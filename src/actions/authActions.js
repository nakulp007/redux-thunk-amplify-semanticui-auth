import { Auth } from "aws-amplify";
import { authConstants } from '../constants/authConstants';



const loginRequest = () => ({
    type: authConstants.LOGIN_REQUEST,
});
const loginSuccess = (user) => ({
    type: authConstants.LOGIN_SUCCESS,
    payload: { user }
});
const loginFailure = (message='') => ({
    type: authConstants.LOGIN_FAILURE,
    payload: { message }
});
export const loginUser = (email='', password='') => async dispatch => {
    dispatch(loginRequest());
    try {
        const user = await Auth.signIn(email, password);
        dispatch(loginSuccess(user));
        return user;
    } catch (e) {
        dispatch(loginFailure(e.message));
        throw e;
    }
}





const signupRequest = () => ({
    type: authConstants.SIGNUP_REQUEST,
});
const signupSuccess = () => ({
    type: authConstants.SIGNUP_SUCCESS,
});
const signupFailure = (message='') => ({
    type: authConstants.SIGNUP_FAILURE,
    payload: { message }
});
export const signupUser = (email='', password='') => async dispatch => {
    dispatch(signupRequest());
    try {
        const newUser = await Auth.signUp({
            username: email,
            password: password
        });
        dispatch(signupSuccess());
        return newUser;
    } catch (e) {
      dispatch(signupFailure(e.message));
      throw e;
    }
}



// use this to resend verification code when user didn't finish in registration phase
const resendSignupRequest = () => ({
    type: authConstants.RESEND_SIGNUP_REQUEST,
});
const resendSignupSuccess = () => ({
    type: authConstants.RESEND_SIGNUP_SUCCESS,
});
const resendSignupFailure = (message='') => ({
    type: authConstants.RESEND_SIGNUP_FAILURE,
    payload: { message }
});
export const resendSignupUser = (username='') => async dispatch => {
    dispatch(resendSignupRequest());
    try {
        await Auth.resendSignUp(username);
        dispatch(resendSignupSuccess());
    } catch (e) {
      dispatch(resendSignupFailure(e.message));
      throw e;
    }
}





const confirmationRequest = () => ({
    type: authConstants.EMAIL_CONFIRMATION_REQUEST,
});
const confirmationSuccess = () => ({
    type: authConstants.EMAIL_CONFIRMATION_SUCCESS,
});
const confirmationFailure = (message='') => ({
    type: authConstants.EMAIL_CONFIRMATION_FAILURE,
    payload: { message }
});
export const confirmUser = (email='', confirmationCode='') => async dispatch => {
    dispatch(confirmationRequest());
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      dispatch(confirmationSuccess());
    } catch (e) {
      dispatch(confirmationFailure(e.message));
      throw e;
    }
}





const forgotPasswordRequest = () => ({
    type: authConstants.FORGOT_PASSWORD_REQUEST,
});
const forgotPasswordSuccess = () => ({
    type: authConstants.FORGOT_PASSWORD_SUCCESS,
});
const forgotPasswordFailure = (message='') => ({
    type: authConstants.FORGOT_PASSWORD_FAILURE,
    payload: { message }
});
export const forgotPassword = (email='') => async dispatch => {
    dispatch(forgotPasswordRequest());
    try {
      await Auth.forgotPassword(email);
      dispatch(forgotPasswordSuccess());
    } catch (e) {
      dispatch(forgotPasswordFailure(e.message));
      throw e;
    }
}





const resetPasswordRequest = () => ({
    type: authConstants.RESET_PASSWORD_REQUEST,
});
const resetPasswordSuccess = () => ({
    type: authConstants.RESET_PASSWORD_SUCCESS,
});
const resetPasswordFailure = (message='') => ({
    type: authConstants.RESET_PASSWORD_FAILURE,
    payload: { message }
});
export const resetPassword = (email='', password='', confirmationCode='') => async dispatch => {
    dispatch(resetPasswordRequest());
    try {
      await Auth.forgotPasswordSubmit(email, confirmationCode, password);
      dispatch(resetPasswordSuccess());
    } catch (e) {
      dispatch(resetPasswordFailure(e.message));
      throw e;
    }
}





const changePasswordRequest = () => ({
    type: authConstants.CHANGE_PASSWORD_REQUEST,
});
const changePasswordSuccess = () => ({
    type: authConstants.CHANGE_PASSWORD_SUCCESS,
});
const changePasswordFailure = (message='') => ({
    type: authConstants.CHANGE_PASSWORD_FAILURE,
    payload: { message }
});
export const changePassword = (oldPassword='', password='') => async dispatch => {
    dispatch(changePasswordRequest());
    try {
        const currentUser = await Auth.currentAuthenticatedUser();
        await Auth.changePassword(
          currentUser,
          oldPassword,
          password
        );
      dispatch(changePasswordSuccess());
    } catch (e) {
      dispatch(changePasswordFailure(e.message));
      throw e;
    }
}





const changeEmailRequest = () => ({
    type: authConstants.CHANGE_EMAIL_REQUEST,
});
const changeEmailSuccess = (email) => ({
    type: authConstants.CHANGE_EMAIL_SUCCESS,
    payload: { email }
});
const changeEmailFailure = (message='') => ({
    type: authConstants.CHANGE_EMAIL_FAILURE,
    payload: { message }
});
export const changeEmail = (email='') => async dispatch => {
    dispatch(changeEmailRequest());
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, { email: email });
      dispatch(changeEmailSuccess(email));
    } catch (e) {
      dispatch(changeEmailFailure(e.message));
      throw e;
    }
}



const resendChangeEmailRequest = () => ({
    type: authConstants.RESEND_CHANGE_EMAIL_REQUEST,
});
const resendChangeEmailSuccess = (email) => ({
    type: authConstants.RESEND_CHANGE_EMAIL_SUCCESS,
    payload: { email }
});
const resendChangeEmailFailure = (message='') => ({
    type: authConstants.RESEND_CHANGE_EMAIL_FAILURE,
    payload: { message }
});
export const resendChangeEmail = (email='') => async dispatch => {
    dispatch(resendChangeEmailRequest());
    try {
      await Auth.verifyCurrentUserAttribute("email");
      dispatch(resendChangeEmailSuccess(email));
    } catch (e) {
      dispatch(resendChangeEmailFailure(e.message));
      throw e;
    }
}


const changeEmailConfirmationRequest = () => ({
    type: authConstants.CHANGE_EMAIL_CONFIRMATION_REQUEST,
});
const changeEmailConfirmationSuccess = () => ({
    type: authConstants.CHANGE_EMAIL_CONFIRMATION_SUCCESS,
});
const changeEmailConfirmationFailure = (message='') => ({
    type: authConstants.CHANGE_EMAIL_CONFIRMATION_FAILURE,
    payload: { message }
});
export const confirmChangeEmail = (code='') => async dispatch => {
    dispatch(changeEmailConfirmationRequest());
    try {
      await Auth.verifyCurrentUserAttributeSubmit("email", code);
      dispatch(changeEmailConfirmationSuccess());
    } catch (e) {
      dispatch(changeEmailConfirmationFailure(e.message));
      throw e;
    }
}





const logout = () => ({
    type: authConstants.LOGOUT,
});
export const logoutUser = () => async dispatch => {
    await Auth.signOut();
    dispatch(logout());
}






const checkCurrentSessionRequest = () => ({
    type: authConstants.CHECK_CURRENT_SESSION_REQUEST,
});
const checkCurrentSessionSuccess = (user) => ({
    type: authConstants.CHECK_CURRENT_SESSION_SUCCESS,
    payload: { user }
});
const checkCurrentSessionFailure = (message='') => ({
    type: authConstants.CHECK_CURRENT_SESSION_FAILURE,
    payload: { message }
});
export const checkCurrentSession = () => async dispatch => {
    dispatch(checkCurrentSessionRequest());
    try {
        if(await Auth.currentSession()){
            const user = await Auth.currentAuthenticatedUser({ bypassCache: true }); //get it from server
            dispatch(checkCurrentSessionSuccess(user));
        }else{
            dispatch(checkCurrentSessionSuccess(null));
        }
    } catch (e) {
        //The Auth.currentAuthenticatedUser() method throws an error 'not authenticated' 
        //if nobody is currently logged in. We don’t want to show this error 
        //to users when they load up our app and are not signed in.
        if (e !== 'No current user' && e !== 'not authenticated') {
            dispatch(checkCurrentSessionFailure(e));
            throw e;
        }else{
            dispatch(checkCurrentSessionSuccess(null));
        }
    }
}