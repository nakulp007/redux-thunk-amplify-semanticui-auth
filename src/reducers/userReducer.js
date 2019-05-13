import { authConstants } from '../constants/authConstants';

const initialState = {    
    email: null,
    email_verified: null,
    isAuthenticated: false,
};


//action will always include a type
//if it has data then it will have a payload or other properties as well
export default function(state = initialState, action) {

    //for immutability we create new state
    //just ...state would spread and create new object
    //but if you have an array with objects inside it
    //it wouldn't spread inside objects, 
    //so need to create a new array and spread in the values manually
    let getCopyOfState = state => {
        return {
            ...state,
        }
    }

    switch(action.type){
        case authConstants.LOGIN_SUCCESS:
            state = getCopyOfState(state);
            state.isAuthenticated = true;
            state.email = action.payload.user.signInUserSession.idToken.payload.email;
            state.email_verified = action.payload.user.signInUserSession.idToken.payload.email_verified;
            return state;

        case authConstants.CHECK_CURRENT_SESSION_SUCCESS:
            state = getCopyOfState(state);          
            if(action.payload.user){
                state.isAuthenticated = true;
                state.email = action.payload.user.attributes.email;
                state.email_verified = action.payload.user.attributes.email_verified;
            }else{
                state.isAuthenticated = false;
                state.email = null;
                state.email_verified = null;
            }
            return state;
        
        case authConstants.CHECK_CURRENT_SESSION_FAILURE:
            state = getCopyOfState(state);
            state.isAuthenticated = false;
            state.email = null;
            state.email_verified = null;
            return state;

        case authConstants.LOGOUT:
            state = getCopyOfState(state);
            state.isAuthenticated = false;
            state.email = null;
            state.email_verified = null;
            return state;
        
        case authConstants.CHANGE_EMAIL_SUCCESS:
            state = getCopyOfState(state);
            state.email = action.payload.email;
            state.email_verified = false;
            return state;
        
        case authConstants.CHANGE_EMAIL_CONFIRMATION_SUCCESS:
            state = getCopyOfState(state);
            state.email_verified = true;
            return state;
        
        default:
            return state;
    }
}