import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Form  from 'react-bootstrap/Form';

  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }
  
  function App() {
    const [isLoading, setLoading] = useState(false);
  
    useEffect(() => {
      if (isLoading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }
    }, [isLoading]);
  
    /*isActive = "disabled";*/

    const handleClick = () => setLoading(true);

    return (
      <div className = "Forms">
        <Form>
          <Form.Group controlId="formBasicUsername">
            <Form.Control type="Username" placeholder="Username" />
          </Form.Group>

          <Button variant="primary" size="lg" disabled={isLoading} onClick={!isLoading ? handleClick : null} /*{isActive}*/>
            {isLoading ? 'Loading…' : 'Rejoindre une partie'}
          </Button>
        </Form>
      </div>
    );
  }

export default App;

