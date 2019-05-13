import { userActionConstants } from '../constants/userActionConstants';

const initialState = {    
    sidebarVisible: false,
};

export default function(state = initialState, action) {
    let getCopyOfState = state => {
        return {
            ...state,
        }
    }

    switch(action.type){
        case userActionConstants.HEADER_MENU_ITEM_CLICKED:
            state = getCopyOfState(state);
            state.sidebarVisible = false;           
            return state;
        case userActionConstants.TOGGLE_SIDEBAR:
            state = getCopyOfState(state);
            state.sidebarVisible = !action.payload.sidebarVisible;           
            return state;
        default:
            return state;
    }
}