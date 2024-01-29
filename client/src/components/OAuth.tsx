import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React from 'react';
import { app } from '../utils/firebase';
import axios, { AxiosResponse } from 'axios';

import { AppDispatch } from '../redux/store';
import { signInSuccess } from '../redux/user/userSlice';
import { NavigateFunction } from 'react-router-dom';
import { User } from '../types/userSlice';

interface IOAuth {
  dispatch: AppDispatch;
  navigate: NavigateFunction;
  loading?: boolean;
}

const OAuth: React.FC<IOAuth> = ({ loading, dispatch, navigate }) => {
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const { user } = await signInWithPopup(auth, provider);

      const userData = {
        username: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      const { data } = await axios.post<User, AxiosResponse<User>>('/api/auth/google', userData);
      dispatch(signInSuccess(data));

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className=" bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
      {loading ? 'loading' : 'Continue with Google'}
    </button>
  );
};

export default OAuth;
