import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const Header: React.FC<unknown> = () => {
  const { currentUser } = useAppSelector(({ userReducer }) => ({
    currentUser: userReducer.currentUser,
  }));

  return (
    <header className=" bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/" className="font-bold text-sm sm:text-xl flex-wrap">
          <span className="text-slate-500">MERN</span>
          <span className="text-slate-700">State</span>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/" className="hidden sm:inline text-slate-700 hover:underline">
            <li> Home </li>
          </Link>
          <Link to="/about" className="hidden sm:inline text-slate-700 hover:underline">
            <li>About</li>
          </Link>
          <Link to="/profile" className="hidden sm:inline text-slate-700 hover:underline">
            {currentUser ? (
              <img
                className=" rounded-full w-7 h-7 mx-1 object-cover"
                src={currentUser.photoURL}
                alt="profile"
              />
            ) : (
              <li> Sign in </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
