import { Component } from 'react';
import * as THREE from 'three';

class Board extends Component {
    constructor(props) {
        super(props);
        this.tiles = new THREE.Group();
        this.objects = [];
    }

    createBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const tileGeometry = new THREE.PlaneGeometry( 10, 10, 1, 1 );
                const tileMaterial = new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide, wireframe: true} );
                const tile = new THREE.Mesh( tileGeometry, tileMaterial );
                tile.rotation.x = Math.PI / 2;
                tile.position.y = -10;
                tile.position.x = i * 10;
                tile.position.z = j * 10;
                this.tiles.add( tile );
            }
        }
        console.log("board::", this.tiles);
    }

    render() {
        return null;
    }
}

export default Board;