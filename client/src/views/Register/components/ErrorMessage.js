import React from 'react';
import './error.scss';

const ErrorMessage = ({
  error,
}) => {
  return !!error && (
    <div className="error" >
      <div className="error__arrow"/>
      <div className="error__message">
        {error}
      </div>
    </div>
  );
}

export default ErrorMessage;
