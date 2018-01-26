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

        this.yawrotation = 0;
        this.bpress = false;
        this.bspawn = false;
        this.movespeed = 0.1;
    };

    onAddToWorld(gameEngine) {
        super.onAddToWorld(gameEngine);
        this.gameEngine = gameEngine;
        // create the physics body
        CANNON = this.gameEngine.physicsEngine.CANNON;

        console.log("add to world scene playercube.");
        console.log("============id:" + this.id);
        //console.log("playerId:" + this.playerId);
    
        this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;

        if (this.scene) {
            console.log("a-entity box");
            let el = this.renderEl = document.createElement('a-entity');
            let p = this.position;
            let q = this.quaternion;
            //let q = this.physicsObj.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            el.setAttribute('geometry', `primitive: box;width:1;height:1;depth:1;`);
            el.setAttribute('game-object-id', this.id);
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
            }
        }
    }

    processInput(inputData){
        //console.log(inputData);
        if ((inputData.input === 'up') && (inputData.options.movement == true)) {
            //playerPaddle.position.y -= 5;
            this.forwardthrust();
        } else if ((inputData.input === 'down') && (inputData.options.movement == true)) {
            //playerPaddle.position.y += 5;
            //this.test();
            this.reversethrust();
        } else if ((inputData.input === 'left') && (inputData.options.movement == true)) {
            //playerPaddle.position.y += 5;
            //console.log("left");
            this.turnleft();
        } else if ((inputData.input === 'right') && (inputData.options.movement == true)) {
            //playerPaddle.position.y += 5;
            //console.log("right");
            this.turnright();
        }
        if( (inputData.input === 'space') && (inputData.options.movement == true)) {
            //playerPaddle.position.y += 5;
            //console.log("space");
        }
    }

    forwardthrust(){
        if(this.physicsObj != null){
            this.physicsObj.velocity.setZero();
            let pos = this.physicsObj.position;
            pos.z = pos.z + this.movespeed;
            this.physicsObj.position.set(pos.x,pos.y,pos.z);
            //console.log("forward?");
            //console.log(this.position);
        }
    }

    reversethrust(){
        if(this.physicsObj != null){
            //console.log(this.position);
            //this.pawn.physicsObj.position.x++;
            this.physicsObj.velocity.setZero();
            let pos = this.physicsObj.position;
            pos.z = pos.z - this.movespeed;
            this.physicsObj.position.set(pos.x,pos.y,pos.z);
        }
    }

    turnleft(){
        if(this.physicsObj != null){
            //console.log(this.pawn);
            //console.log(this.quaternion);
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            this.yawrotation = this.yawrotation - 0.1;
            if(this.yawrotation < 0){
                this.yawrotation = 360;
            }
            //console.log("turn left?");
            this.physicsObj.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.yawrotation);
        }
    }

    turnright(){
        if(this.physicsObj != null){
            //console.log(this.quaternion);
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            this.yawrotation = this.yawrotation + 0.1;
            if(this.yawrotation > 360){
                this.yawrotation = 0;
            }
            if(this.physicsObj !=null){
                this.physicsObj.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.yawrotation);
            }
        }
        //console.log('turn right');
    }



    foucscamera(){
        this.scene = this.gameEngine.renderer ? this.gameEngine.renderer.scene : null;
        if((this.scene !=null)&&(this.pawn !=null)){
            console.log("camera set scene client?");
            if(this.playerId == this.gameEngine.renderer.clientEngine.playerId){
                let cameraEL = document.querySelector('a-camera');
                cameraEL.setAttribute("orbit-controls", "target",`#${this.pawn.id}`);
                cameraEL.components['orbit-controls'].target = this.pawn.position;
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