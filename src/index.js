import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'typeface-quicksand';

import App from "./App";
import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';
import reportWebVitals from './reportWebVitals';
import { useState, useEffect } from 'react';

import './index.css';

function Menu() {
    const [page, setPage] = useState('menu');
    const [playerId, setPlayerId] = useState(null);
    const [gameId, setGameId] = useState(null);

    function returnButtonCallBack() {
        setPage('menu');
    }

    function playerIdCallBack(playerId) {
        setPlayerId(playerId);
        console.log("playerId: " + playerId);
        setPage('game');
    }
    
    function gameIdCallBack(gameId) {
        console.log("gameId: " + gameId);
        setGameId(gameId);
    }

    if (page === 'menu') {
        return (
            <>
                <div className="Title">
                    <h1>SPATIAL WAR</h1>
                </div>
                <div className="Buttons">
                    <button className="button" type="button" onClick={() => setPage('join')}>
                        JOIN GAME
                    </button>
                    <button className="button" type="button" onClick={() => setPage('create')}>
                        CREATE GAME
                    </button>
                </div>
            </>);
    } else if (page === 'join') {
        return <JoinGame returnButtonCallBack={returnButtonCallBack} playerIdCallBack={playerIdCallBack} gameIdCallBack={gameIdCallBack} />;
    }
    else if (page === 'create') {
        return <CreateGame returnButtonCallBack={returnButtonCallBack} playerIdCallBack={playerIdCallBack} gameIdCallBack={gameIdCallBack} />;
    }
    else if (page === 'game') {
        return <App playerId={playerId} gameId={gameId} />;
    }
}


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
    <React.StrictMode>
        <Menu />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

