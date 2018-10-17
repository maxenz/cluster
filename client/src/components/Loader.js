import React from 'react';
import PropTypes from 'prop-types';
import LoadingScreen from 'react-loading-screen';

const Loader = props => {

  const {showLoader, text, image} = props;

  return (<LoadingScreen
    loading={showLoader}
    bgColor='#f1f1f1'
    spinnerColor='#9ee5f8'
    textColor='#676767'
    logoSrc={image}
    text={text}
  >
    <div>
      {props.children}
    </div>
  </LoadingScreen>)
}

Loader.propTypes = {
  showLoader: PropTypes.bool.isRequired,
  text: PropTypes.string,
  image: PropTypes.any,
};

export default Loader;