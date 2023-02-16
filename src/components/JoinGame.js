import './JoinGame.css';
import React from 'react';
 

import ReturnButton from './ReturnButton'; 



class JoinGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '',
                  gameid: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.username,
                    gameid: event.target.gameid});
  }

  handleSubmit(event) {
    alert('USER : ' + this.state.username +' want to join game : ' + this.state.gameid + '');
    event.preventDefault();
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
      <div className = "JoinGameForm">
        <form onSubmit={this.handleSubmit}>
          <label>
            <input type="text" 
                    placeholder='Username' 
                    value={this.state.username} 
                    onChange={this.handleChange} />
          </label>
          <br/>
          <label>
            <input type="text"
                   placeholder='GameId'
                   value={this.state.gameid}
                   onChange={this.handleChange} />
          </label>
          <br/>
        </form>
        <button className="button" type="button" /*onClick={ JOIN LA GAME AVEC LE FORMULAIRE PLUS HAUT }*/>
          JOIN
        </button>
      </div>
      </React.StrictMode>
    );
  }
}



export default JoinGame;