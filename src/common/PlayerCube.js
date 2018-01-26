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
const ThreeVector = require('lance-gg').serialize.ThreeVector;
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
        //console.log(this.gameEngine);
        //CANNON = this.gameEngine.physicsEngine.CANNON.Body();

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
        //out of sync 
        if(gameEngine.renderer == null){//server?
            this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
            this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
            this.physicsObj.angularDamping = 0.1;
        }else{//client?
            this.physicsObj = new this.gameEngine.physicsEngine.CANNON.Body({mass: 0});
        }

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
        //console.log( this.scene);
        //if ((this.scene)&&(this.id < 100000)) {
        //if ((this.scene)&&(this.id > 100000)) {
        if ((this.scene)&&(this.playerId != gameEngine.renderer.clientEngine.playerId)) {
            console.log("a-entity box");
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
            //el.setAttribute('game-object-id', this.id);
            el.setAttribute('id', this.id);
            //this.setupEmitters();
            this.scene.appendChild(el);
            //console.log(this.gameEngine);
            //console.log("player clientEngine id:" + gameEngine.renderer.clientEngine.playerId);
            //console.log("player object id:"+ this.playerId);
            if(this.playerId == gameEngine.renderer.clientEngine.playerId){
                let cameraEL = document.querySelector('a-camera');
                cameraEL.setAttribute("orbit-controls", "target",`#${this.id}`);
                cameraEL.components['orbit-controls'].target = p;
                //console.log(cameraEL.components['orbit-controls'].setAttribute('target','#' + this.id));
                //cameraEL.components['orbit-controls'].attrValue.target = '#' + this.id;
                //console.log("#" + this.id);
                //console.log(cameraEL.components['orbit-controls']);
            }
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