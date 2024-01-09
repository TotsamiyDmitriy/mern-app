import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { About, Home, SignIn, SignUp } from './pages';
import { Header } from './components';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
