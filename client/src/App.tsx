import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { About, Home, Profile, SignIn, SignUp } from './pages';
import { Header } from './components';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';

const App: React.FC<unknown> = () => {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/listing/:id" element={<Listing />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create-listing" element={<CreateListing />}></Route>
          <Route path="/edit-listing/:id" element={<UpdateListing />}></Route>
        </Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
