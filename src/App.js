import Game from './Game.js';

function App(props) {
  return (
    <Game onProgress={props.onProgress} playerId={props.playerId} gameId={props.gameId} />
  );
}

export default App;
