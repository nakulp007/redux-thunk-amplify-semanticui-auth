//Shell has headere, sidebar and content

import React from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import {
    Container,
    Icon,
    Image,
    Menu,
    Responsive,
    Sidebar,
  } from 'semantic-ui-react';

import MenuItem from '../header/MenuItem';

import Routes from "../../Routes";

import config from '../../config';

import "./Shell.css";


class Shell extends React.Component {
    getLogo(){
        return (
            <MenuItem header as={Link} to="/" sidebarVisible={this.props.sidebarVisible} toggleSidebar={this.props.toggleSidebar}>
                <Image size='mini' src='/favicon.ico' style={{ marginRight: '1.5em' }} />
                Scratch
            </MenuItem>
        );
    }

    getLogoSidebar(){
        return(
            <MenuItem header as={Link} to='/' sidebarVisible={this.props.sidebarVisible} toggleSidebar={this.props.toggleSidebar} style={{ display: 'flex', alignItems: 'center' }}>
                <Image size='mini' src='/favicon.ico' style={{ display: 'block', margin: '0 auto .5rem!important' }} />
                Scratch
            </MenuItem>
        )
    }

    getMenuItems() {
        return this.props.menuItems.map( (item, index) => (
            <MenuItem header key={index} {...item} sidebarVisible={this.props.sidebarVisible} toggleSidebar={this.props.toggleSidebar}/>
        ));
    }

    getBurgerBars() {
        return (
            <MenuItem header onClick={()=>this.props.toggleSidebar(this.props.sidebarVisible)} sidebarVisible={this.props.sidebarVisible} toggleSidebar={this.props.toggleSidebar}>
                <Icon name='bars'/>
            </MenuItem>
        );
    }

    getHeaderBarSmallScreen() {
        return (
            <Menu>
                {this.getLogo()}
                <Menu.Menu position='right'>
                    {this.getBurgerBars()}
                </Menu.Menu>
            </Menu>
        );
    }

    getHeaderBarLargeScreen() {
        return (
            <Menu>
                {this.getLogo()}
                <Menu.Menu position='right'>
                    {this.getMenuItems()}
                </Menu.Menu>
            </Menu>
        );
    }

    /*
        //Navbar.Collapse component ensures 
        //that on mobile devices the two links will be collapsed.

        //wrap <NavItem href="/signup">Signup</NavItem>
        //around LinkContainer so when we click
        //navbar items they dont refresh the entire page and use React Router instead
        
        The Fragment component can be thought of as a placeholder component. 
        We need this because in the case the user is not logged in, 
        we want to render two links. To do this we would need to wrap it 
        inside a single component, like a div. But by using the Fragment 
        component it tells React that the two links are inside this component 
        but we don’t want to render any extra HTML.
    */


    render() {
        const { isAuthenticated, sidebarVisible } = this.props;
        const { device_size_small } = config.ui;

        //send this to every child routes
        //all will need it
        //all route types are passing these values to all components. 
        //components dont really need this because they can go directly to redux store
        //keeping it because it is good structure and may need it in future. 
        const childProps = {
            isAuthenticated
        };

        // Container keeps content padded on very large screen and unpadded on small screens.
        // So content kind of stays in the middle of screen and easy to read because it doesnt stretch all the way to end of screen on large screens
        let content = 
            <Container>
                <Routes childProps={childProps} />
            </Container>;

        return(
            <div className="Shell">
                <Responsive maxWidth={device_size_small} style={{ height: '100%' }}>
                    <Sidebar.Pushable>
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            direction='right'
                            duration='100'
                            icon='labeled'
                            inverted
                            onHide={()=>this.props.toggleSidebar(true)}
                            vertical
                            visible={sidebarVisible}
                            width='thin'
                        >
                            {this.getLogoSidebar()}
                            {this.getMenuItems()}
                        </Sidebar>
                        <Sidebar.Pusher dimmed={sidebarVisible}>
                            {this.getHeaderBarSmallScreen()}
                            {content}
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </Responsive>
                <Responsive minWidth={device_size_small} style={{ height: '100%' }}>
                    {this.getHeaderBarLargeScreen()}
                    {content}
                </Responsive>
                <div className='footerMessages'>
                    {this.props.footerMessages}
                </div>
            </div>
        );
    }
}

Shell.propTypes = {
    menuItems:PropTypes.array.isRequired,
    footerMessages:PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    sidebarVisible: PropTypes.bool.isRequired,    
    toggleSidebar: PropTypes.func.isRequired,
};

export default Shell;