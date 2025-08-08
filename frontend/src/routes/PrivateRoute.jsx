// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/" />;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <div className="text-white flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
