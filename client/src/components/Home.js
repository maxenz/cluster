import React from 'react';
import {withRouter, Redirect} from 'react-router-dom';
// import {Button} from 'semantic-ui-react';
// import {SIGN_IN} from "../../constants/routes";
import Steps from '../components/Common/Steps';
import {
  addClassToBody,
  addNonScrollableClassToBody, removeClassFromBody,
  removeNonScrollableClassToBody
} from "../helpers/dom";
// import {Icon} from 'semantic-ui-react';
// import {doGoogleLogin, doFacebookLogin} from "../../firebase/auth";

let styles = {
  title: {
    fontSize: '4em',
    fontWeight: 'normal',
    marginBottom: '0',
  },
  subtitle: {
    fontSize: '1.7em',
    fontWeight: 'normal',
    marginTop: '1.5em',
  },
  container: {
    overflow: 'hidden',
  },
  stepsContainer: {
    textAlign: 'center',
  },
};

export class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      splashScreen: false,
    };
  }

  // handleEmailAccess = () => this.props.history.push(SIGN_IN);
  //
  // handleFacebookAccess = () => doFacebookLogin();
  //
  // handleGoogleAccess = () => doGoogleLogin();

  componentWillMount() {
    const marginTop = `${window.innerHeight * 0.35}px`;
    styles = {...styles, container: {...styles.container, marginTop}};
    addNonScrollableClassToBody();
    addClassToBody('background-orange');
  }

  componentWillUnmount() {
    removeNonScrollableClassToBody();
    removeClassFromBody('background-orange');
  }

  render() {
    return <div style={styles.container}>
      <div className="ui text container center aligned">
        <h1 className="ui inverted header"
            style={styles.title}>
          Cluster3D Impresiones
        </h1>
      </div>
      <div style={styles.stepsContainer}>
        <Steps/>
      </div>
      {/*<div className="ui text container center aligned"*/}
           {/*style={{marginTop: '3.5em'}}>*/}
        {/*<Button color='facebook' onClick={this.handleFacebookAccess}>*/}
          {/*<Icon name='facebook'/> Acceder con Facebook*/}
        {/*</Button>*/}
        {/*<Button color='google plus' onClick={this.handleGoogleAccess}>*/}
          {/*<Icon name='google'/> Acceder con Google*/}
        {/*</Button>*/}
        {/*<Button color='instagram' onClick={this.handleEmailAccess}>*/}
          {/*<Icon name='envelope'/> Acceder con Email*/}
        {/*</Button>*/}
      {/*</div>*/}
    </div>
  }
}

export default Home;