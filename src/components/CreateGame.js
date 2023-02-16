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
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
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
      <div className = "CreateGameForm">
        <form id='create' onSubmit={this.handleSubmit}>
          <label>
            <input type="text" placeholder='username' value={this.state.value} onChange={this.handleChange} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <button className="button" type="button" /*onClick={ CREER LA GAME AVEC LE FORMULAIRE PLUS HAUT }*/ >
          CREATE
        </button>
      </div>
      </React.StrictMode>
    );
  }
}



export default CreateGame;