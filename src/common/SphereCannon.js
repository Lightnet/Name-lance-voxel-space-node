/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';

//const DynamicObject= require('lance-gg').serialize.DynamicObject;
const PhysicalObject = require('lance-gg').serialize.PhysicalObject;
const RADIUS = 1;
const MASS = 0.1;
let CANNON = null;

//class PlayerAvatar extends DynamicObject {
class SphereCannon extends PhysicalObject {

    constructor(id,gameEngine, position) {
        super(id, position);
        this.class = SphereCannon;
        this.gameEngine = gameEngine;
        //this.id = id;
        //console.log("add to world scene SphereCannon.");
        //console.log("id:" + this.id);
        //console.log("id:" + id);
        //console.log("gameEngine:" + gameEngine);
    };

    onAddToWorld(gameEngine) {
        console.log("===============================.");
        console.log("add to world scene SphereCannon.");
        console.log("id:" + this.id);

        // create the physics body
        //this.gameEngine = gameEngine;
        
        // create the physics body //important to add here 
        this.gameEngine = gameEngine;
        //CANNON = this.gameEngine.physicsEngine.CANNON;
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        //console.log(gameEngine.physicsEngine);

        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;
        this.physicsObj.addEventListener("collide", function(e){
            //console.log("sphere collided");
        });

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
            //console.log("a-entity ball");
        }
    }

    reset(){
        this.physicsObj.position.set(0,20,0);
    }


    toString() {
        return `SphereCannon::${super.toString()}`;
    }

    destroy() {
        console.log("destroy physicsObj");
        this.gameEngine.physicsEngine.removeObject(this.physicsObj);
    }
}

module.exports = SphereCannon;
