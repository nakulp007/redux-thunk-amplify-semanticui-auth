//Same as Menu.Item 
//but runs two on click functions
//one to hide sidebar
//other provided as props

import React from "react";
import PropTypes from 'prop-types';
import {
    Menu,
} from 'semantic-ui-react';

class MenuItem extends React.Component {
    handleSidebarHide = () => {
        if(this.props.sidebarVisible){
            this.props.toggleSidebar(true);
        }
    }

    render() {
        //copy all properties in this.props to new variable 
        //leave out few properties that are specific to this extension of Menu.Item
        //rest pass them on
        const newProps = {...this.props};
        delete newProps.sidebarVisible;
        delete newProps.toggleSidebar;

      const { onClick } = this.props;

      return(
        <Menu.Item 
            //rest of the props just pass on to parent
            {...newProps}
            onClick={() => { 
                this.handleSidebarHide(); 
                if(onClick){
                    onClick();
                }
            }}
        >
        </Menu.Item>
      );
    }
}

MenuItem.propTypes = {
    sidebarVisible: PropTypes.bool.isRequired,    
    toggleSidebar: PropTypes.func.isRequired
};

export default MenuItem;