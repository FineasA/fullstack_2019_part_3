import React from 'react';

const SuccessNotification = props => {
  if (props.message === null) {
    return null;
  }
  return <div className='success'>{props.message}</div>;
};

export default SuccessNotification;
