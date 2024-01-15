import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';

import { useAppDispatch } from '../redux/hooks';

import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import { useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import { User } from '../types/userSlice';

const SignIn = () => {
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector(({ userReducer }) => ({
    loading: userReducer.loading,
    error: userReducer.error,
  }));

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const { data } = await axios.post<User, AxiosResponse<User>>('api/auth/signin', formData);
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log(error);

      if (typeof error === 'string') {
        dispatch(signInFailure(error.toUpperCase()));
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        dispatch(signInFailure(message));
      }
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          className="border p-3 rounded-lg"
          placeholder="email"
          id="email"
        />
        <input
          onChange={handleChange}
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'loading' : 'Sign in'}
        </button>
        <OAuth dispatch={dispatch} navigate={navigate} />
        <span className="text-red-500">{error ? error : ''}</span>
        <div className="flex gap-2 mt-5">
          <p>Dont have account?</p>
          <Link to={'/sign-up'}>
            <span className="text-blue-700">Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
