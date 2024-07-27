import React from 'react';
import './App.css';
import logo from './logo2.png';

import Translate from './components/Translate';


function App() {
  return (
    <div>
      <img className="logo" src={logo} alt="Logo" />
        <Translate />
    
    </div>
  );
}

export default App;