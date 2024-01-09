import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { About, Home, SignIn, SignUp } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/" element={<SignUp />}></Route>
        <Route path="/" element={<About />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
