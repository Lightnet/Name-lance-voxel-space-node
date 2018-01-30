/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';

//const DynamicObject= require('lance-gg').serialize.DynamicObject;
//const PhysicalObject = require('lance-gg').serialize.PhysicalObject;
//const RADIUS = 4;
//const MASS = 0.1;
//let CANNON = null;

const DynamicObject = require('lance-gg').serialize.DynamicObject;

class PlayerData extends DynamicObject {

    constructor(id) {
        super(id);
        this.class = PlayerData;
    };

    onAddToWorld(gameEngine) {
        console.log("add to world scene PlayerData.");
        /*
        // create the physics body
        this.gameEngine = gameEngine;
        
        // create the physics body
        this.gameEngine = gameEngine;
        CANNON = this.gameEngine.physicsEngine.CANNON;
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;

        if (this.scene) {
            let el = this.renderEl = document.createElement('a-entity');
            this.scene.appendChild(el);
            let p = this.position;
            let q = this.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            el.setAttribute('geometry', `primitive: sphere; radius: ${RADIUS}; segmentsWidth: 32; segmentsHeight: 16`);
            el.setAttribute('game-object-id', this.id);
            //this.setupEmitters();
            console.log("a-entity ball");
        }
        */
    }

    toString() {
        return `PlayerData::${super.toString()}`;
    }

}

module.exports = PlayerData;
