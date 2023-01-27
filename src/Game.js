import Player from './Player.js';
import Scene from './Scene.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

function Game(){

    const scene = new Scene();
    const camera = new Camera();
    const renderer = new Renderer();

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    let model;
    const loader = new OBJLoader();
    const Dmodel = loader.load( 'http://localhost:8000/models/cruiser.obj', function ( object ) {
        model = object;
        model.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            }
        } );
        return model;
    }, undefined, function ( error ) {
        console.error( error );
    } );

    scene.add( Dmodel );


    console.log(scene.children);
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
            
        </>
    );
}

export default Game;