import React, { Component } from "react";
import ReactDOM from "react-dom/client";
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

import App from "./App";
import Crosshair from "./Crosshair";

class Container extends React.Component {
    state = {isMounted: true};

    render() {
        const {isMounted = true, loadingPercentage = 0} = this.state;
        return (
            <>
                <Crosshair />
                {isMounted && <App onProgress={loadingPercentage => this.setState({ loadingPercentage })} />}
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