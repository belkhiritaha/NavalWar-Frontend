import logo from './logo.svg';
import './App.css';
import Game from './Game.js';

function App(props) {
  return (
    <Game onProgress={props.onProgress} />
  );
}

export default App;
