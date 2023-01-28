import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

import App from "./App";

class Container extends React.Component {
    state = {isMounted: true};

    render() {
        const {isMounted = true, loadingPercentage = 0} = this.state;
        return (
            <>
                <button onClick={() => this.setState(state => ({isMounted: !state.isMounted}))}>
                    {isMounted ? "Unmount" : "Mount"}
                </button>
                {isMounted && <App onProgress={loadingPercentage => this.setState({ loadingPercentage })} />}
                {isMounted && loadingPercentage === 100 && <div>Scroll to zoom, drag to rotate</div>}
                {isMounted && loadingPercentage !== 100 && <div>Loading Model: {loadingPercentage}%</div>}
            </>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Container />
  </React.StrictMode>
);