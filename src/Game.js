import Player from './Player.js';
import Scene from './Scene.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Component } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const style = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
};


class Game extends Component{
    componentDidMount() {
        this.sceneSetup();
        this.addLights();
        this.loadTheModel();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
    }

    sceneSetup = () => {
        // get container dimensions and use them for scene sizing
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.camera = new Camera();
        this.player = new Player({camera: this.camera});
        this.scene = new Scene();
        this.renderer = new Renderer();
        this.renderer.setSize( width, height );
        this.camera.position.z = 500;
        this.controls = new OrbitControls( this.camera, this.mount );
        this.mount.appendChild( this.renderer.domElement );
    };

    loadTheModel = () => {
        // instantiate a loader
        const loader = new OBJLoader();

        // load a resource
        loader.load(
            'https://api.belkhiri.dev/models/cloud.obj',
            ( object ) => {
                // set object name
                object.name = "Elephant_4";
                this.scene.add( object );
                const el = this.scene.getObjectByName("Elephant_4");
                el.position.set(0, -150,0 );
                el.material.color.set(0x50C878);
                el.rotation.x = 23.5;
                this.model = el;
            },
             ( xhr ) => {
                const loadingPercentage = Math.ceil(xhr.loaded / xhr.total * 100);
                console.log( ( loadingPercentage ) + '% loaded' );
                this.props.onProgress(loadingPercentage);
            },
             ( error ) => {
                console.log( 'An error happened:' + error );
            }
        );
    };

    // adding some lights to the scene
    addLights = () => {
        const lights = [];

        // set color and intensity of lights
        lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

        // place some lights around the scene for best looks and feel
        lights[ 0 ].position.set( 0, 2000, 0 );
        lights[ 1 ].position.set( 1000, 2000, 1000 );
        lights[ 2 ].position.set( - 1000, - 2000, - 1000 );

        this.scene.add( lights[ 0 ] );
        this.scene.add( lights[ 1 ] );
        this.scene.add( lights[ 2 ] );
    };

    startAnimationLoop = () => {
        // slowly rotate an object
        if (this.model) this.model.rotation.z += 0.005;

        this.renderer.render( this.scene, this.camera );

        // The window.requestAnimationFrame() method tells the browser that you wish to perform
        // an animation and requests that the browser call a specified function
        // to update an animation before the next repaint
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize( width, height );
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    render() {
        return <div style={style} ref={ref => (this.mount = ref)} />;
    }
}

export default Game;