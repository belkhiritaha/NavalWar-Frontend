import { Component } from 'react';
import * as THREE from 'three';

class Camera extends Component {
    constructor(props) {
        super(props);
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.rotation.order = 'YXZ';
        this.camera.position.z = 500;
        this.raycaster = new THREE.Raycaster();

        this.hoveredTiles = [];
    }

    hoverTiles(tiles) {
        const lookAt = new THREE.Vector3();
        this.camera.getWorldDirection(lookAt)
        this.raycaster.set( this.camera.position, lookAt );
        const intersects = this.raycaster.intersectObjects( tiles.children );
        if ( intersects.length > 0 ) {
            console.log("intersected tile at: ", intersects[0].point);
            // change tile color
            intersects[0].object.material.color.set( 0xff0000 );
        }
    }

    render() {
        return null;
    }
}

export default Camera;