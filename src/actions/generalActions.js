import { userActionConstants } from '../constants/userActionConstants';



export const toggleSidebar = (sidebarVisible) => dispatch => {
    dispatch({
        type: userActionConstants.TOGGLE_SIDEBAR,
        payload: {sidebarVisible},
    });
}

export const headerMenuItemClicked = () => dispatch => {
    dispatch({
        type: userActionConstants.HEADER_MENU_ITEM_CLICKED,
    });
}
