import React, {Component} from 'react';
import {Form, Header, Segment, Button, Message} from 'semantic-ui-react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {registerUser} from '../actions/authentication';
import classnames from 'classnames';

const styles = {
  formContainer: {
    marginTop: '7%',
    width: '40%',
    marginLeft: '30%',
  },
};

class Register extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirm: '',
      error: null,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirm: this.state.password_confirm
    };
    this.props.registerUser(user, this.props.history);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/')
    }
    if (nextProps.error) {
      this.setState({
        error: nextProps.error
      });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  render() {
    const {name, email, password, password_confirm, error} = this.state;
    const isInvalid =
        password !== password_confirm ||
        password === '' ||
        email === '' ||
        name === '';
    return (
        <div style={styles.formContainer}>
          <Header as='h2' textAlign='center'>
            Registro de nuevo usuario
          </Header>
          <Form error size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                  fluid
                  placeholder='Usuario'
                  type='text'
                  icon='user'
                  name='name'
                  iconPosition='left'
                  value={name}
                  onChange={this.handleInputChange}/>

              <Form.Input
                  fluid
                  placeholder='Correo electrónico'
                  type='text'
                  icon='envelope'
                  name='email'
                  iconPosition='left'
                  onChange={this.handleInputChange}
                  value={email}/>

              <Form.Input
                  fluid
                  placeholder='Contraseña'
                  type='password'
                  icon='lock'
                  name='password'
                  iconPosition='left'
                  value={password}
                  onChange={this.handleInputChange}/>

              <Form.Input
                  fluid
                  placeholder='Confirme Contraseña'
                  type='password'
                  name='password_confirm'
                  icon='lock'
                  iconPosition='left'
                  onChange={this.handleInputChange}
                  value={password_confirm}/>

            </Segment>
            <Button color='orange' fluid size='large'
                    disabled={isInvalid}>Registrarse</Button>

            {error && <Message error header='Error' content={error.message}/>}
          </Form>
        </div>
    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {registerUser})(withRouter(Register))