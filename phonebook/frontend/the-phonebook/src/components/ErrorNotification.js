import React from 'react';

const ErrorNotification = props => {
  if (props.message === null) {
    return null;
  }
  return <div className='error'>{props.message}</div>;
};

export default ErrorNotification;
