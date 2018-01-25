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
        this.playerId = null;
        this.gameEngine = gameEngine;
        //console.log("this.id");
        //console.log("add to world scene PlayerCube.");
        //console.log("id:" + id);
    };

    onAddToWorld(gameEngine) {
        super.onAddToWorld(gameEngine);
        this.gameEngine = gameEngine;
        CANNON = this.gameEngine.physicsEngine.CANNON;

        //console.log(gameEngine.renderer);
        console.log("add to world scene playercube.");
        console.log("============id:" + this.id);
        //console.log(this.clientEngine);

        //if(this.id > 100000){
            //console.log("REMOVE .... id:" + this.id);
            //gameEngine.removeObjectFromWorld(this.id);
            //return;
        //}

        //if(this.playerId == null){
            //console.log("REMOVE .... id:" + this.id);
            //gameEngine.removeObjectFromWorld(this.id);
            //return;
        //}
        console.log("playerId:" + this.playerId);
        // create the physics body
        
        //CANNON = this.gameEngine.physicsEngine.CANNON;
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
        //console.log( this.scene);
        //if ((this.scene)&&(this.id < 100000)) {
        //if ((this.scene)&&(this.id > 100000)) {
        if ((this.scene)) {
            //this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
            //this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
            //this.physicsObj.angularDamping = 0.1;

            let el = this.renderEl = document.createElement('a-entity');
            //console.log(this.position);
            //console.log(this.id);
            
            let p = this.position;
            let q = this.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            el.setAttribute('geometry', `primitive: box;width:1;height:1;depth:1;`);
            el.setAttribute('game-object-id', this.id);
            //this.setupEmitters();
            this.scene.appendChild(el);
            console.log("a-entity box");
        }
    }

    toString() {
        return `PlayerCube::${super.toString()}`;
    }

    destroy() {
        console.log("destroy physicsObj");
        this.gameEngine.physicsEngine.removeObject(this.physicsObj);
    }
}
module.exports = PlayerCube;