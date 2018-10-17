import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const BackButton = (props) => (
    <Button
        labelPosition='left'
        icon='left chevron'
        content='Atrás'
        style={{marginLeft: '25%', marginBottom: '20px'}}
        onClick={props.handleGoBack}
    />);

BackButton.propTypes = {
  handleGoBack: PropTypes.func.isRequired,
};

export default BackButton;