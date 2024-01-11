import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosSignUpType } from '../types/signUp';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post<AxiosSignUpType>('api/auth/signup', formData);
      setLoading(false);
      console.log('User created successfully!');
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      console.log(error);

      if (typeof error === 'string') {
        setError(error.toUpperCase());
      } else if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        setError(message);
        setLoading(false);
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
