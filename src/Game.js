import Player from './Player.js';
import Scene from './Scene.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';

import * as THREE from 'three';

function Game(){

    const scene = new Scene();
    const camera = new Camera();
    const renderer = new Renderer();

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame( animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    };

    animate();

    return (
        <>
            <Player />
        </>
    );
}

export default Game;