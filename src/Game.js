import Player from './Player.js';
import Renderer from './Renderer.js';
import Board from './Board.js';
import Camera from './Camera.js';
import HUD from './HUD.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Component } from 'react';

const style = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
};

const STEPS_PER_FRAME = 5;

const downVector = new THREE.Vector3( 0, - 1, 0 );
const upVector = new THREE.Vector3( 0, 1, 0 );

class Game extends Component{
    state = {
        hoverMode: 0
    };

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
        this.setState({hoverMode: this.player.hoverMode});
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.renderer = new Renderer();
        this.renderer.setSize( width, height );
        this.camera.camera.position.z = 500;
        this.board = new Board();
        this.board.createBoard();
        this.scene.add(this.board.tiles);

        this.mount.appendChild( this.renderer.domElement );
        this.models = new THREE.Group();
        this.keyStates = {};
    };

    loadModels = () => {
        const loader = new OBJLoader();
        loader.load(
            'https://api.belkhiri.dev/models/shark.obj',
            ( object ) => {
                object.name = "shark";
                object.scale.set(5, 5, 5);
                this.models.add(object);
                this.scene.add(this.models);
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
        }

        if ( this.player.hoverMode != -1 ) {
            // this.board.hoverTiles(this.camera, this.player.hoverMode);
            let moveTile = this.board.hoverTiles(this.camera, this.player.hoverMode);
            if ( moveTile.rootTileX != -1 ) {
                // move shark
                this.models.children.filter((child) => {
                    if (child.name == "shark") {
                        child.position.x = moveTile.rootTileX * 10;
                        child.position.z = moveTile.rootTileZ * 10;
                    }
                });
            }

        }

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
        if ( this.keyStates[ 'Space' ] ) {
            this.player.velocity.y = 1;
        }
        if ( this.keyStates[ 'ShiftLeft' ] ) {
            this.player.velocity.y = - 1;
        }
    }

    keyDownListener = ( event ) => {
        this.keyStates[ event.code ] = true;
    };

    keyUpListener = ( event ) => {
        this.keyStates[ event.code ] = false;
        if ( event.code == 'KeyE' ) {
            this.player.hoverMode += 1;
            if ( this.player.hoverMode > 6 ) this.player.hoverMode = 0;
            this.setState({hoverMode: this.player.hoverMode});
        }
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
        return (
            <>
                <HUD hoverMode={this.state.hoverMode} />
                <div style={style} ref={ref => (this.mount = ref)} />
            </>
        );
    }
}

export default Game;