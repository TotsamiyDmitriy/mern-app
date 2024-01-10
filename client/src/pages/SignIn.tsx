import React from 'react';
import { Link } from 'react-router-dom';

const SignIn = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input type="text" className="border p-3 rounded-lg" placeholder="username" id="username" />
        <input type="text" className="border p-3 rounded-lg" placeholder="email" id="email" />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
        />
        <button
          type="button"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Sign in
        </button>
        <button
          type="button"
          className=" bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          continue with google
        </button>
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
