import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {loginUser} from '../actions/authentication';
import {withRouter} from 'react-router-dom';
import {
  Header,
  Form,
  Segment,
  Button,
  Loader,
  Input,
  Grid
} from 'semantic-ui-react';
import {
  addNonScrollableClassToBody,
  removeNonScrollableClassToBody
} from "../helpers/dom";

let styles = {
  signUpLink: {
    marginTop: '10px',
    textAlign: 'center',
  },
  formContainer: {
    width: '40%',
  },
  input: {
    marginBottom: '14px',
  },
  container: {
    overflow: 'hidden',
  },
};

const SignUpLink = () =>
    <p style={styles.signUpLink}>
      No tenés una cuenta?
      {' '}
      <Link to="/register">Registrate</Link>
    </p>;

class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
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
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(user).then(() => {
      this.redirect();
    })
  };

  componentWillMount() {
    const marginTop = `${window.innerHeight * 0.35}px`;
    styles = {...styles, container: {...styles.container, marginTop}};
    addNonScrollableClassToBody();
  }

  componentWillUnmount() {
    removeNonScrollableClassToBody();
  }

  redirect = () => {
    if (this.props.auth.isAuthenticated) {
      if (this.props.auth.user.admin) {
        this.props.history.push('/dashboard');
      }
      else {
        this.props.history.push('/requests');
      }
    }
  };

  componentDidMount() {
    this.redirect();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  render() {

    const {
      email,
      password,
      errors,
      isLoading,
    } = this.state;

    const isInvalid =
        password === '' ||
        email === '' ||
        isLoading;

    return (
        <Grid style={styles.container} verticalAlign='middle' columns={1}
              centered>
          <Grid.Column style={styles.formContainer}>
            <Header as='h2' textAlign='center'>
              Inicio de sesión
            </Header>
            <Form error size='large' onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Input
                    fluid
                    placeholder='Correo electrónico'
                    type='email'
                    icon='envelope'
                    iconPosition='left'
                    value={email}
                    error={errors.email}
                    name="email"
                    style={styles.input}
                    onChange={this.handleInputChange}/>

                {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>)}

                <Input
                    fluid
                    placeholder='Contraseña'
                    type='password'
                    icon='lock'
                    iconPosition='left'
                    error={errors.password}
                    value={password}
                    name="password"
                    autoComplete='sugested-password'
                    style={styles.input}
                    onChange={this.handleInputChange}/>

                {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>)}

                <Button color='orange' fluid size='large' disabled={isInvalid}>
                  Iniciar sesión
                  {isLoading ?
                      <Loader style={{marginLeft: '5%'}} active inline/> : null}
                </Button>

              </Segment>
            </Form>
            <SignUpLink linkStyle={styles.signUpLink}/>
          </Grid.Column>
        </Grid>)
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))