import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element: Component, ...rest }) {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
}

export default PrivateRoute;
