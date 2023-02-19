import Game from './Game.js';

function App(props) {
  return (
    <Game onProgress={props.onProgress} />
  );
}

export default App;
