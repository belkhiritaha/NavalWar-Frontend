import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEffect } from 'react';
import * as THREE from 'three';

function Camera(){
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    return camera;
}

export default Camera;