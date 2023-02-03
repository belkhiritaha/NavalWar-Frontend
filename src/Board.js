import { Component } from 'react';
import * as THREE from 'three';

import { hoverModes , hoverAreas , hoverRotationDirections } from './Player.js';

const TILE_SIZE = 15;
const BOARD_SIZE = 10;

class Board extends Component {
    constructor(props) {
        super(props);
        this.tiles = new THREE.Group();
        this.objects = [];
        this.hoveredTiles = [];
        this.z0 = 0;
    }

    createBoard(z0) {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const tileGeometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE, 1, 1);
                const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, wireframe: true });
                const tile = new THREE.Mesh(tileGeometry, tileMaterial);
                tile.rotation.x = Math.PI / 2;
                tile.position.y = - TILE_SIZE;
                tile.position.x = z0 + i * TILE_SIZE;
                tile.position.z =  j * TILE_SIZE;
                this.tiles.add(tile);
            }
        }
        this.z0 = z0;
    }


    hoverTiles(camera, hoverMode, hoverRotation) {
        this.hoveredTiles.forEach(tile => {
            tile.material.color.set(0x00ff00);
        });
        this.hoveredTiles = [];

        let rootTileX = -1;
        let rootTileZ = -1;

        if (hoverMode !== hoverModes.NONE) {    
            const { tileX, tileZ } = this.getPointedTile(camera);
            if (tileX !== -1 && tileZ !== -1) {
                rootTileX = tileX;
                rootTileZ = tileZ;
                const hoverArea = hoverAreas[hoverMode];
                try {
                    const newPlaceTiles = [];
                    let tileX;
                    let tileZ;
                    for (let i = 0; i < hoverArea.x; i++) {
                        for (let j = 0; j < hoverArea.y; j++) {
                            if (hoverRotation % 2 === 0) {
                                tileX = rootTileX + hoverRotationDirections[hoverRotation].x * i;
                                tileZ = rootTileZ + hoverRotationDirections[hoverRotation].y * j;
                            } else {
                                tileX = rootTileX + hoverRotationDirections[hoverRotation].y * j;
                                tileZ = rootTileZ + hoverRotationDirections[hoverRotation].x * i;
                            }
                            const tile = this.tiles.children[tileX * BOARD_SIZE + tileZ];
                            if (!tile || tileX >= BOARD_SIZE || tileZ >= BOARD_SIZE ) throw new Error("Cannot place ship here");
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
                }
            }
        }
        return { rootTileX, rootTileZ };
    }

    getPointedTile(camera) {
        const lookAt = new THREE.Vector3();
        camera.camera.getWorldDirection(lookAt);
        camera.raycaster.set(camera.camera.position, lookAt);
        const intersects = camera.raycaster.intersectObjects(this.tiles.children);
        if (intersects.length > 0) {
            const tile = intersects[0].object;
            const tileX = Math.round(tile.position.x / TILE_SIZE - this.z0 / TILE_SIZE);
            const tileZ = Math.round(tile.position.z / TILE_SIZE);
            return { tileX, tileZ };
        }
        return { tileX: -1, tileZ: -1 };
    }

    getTileFromPosition(x, z) {
        const tileX = Math.round(x / TILE_SIZE - this.z0 / TILE_SIZE);
        const tileZ = Math.round(z / TILE_SIZE);
        return this.tiles.children[tileX * BOARD_SIZE + tileZ];
    }


    hoverEnnemyTiles(camera) {
        // clear previous hovered tiles
        this.hoveredTiles.forEach(tile => {
            tile.material.color.set(0x00ff00);
        }
        );
        this.hoveredTiles = [];

        const { tileX, tileZ } = this.getPointedTile(camera);
        if (tileX !== -1 && tileZ !== -1) {
            const tile = this.tiles.children[tileX * BOARD_SIZE + tileZ];
            this.hoveredTiles.push(tile);
            this.hoveredTiles.forEach(tile => {
                tile.material.color.set(0xff0000);
            });
        }
        return { tileX, tileZ };
    }


    render() {
        return null;
    }
}

export default Board;
export { TILE_SIZE };
export { BOARD_SIZE };