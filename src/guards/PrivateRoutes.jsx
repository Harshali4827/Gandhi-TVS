// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');

//   return token ? children : <Navigate to="/auth/signin-1" />;
// };

// export default PrivateRoute;



import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/auth/signin-1" />;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    return isExpired ? <Navigate to="/auth/signin-1" /> : children;
  } catch (error) {
    return <Navigate to="/auth/signin-1" />;
  }
};

export default PrivateRoute;
