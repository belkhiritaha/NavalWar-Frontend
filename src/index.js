import React from 'react';
import 'typeface-quicksand';
import ReactDOM from 'react-dom/client';

import './index.css';

import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';

import reportWebVitals from './reportWebVitals';

function JoinGameMenu(){

  root.render(
    <React.StrictMode>
      <JoinGame />
    </React.StrictMode>
    );
}

function CreateGameMenu(){

  root.render(
    <React.StrictMode>
      <CreateGame />
    </React.StrictMode>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
                <div className = "Title">
                <h1>SPATIAL WAR</h1>
            </div>
            <div className = "Buttons">
                <button className="button" type="button" onClick={JoinGameMenu}>
                    JOIN GAME
                </button>
                <button className="button" type="button" onClick={CreateGameMenu}>
                    CREATE GAME
                </button>
            </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

