import React from 'react';
import {Dropdown, Image, Icon} from 'semantic-ui-react'
import {connect} from "react-redux";
import {logoutUser} from "../actions/authentication";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

const trigger = (name, image) => (
    <span>
    <Image avatar src={image}/> {name} <Icon name="dropdown" size="small"/>
  </span>
);

class DropdownImage extends React.Component {

  getOptions = () => (
      [
        {
          key: 'user',
          icon: 'user',
          content: <span>Perfil</span>
        },
        {
          key: 'sign-out',
          icon: 'sign out',
          content: <span
              onClick={() => this.props.logoutUser(this.props.history)}>Cerrar sesión</span>
        }
      ]);

  render() {
    const {name, image} = this.props;

    return (
        <Dropdown trigger={trigger(name, image)}
                  options={this.getOptions()} pointing='top left' icon={null}/>)
  }
};

DropdownImage.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  logoutUser,
};

export default connect(null, mapDispatchToProps)(withRouter(DropdownImage));