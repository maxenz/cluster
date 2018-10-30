import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link, withRouter} from 'react-router-dom';
import {Container, Menu, Dropdown, Icon, Label} from 'semantic-ui-react';
// import SignOutButton from './SignOut';
// import * as routes from '../constants/routes';
// import {REQUESTS_STATUS_READY_TO_PRINT, REQUESTS_STATUS_SENT_BY_USER} from
// "../constants/requests";
import {logoutUser, setCurrentUser} from "../actions/authentication";
import DropdownImage from './DropdownImage';
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import setAuthToken from "../setAuthToken";
import store from "../store";
import {
  REQUESTS_STATUS_READY_TO_PRINT,
  REQUESTS_STATUS_SENT_BY_USER
} from "../constants/requests";

const style = {
  label: {
    float: 'right',
    marginRight: 0,
    marginTop: '-2px',
  },
  title: {
    backgroundColor: '#f2711c',
    marginRight: '3.5rem',
  },
  container: {
    borderBottom: '8px solid #f2711c',
    height: '60px',
  }
};

class NavigationBar extends Component {

  componentWillMount() {
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      store.dispatch(setCurrentUser(decoded));

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        store.dispatch(logoutUser(this.props.history));
      }
    }
  }

  getRequestsAmountByStatus = (status) => {
    if (this.props.requests) {
      return Object.values(this.props.requests).filter(x => x.status === status).length;
    }
    return 0;
  };

  getRequestsToQuote = () => {
    return this.getRequestsAmountByStatus(REQUESTS_STATUS_SENT_BY_USER);
  };

  getRequestsToPrint = () => {
    return this.getRequestsAmountByStatus(REQUESTS_STATUS_READY_TO_PRINT);
  };

  getLinkColor = (link) => {
    return link === this.props.history.location.pathname ? 'orange' : '';
  };

  render() {
    const {isAuthenticated, user} = this.props.auth;
    const authLinks = (
        <React.Fragment>
          {
            isAuthenticated && user.admin &&
            <Menu.Item header>
              <Link style={{color: this.getLinkColor('/dashboard')}}
                    to="/dashboard">Panel</Link>
            </Menu.Item>
          }
          {
            isAuthenticated && user.admin &&
            <Menu.Item header>
              <Link style={{color: this.getLinkColor('/printers')}}
                    to="/printers">Impresoras</Link>
            </Menu.Item>
          }
          <Menu.Item header>
            <Link style={{color: this.getLinkColor('/requests')}}
                  to="/requests">Pedidos</Link>
          </Menu.Item>
          <Menu.Item position='right'>
            {
              isAuthenticated && user.admin &&

              <Dropdown className='dropdown-item-icon' item
                        icon={<Icon name='bell outline'/>}>
                <Dropdown.Menu>
                  <Dropdown.Item style={{width: '200px'}}>
                    Pedidos a cotizar
                    <Label color='orange'
                           style={style.label}>{this.getRequestsToQuote()}</Label>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    Pedidos a imprimir
                    <Label color='orange'
                           style={style.label}>{this.getRequestsToPrint()}</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            }
            <ul className="navbar-nav ml-auto">
              <DropdownImage name={user.name} image={user.avatar}/>
            </ul>
          </Menu.Item>

        </React.Fragment>
    );
    const guestLinks = (
        <Menu.Item position='right'>
          <Link to="/login">Iniciar sesión</Link>
        </Menu.Item>
    );

    return (
        <div>
          <Menu fixed='top' inverted style={style.container}>
            <Container>
              <Menu.Item header style={style.title}>
                <Link to="/">Cluster 3D</Link>
              </Menu.Item>
              {isAuthenticated ? authLinks : guestLinks}
            </Container>
          </Menu>
        </div>
    );
  }
}


// const NavigationAuth = (props) => {
//   const requestsToQuote = props.requests.filter(x => x.status ===
// REQUESTS_STATUS_SENT_BY_USER).length; const requestsToPrint =
// props.requests.filter(x => x.status ===
// REQUESTS_STATUS_READY_TO_PRINT).length; return (<Menu fixed='top' inverted>
// <Container> <Link className='item' to={routes.HOME} header="true"> <div
// className='circle' style={{marginRight: '1.5em'}}> C3D </div> Cluster 3D
// </Link> {props.user.role && props.user.role === 'ADMIN' ? <HeaderLink
// route={routes.PRINTERS} name="Impresoras"/> : null} <HeaderLink
// route={routes.REQUESTS} name="Pedidos"/> <HeaderLink
// route={routes.PRINT_WIZARD} name="Imprimir"/> <Menu.Item position='right'>
// {props.user.role && props.user.role === 'ADMIN' ? <Dropdown
// className='dropdown-item-icon' item icon={<Icon name='bell outline'/>}>
// <Dropdown.Menu> <Dropdown.Item style={{width: '200px'}}> Pedidos a cotizar
// <Label color='orange' style={style.label}>{requestsToQuote}</Label>
// </Dropdown.Item> <Dropdown.Item> Pedidos a imprimir <Label color='orange'
// style={style.label}>{requestsToPrint}</Label> </Dropdown.Item>
// </Dropdown.Menu> </Dropdown> : null } <HeaderLink route={routes.ACCOUNT}
// name={props.user.email}/> <SignOutButton signOutHandler={() =>
// signOut(props.history)}/> </Menu.Item> </Container> </Menu>) };

NavigationBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  requests: state.requests.all,
});

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavigationBar));