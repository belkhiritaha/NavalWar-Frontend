import { Component } from 'react';
import * as THREE from 'three';

const hoverAreas = [
    { x: 2, y: 1 },
    { x: 3, y: 2 },
    { x: 3, y: 1 },
    { x: 4, y: 2 },
    { x: 5, y: 3 }
];

class Board extends Component {
    constructor(props) {
        super(props);
        this.tiles = new THREE.Group();
        this.objects = [];
        this.hoveredTiles = [];
    }

    createBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const tileGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
                const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
                const tile = new THREE.Mesh(tileGeometry, tileMaterial);
                tile.rotation.x = Math.PI / 2;
                tile.position.y = -10;
                tile.position.x = i * 10;
                tile.position.z = j * 10;
                this.tiles.add(tile);
            }
        }
        console.log("board::", this.tiles);
    }


    hoverTiles(camera, hoverMode) {
        // clear previous hovered tiles
        this.hoveredTiles.forEach(tile => {
            tile.material.color.set(0x00ff00);
        });
        this.hoveredTiles = [];

        let rootTileX = -1;
        let rootTileZ = -1;

        if (hoverMode !== -1) {
            // if not in none mode
            const lookAt = new THREE.Vector3();
            camera.camera.getWorldDirection(lookAt);
            camera.raycaster.set(camera.camera.position, lookAt);
            const intersects = camera.raycaster.intersectObjects(this.tiles.children);

            if (intersects.length > 0) {
                const hoverArea = hoverAreas[hoverMode];
                const rootTile = intersects[0].object;
                rootTileX = rootTile.position.x / 10;
                rootTileZ = rootTile.position.z / 10;
                try {
                    const newPlaceTiles = [];
                    for (let i = 0; i < hoverArea.x; i++) {
                        for (let j = 0; j < hoverArea.y; j++) {
                            const tileX = rootTileX + i;
                            const tileZ = rootTileZ + j;
                            const tile = this.tiles.children[tileX * 10 + tileZ];
                            if (!tile) throw new Error("Cannot place ship here");
                            newPlaceTiles.push(tile);
                        }
                    }
                    if (newPlaceTiles.length === hoverArea.x * hoverArea.y) {
                        this.hoveredTiles = newPlaceTiles;
                        this.hoveredTiles.forEach(tile => {
                            tile.material.color.set(0xff0000);
                        });
                    }
                } catch (error) {
                    rootTileX = -1;
                    rootTileZ = -1;
                    // console.error(error.message);
                }
            }
        }
        return { rootTileX, rootTileZ };
    }


    render() {
        return null;
    }
}

export default Board;