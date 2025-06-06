import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Historial } from './components/Historial';
import Informacion from './components/informacion';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/informacion" element={<Informacion />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
