import { Component } from 'react';
import * as THREE from 'three';

const hoverModes = {
    NONE: 0,
    CRUISER: 1,
    BATTLESHIP: 2,
    SUBMARINE: 3,
    DESTROYER: 4,
    CARRIER: 5
}

const hoverAreas = [
    { x: 0, y: 0 },
    { x: 2, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 1 },
    { x: 4, y: 2 },
    { x: 5, y: 3 }
];

const hoverRotationDirections = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
];



class Player extends Component {
    // player has x, y, z, rotation x, y, z
    constructor(props) {
        super(props);
        this.position = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.hoverMode = hoverModes.CARRIER;
        this.hoverRotation = 0;
    }

    update( deltaTime ) {
        let damping = Math.exp( - 4 * deltaTime ) - 1;

        this.velocity.addScaledVector( this.velocity, damping );

        const deltaPosition = this.velocity.clone().multiplyScalar( deltaTime * 10 );
        this.position = this.position.add( deltaPosition );

        this.props.camera.position.copy( this.position );

    }

    getForwardVector() {
        this.props.camera.getWorldDirection( this.direction );
        this.direction.y = 0;
        this.direction.normalize();

        return this.direction;
    }

    getSideVector() {
        this.props.camera.getWorldDirection( this.direction );
        this.direction.y = 0;
        this.direction.normalize();
        this.direction.cross( this.props.camera.up );

        return this.direction;

    }

    render() {
        return null;
    }
}

export default Player;
export { hoverModes, hoverAreas, hoverRotationDirections };