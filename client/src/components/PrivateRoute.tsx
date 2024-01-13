import React from 'react';
import { useAppSelector } from '../redux/hooks';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = () => {
  const { currentUser } = useAppSelector(({ userReducer }) => ({
    currentUser: userReducer.currentUser,
  }));
  return currentUser ? <Outlet /> : <Navigate to={'/sign-in'} />;
};

export default PrivateRoute;
