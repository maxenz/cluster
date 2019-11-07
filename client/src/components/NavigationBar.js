import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Container, Menu, Dropdown, Icon, Label } from "semantic-ui-react";
import io from "socket.io-client";
import { logoutUser, setCurrentUser } from "../actions/authentication";
import DropdownImage from "./DropdownImage";
import PropTypes from "prop-types";
import jwt_decode from "jwt-decode";
import setAuthToken from "../setAuthToken";
import { store as notificationStore } from "react-notifications-component";
import store from "../store";
import {
  REQUESTS_STATUS_READY_TO_PRINT,
  REQUESTS_STATUS_SENT_BY_USER
} from "../constants/requests";

const style = {
  label: {
    float: "right",
    marginRight: 0,
    marginTop: "-2px"
  },
  title: {
    backgroundColor: "#f2711c",
    marginRight: "3.5rem"
  },
  container: {
    borderBottom: "8px solid #f2711c",
    height: "60px"
  }
};

const showNotification = message => {
  notificationStore.addNotification({
    title: "Atención!",
    message: message,
    type: "success",
    insert: "top",
    container: "top-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 4000,
      onScreen: true
    }
  });
};

class NavigationBar extends Component {
  initiateSocketConnection = (userId, admin) => {
    const socket = io.connect("http://localhost:5001", {
      query: `userId=${userId}`
    });
    const channel = admin
      ? "admin-request-notification"
      : "request-notification";

    socket.on(channel, function(data) {
      showNotification(data);
    });
  };

  componentWillMount() {
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const decoded = jwt_decode(localStorage.jwtToken);
      this.props.setCurrentUser(decoded);
      this.initiateSocketConnection(decoded.id, decoded.admin);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.props.logoutUser(this.props.history);
      }
    }
  }

  getRequestsAmountByStatus = status => {
    if (this.props.requests) {
      return Object.values(this.props.requests).filter(x => x.status === status)
        .length;
    }
    return 0;
  };

  getRequestsToQuote = () => {
    return this.getRequestsAmountByStatus(REQUESTS_STATUS_SENT_BY_USER);
  };

  getRequestsToPrint = () => {
    return this.getRequestsAmountByStatus(REQUESTS_STATUS_READY_TO_PRINT);
  };

  getLinkColor = link => {
    return link === this.props.history.location.pathname ? "orange" : "";
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <React.Fragment>
        {isAuthenticated && user.admin && (
          <Menu.Item header>
            <Link
              style={{ color: this.getLinkColor("/dashboard") }}
              to="/dashboard"
            >
              Panel
            </Link>
          </Menu.Item>
        )}
        {isAuthenticated && user.admin && (
          <Menu.Item header>
            <Link
              style={{ color: this.getLinkColor("/printers") }}
              to="/printers"
            >
              Impresoras
            </Link>
          </Menu.Item>
        )}
        <Menu.Item header>
          <Link
            style={{ color: this.getLinkColor("/requests") }}
            to="/requests"
          >
            Pedidos
          </Link>
        </Menu.Item>
        <Menu.Item position="right">
          {isAuthenticated && user.admin && (
            <Dropdown
              className="dropdown-item-icon"
              item
              icon={<Icon name="bell outline" />}
            >
              <Dropdown.Menu>
                <Dropdown.Item style={{ width: "200px" }}>
                  Pedidos a cotizar
                  <Label color="orange" style={style.label}>
                    {this.getRequestsToQuote()}
                  </Label>
                </Dropdown.Item>
                <Dropdown.Item>
                  Pedidos a imprimir
                  <Label color="orange" style={style.label}>
                    {this.getRequestsToPrint()}
                  </Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          <ul className="navbar-nav ml-auto">
            <DropdownImage name={user.name} image={user.avatar} />
          </ul>
        </Menu.Item>
      </React.Fragment>
    );
    const guestLinks = (
      <Menu.Item position="right">
        <Link to="/login">Iniciar sesión</Link>
      </Menu.Item>
    );

    return (
      <div>
        <Menu fixed="top" inverted style={style.container}>
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

NavigationBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  requests: state.requests.all
});

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: history => {
      dispatch(logoutUser(history));
    },
    setCurrentUser: decodedUser => {
      dispatch(setCurrentUser(decodedUser));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavigationBar));
