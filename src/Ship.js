import { Component } from "react";
import * as THREE from "three";
import { TILE_SIZE } from "./Board";

class Ship extends Component {
    constructor(props) {
        super(props);
        this.name = props.name;
        this.isSetup = false;
        this.occupiedTiles = [];
        this.position = { x: 0, y: 0, z: 0 };
        this.dimensions = props.dimensions;
        this.modelSrc = props.modelSrc;
        this.textureSrc = props.textureSrc;
        this.model = null;
        this.rotation = 0;
    }

    loadModel(loader, modelSettings, hoverRotation, modelsList) {
        console.log(modelSettings)
        loader.load(this.modelSrc, (object) => {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( this.textureSrc ) } );
                }
            });
            object.name = this.name;
            object.scale.set(modelSettings.scale[0], modelSettings.scale[1], modelSettings.scale[2]);
            object.position.set(modelSettings.offset[hoverRotation][0] * TILE_SIZE, modelSettings.offset[hoverRotation][1] * TILE_SIZE, modelSettings.offset[hoverRotation][2] * TILE_SIZE);
            object.rotation.set(modelSettings.rotation[0], modelSettings.rotation[1], modelSettings.rotation[2]);
            console.log(modelSettings.offset[hoverRotation][2])
            modelsList.add(object);
            console.log(modelsList)
            this.model = object;
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        }
        , (error) => {
            console.log('An error happened');
            console.log(error);
        });
    }


    putOnTile(tile, hoverRotation) {
        this.position.x = tile.x;
        this.position.z = tile.z;
        this.rotation = hoverRotation;
        // this.occupiedTiles = this.getOccupiedTiles();
        this.isSetup = true;
    }

    getOccupiedTiles() {
        let tiles = [];
        for (let i = 0; i < this.dimensions.x; i++) {
            for (let j = 0; j < this.dimensions.y; j++) {
                tiles.push({
                    x: this.position.x + i,
                    y: this.position.y + j,
                });
            }
        }
        return tiles;
    }
}

export default Ship;