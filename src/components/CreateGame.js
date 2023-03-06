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

  /*createGame(event) {
    this.setState({isGameStarted: true});
    console.log("Creating game");

    const url = 'https://localhost:7080/api/game/';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => 
              if(response.status == 200){
                                          await;
                                        })
    .then(data => {
      // Manipuler les données de la réponse
      console.log(data);
    })
    .then()
    .catch(error => console.error('Error:', error))


    if(responseCOde = 200){
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
    }

  }*/

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
    .then(response => {
      if(response.status == 200) {
        return response.json(); // renvoie la réponse sous forme de JSON
      } else {
        throw new Error('Erreur lors de la création de la partie');
      }
    })
    .then(data => {
      const id_game = data.id;
      const id_player = data.playerId;
  
      console.log('ID de la partie :', id_game);
  
      // Ajouter le joueur à la partie
      const url_join = `https://localhost:7080/api/game/${id_game}?playerId=${id_player}`;
      return fetch(url_join, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      });
    })
    .then(response => {
      if(response.status == 200) {
        console.log('Le joueur a été ajouté à la partie');
      } else {
        throw new Error('Erreur lors de l\'ajout du joueur à la partie');
      }
    })
    .catch(error => console.error('Error:', error));
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