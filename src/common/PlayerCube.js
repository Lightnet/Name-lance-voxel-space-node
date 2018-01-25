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
const RADIUS = 4;
const MASS = 0.1;
let CANNON = null;

//class PlayerAvatar extends DynamicObject {
class PlayerCube extends PhysicalObject {

    //constructor(id,gameEngine, position) {
    constructor(id, gameEngine, position) {
        super(id, position);
        this.id = id;
        this.class = PlayerCube;
        //this.playerId = null;
        this.gameEngine = gameEngine;
        //console.log("this.id");
        //console.log("add to world scene PlayerCube.");
        //console.log("id:" + id);
    };

    onAddToWorld(gameEngine) {
        console.log("add to world scene playercube.");
        console.log("id:" + this.id);
        // create the physics body
        this.gameEngine = gameEngine;
        //CANNON = this.gameEngine.physicsEngine.CANNON;
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;

        if (this.scene) {
            let el = this.renderEl = document.createElement('a-entity');
            //console.log(this.position);
            //console.log(this.id);
            
            let p = this.position;
            let q = this.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            el.setAttribute('geometry', `primitive: box;width:8;height:8;depth:8;`);
            el.setAttribute('game-object-id', this.id);
            //this.setupEmitters();

            this.scene.appendChild(el);
            console.log("a-entity box");
        }
    }

    toString() {
        return `PlayerCube::${super.toString()}`;
    }
}
module.exports = PlayerCube;
