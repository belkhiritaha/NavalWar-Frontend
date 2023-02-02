import Player from './Player.js';
import Renderer from './Renderer.js';
import Board from './Board.js';
import Camera from './Camera.js';
import HUD from './HUD.js';

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Component } from 'react';

import { hoverModes } from './Player.js';
import { TILE_SIZE } from './Board.js';

const style = {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
};

const STEPS_PER_FRAME = 5;

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
        this.ennemyBoard = new Board();
        this.board.createBoard(0);
        // ennemy board
        this.ennemyBoard.createBoard(200);
        this.scene.add(this.board.tiles);
        this.scene.add(this.ennemyBoard.tiles);

        this.mount.appendChild( this.renderer.domElement );
        this.models = new THREE.Group();
        this.modelsSettings = {};
        this.keyStates = {};
    };
    
    loadModels = () => {
        this.scene.background = new THREE.CubeTextureLoader().setPath("/skybox/").load([
            "right.png", "left.png",
            "top.png", "bottom.png",
            "front.png", "back.png"
        ]);
        
        // read models_settings.json
        fetch("/models_settings.json")
        .then(response => response.json())
        .then(data => {
            this.modelsSettings = data;
        });


        const loader = new OBJLoader();
        Object.keys(hoverModes).forEach((mode, index) => {
            if (index > 0) {
                loader.load(
                    '/' + mode + '/Package/' + mode + '.obj',
                    ( object ) => {
                        object.name = mode;
                        const scale = this.modelsSettings[mode].scale;
                        const offset = this.modelsSettings[mode].offset[this.player.hoverRotation];
                        const rotation = this.modelsSettings[mode].rotation;
                        console.log(scale, offset, rotation);
                        object.scale.set(scale[0], scale[1], scale[2]);
                        object.position.set(offset[0] * TILE_SIZE, offset[1] * TILE_SIZE, offset[2] * TILE_SIZE);
                        object.rotation.set(rotation[0], rotation[1], rotation[2]);
                        this.models.add(object);
                        this.scene.add(this.models);
                        // change material of object
                        object.traverse( ( child ) => {
                            if ( child.isMesh ) {
                                child.material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( '/' + mode + '/Package/' + mode + '.png' ) } );
                            }
                        } );
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
            }
        });

        loader.load(
            '/spacestations/station06_ring.obj',
            ( object ) => {
                object.name = "station6";
                object.scale.set(10, 10, 10);
                object.position.set(70, -30, 70);
                this.models.add(object);
                this.scene.add(this.models);
                // change material of object
                object.traverse( ( child ) => {
                    if ( child.isMesh ) {
                        child.material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( '/spacestations/station06_ring_specular.png' ) } );
                    }
                } );

                // clone object
                const object2 = object.clone();
                object2.name = "station2";
                object2.position.set(270, -30, 70);
                this.models.add(object2);
                this.scene.add(this.models);
            }
        )

        loader.load(
            '/spacestations/station01.obj',
            ( object ) => {
                object.name = "station3";
                object.scale.set(10, 10, 10);
                object.position.set(-100, 0, 270);
                object.rotation.set(1.5, 0.3, 0.5);
                this.models.add(object);
                this.scene.add(this.models);
                // change material of object
                object.traverse( ( child ) => {
                    if ( child.isMesh ) {
                        child.material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( '/spacestations/station01_specular.png' ) } );
                    }
                } );
            }
        )
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

        if ( this.player.mode == 1 ) {
            if ( this.player.hoverMode != 0 ) {
                let moveTile = this.board.hoverTiles(this.camera, this.player.hoverMode, this.player.hoverRotation);
                if ( moveTile.rootTileX != -1 ) {
                    this.models.children.filter((child) => {
                        if (hoverModes[Object.keys(hoverModes).find(key => key === child.name)] == this.player.hoverMode) {
                            child.position.x = moveTile.rootTileX * TILE_SIZE + this.modelsSettings[child.name].offset[this.player.hoverRotation][0] * TILE_SIZE;
                            child.position.z = moveTile.rootTileZ * TILE_SIZE + this.modelsSettings[child.name].offset[this.player.hoverRotation][2] * TILE_SIZE;
                            child.rotation.y = - this.player.hoverRotation * Math.PI / 2 + this.modelsSettings[child.name].rotation[1];
                        }
                    });
                }

            }
        }
        else {
            this.ennemyBoard.hoverEnnemyTiles(this.camera);
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
        const speedDelta = deltaTime * 30;
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
            this.player.velocity.y = 4;
        }
        if ( this.keyStates[ 'ShiftLeft' ] ) {
            this.player.velocity.y = - 4;
        }
    }

    keyDownListener = ( event ) => {
        this.keyStates[ event.code ] = true;
    };

    keyUpListener = ( event ) => {
        this.keyStates[ event.code ] = false;
        if ( event.code == 'KeyE' ) {
            this.player.hoverMode += 1;
            if ( this.player.hoverMode > 5 ) this.player.hoverMode = 0;
            this.setState({hoverMode: this.player.hoverMode});
        }
        if ( event.code == 'KeyR' ) {
            this.player.hoverRotation += 1;
            if ( this.player.hoverRotation > 3 ) this.player.hoverRotation = 0;
        }
        if ( event.code == 'KeyF' ) {
            this.player.mode = 1 - this.player.mode;
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