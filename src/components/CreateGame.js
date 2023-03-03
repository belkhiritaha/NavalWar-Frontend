import './CreateGame.css';
import React from 'react';

import ReturnButton from './ReturnButton';




class CreateGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.form[0].value});
  }

  createGame(event) {
    this.setState({isGameStarted: true});
    console.log("Creating game");

    const url = 'https://localhost:7080/api/game/';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      // Manipuler les données de la réponse
      console.log(data);
    })
    .catch(error => console.error('Error:', error))


    /*if(responseCOde = 200){
      const id_game = response.id;
      const id_player = response.playerId;

      //afficher l'id de la game
      //mettre le joueur dans la game
      url = 'https://localhost:7080/api/game/'+ id_game + '?playerId=' + id_player;
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      })
    }*/

  }


  render() {
    return (
      <React.StrictMode>
      <div>
        <button className="button" type="button" onClick={ReturnButton}>
          BACK
        </button>
      </div>
      <div className = "Title">
        <h1>SPATIAL WAR</h1>
      </div>
      <div className = "CreateGameForm">
        <form id='create'>
          <label>
            <input type="text" placeholder='username' value={this.state.value} onChange={this.handleChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <button className="button" type="button" onClick={ this.createGame } >
          CREATE
        </button>
      </div>
      </React.StrictMode>
    );
  }
}



export default CreateGame;