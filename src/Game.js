import Player from './Player.js';
import Renderer from './Renderer.js';
import Board from './Board.js';
import Camera from './Camera.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Component } from 'react';

const style = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
};

const STEPS_PER_FRAME = 5;

class Game extends Component{
    componentDidMount() {
        this.sceneSetup();
        this.addLights();
        this.loadModels();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
        window.addEventListener('keydown', this.keyDownListener);
        window.addEventListener('keyup', this.keyUpListener);
        window.addEventListener('mousemove', this.mouseMoveListener);
        window.addEventListener('mousedown', this.clickDownListener);
        window.addEventListener('mouseup', this.clickUpListener);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
    }

    sceneSetup = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.camera = new Camera();
        this.camera.camera.rotation.order = 'YXZ';
        this.player = new Player({camera: this.camera.camera});
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.renderer = new Renderer();
        this.renderer.setSize( width, height );
        this.camera.camera.position.z = 500;
        this.board = new Board();
        this.board.createBoard();
        this.scene.add(this.board.tiles);

        this.mount.appendChild( this.renderer.domElement );
        this.models = [];
        this.keyStates = {};
        // this.reticle = new THREE.Mesh(
        //     new THREE.RingGeometry( 0.02, 0.04, 32 ),
        //     new THREE.MeshBasicMaterial( {
        //         color: 0xffffff,
        //         opacity: 0.5,
        //         transparent: true
        //     } )
        // );
        // this.reticle.position.z = - 1;
        // this.scene.add( this.reticle );
    };

    loadModels = () => {
        // instantiate a loader
        const loader = new OBJLoader();

        // load cloud a resource
        loader.load(
            'https://api.belkhiri.dev/models/cloud.obj',
            ( object ) => {
                // set object name
                object.name = "Elephant_4";
                // this.scene.add( object );
                // const el = this.scene.getObjectByName("Elephant_4");
                this.models.push(object);
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

        // load  shark resource
        loader.load(
            'https://api.belkhiri.dev/models/shark.obj',
            ( object ) => {
                // set object name
                object.name = "Elephant_3";
                // scale
                object.scale.set(50, 50, 50);
                this.scene.add( object );
                // const el = this.scene.getObjectByName("Elephant_3");
                this.models.push(object);
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
        const deltaTime = Math.min( 0.05, this.clock.getDelta() ) / STEPS_PER_FRAME;
        
        for ( let i = 0; i < STEPS_PER_FRAME; i++ ) {
            this.controls( deltaTime );
            this.player.update( deltaTime );
            // this.reticle.position.copy( this.player.position.add( this.player.direction.multiplyScalar( 2 ) ) );
        }

        this.camera.hoverTiles(this.board.tiles);

        this.renderer.render( this.scene, this.camera.camera );

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.renderer.setSize( width, height );
        this.camera.camera.aspect = width / height;

        this.camera.camera.updateProjectionMatrix();
    };

    controls = ( deltaTime ) => {
        const speedDelta = deltaTime * 8;
        if ( this.keyStates[ 'KeyW' ] ) {
            this.player.velocity.add( this.player.getForwardVector().multiplyScalar( speedDelta ) );
        }
        if ( this.keyStates[ 'KeyS' ] ) {
            this.player.velocity.add( this.player.getForwardVector().multiplyScalar( - speedDelta ) );
        }
        if ( this.keyStates[ 'KeyA' ] ) {
            this.player.velocity.add( this.player.getSideVector().multiplyScalar( - speedDelta ) );
        }
        if ( this.keyStates[ 'KeyD' ] ) {
            this.player.velocity.add( this.player.getSideVector().multiplyScalar( speedDelta ) );
        }
        // if ( playerOnFloor ) {
        //     if ( this.keyStates[ 'Space' ] ) {
        //         this.player.velocity.y = 15;
        //     }
        // }
    }

    keyDownListener = ( event ) => {
        this.keyStates[ event.code ] = true;
    };

    keyUpListener = ( event ) => {
        this.keyStates[ event.code ] = false;
    };

    clickDownListener = () => {
        document.body.requestPointerLock();
    };

    clickUpListener() {
        if ( document.pointerLockElement !== null ) console.log('clickUpListener');
    };

    mouseMoveListener = ( event ) => {
        if ( document.pointerLockElement === document.body ) {
            if (this.camera.camera){
                this.camera.camera.rotation.y -= event.movementX / 500;
                this.camera.camera.rotation.x -= event.movementY / 500;
            }
        }
    };

    render() {
        return <div style={style} ref={ref => (this.mount = ref)} />;
    }
}

export default Game;