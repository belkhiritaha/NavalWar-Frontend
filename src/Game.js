import Player from './Player.js';
import Scene from './Scene.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

function Game(){

    const camera = new Camera();
    const player = new Player({camera: camera});
    const scene = new Scene();
    const renderer = new Renderer();

    const board = new THREE.Group();

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const geometry = new THREE.BoxGeometry( 1, 1, 1 );
            const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            const cube = new THREE.Mesh( geometry, material );
            cube.position.x = i;
            cube.position.y = j;
            board.add(cube);
        }
    }

    scene.add(board);


    player.movementFunction();

    function animate() {
        requestAnimationFrame( animate );

        board.rotation.x += 0.01;
        board.rotation.y += 0.01;


        renderer.render( scene, camera );
    };

    animate();

    return (
        <>
            
        </>
    );
}

export default Game;