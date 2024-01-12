import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosSignUpType } from '../types/signUp';
import OAuth from '../components/OAuth';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useAppSelector(({ userReducer }) => ({
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
      const { data } = await axios.post<AxiosSignUpType>('api/auth/signup', formData);
      dispatch(signInSuccess(data));
      console.log('User created successfully!');
      navigate('/sign-in');
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
          type="text"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          placeholder="username"
          id="username"
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          placeholder="email"
          id="email"
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          placeholder="password"
          id="password"
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}>
          {loading ? 'loading' : 'Sign up'}
        </button>
        <OAuth dispatch={dispatch} navigate={navigate} />
        <span className="text-red-500">{error ? error : ''}</span>
        <div className="flex gap-2 mt-5">
          <p>Have an account?</p>
          <Link to={'/sign-in'}>
            <span className="text-blue-700">Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
