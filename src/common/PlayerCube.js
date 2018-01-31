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
const Quaternion = require('lance-gg').serialize.Quaternion;
const Utils = require('./Utils');

const THREE = require('three');

const RADIUS = 4;
const MASS = 0.1;
let CANNON = null;

//class PlayerAvatar extends DynamicObject {
class PlayerCube extends PhysicalObject {

    //constructor(id,gameEngine, position) {
    constructor(id, position) {
        super(id, position);
        //console.log("this.id");
        //console.log("add to world scene PlayerCube.");
        this.class = PlayerCube;
        this.playerId = null;
        this.yawrotation = 0;
        this.bpress = false;
        this.bspawn = false;
        this.movespeed = 0.1;

        this.isBot = false;
    };

    onAddToWorld(gameEngine) {
        super.onAddToWorld(gameEngine);
        this.gameEngine = gameEngine;
        // create the physics body
        CANNON = this.gameEngine.physicsEngine.CANNON;
        console.log("add to world scene playercube.");
        console.log("============id:" + this.id);
        //console.log("playerId:" + this.playerId);
        //console.log(gameEngine.physicsEngine);
        this.physicsObj = gameEngine.physicsEngine.addBox(1,1,1, MASS,0.1);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;
        this.physicsObj.playerId = this.playerId;


        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
        if (this.scene) {
            console.log("a-entity box");
            let el = this.renderEl = document.createElement('a-entity');
            let p = this.position;
            let q = this.quaternion;
            //let q = this.physicsObj.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            //el.setAttribute('geometry', `primitive: box;width:1;height:1;depth:1;`);
            el.setAttribute('gltf-model', `#pointer`);
            el.setAttribute('game-object-id', this.id);
            el.setAttribute('id', this.id);
            //this.setupEmitters();
            this.scene.appendChild(el);
            this.el = el; //assign var since it not in the lancegg
            //console.log("player clientEngine id:" + gameEngine.renderer.clientEngine.playerId);
            //console.log("player object id:"+ this.playerId);
            if(this.playerId == gameEngine.renderer.clientEngine.playerId){
                el.setAttribute("camera3rd", '');
            }
        }

        if(this.isBot){
            this.attachAI();
        }
    }

    processInput(inputData){
        //console.log(inputData);
        if ((inputData.input === 'up') && (inputData.options.movement == true)) {
            this.forwardthrust();
        } else if ((inputData.input === 'down') && (inputData.options.movement == true)) {
            this.reversethrust();
        } else if ((inputData.input === 'left') && (inputData.options.movement == true)) {
            this.turnleft();
        } else if ((inputData.input === 'right') && (inputData.options.movement == true)) {
            this.turnright();
        }

        if( (inputData.input === 'space')) {
            if(this.gameEngine !=null){
                this.gameEngine.emit('fire',{playerId:this.playerId});
                console.log("FIRE!");
            }
        }

        if( (inputData.input === 'b') && (inputData.options.movement == true)) {
            this.stopmovement();
        }
    }

    forwardthrust(){
        if(this.physicsObj != null){
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            //this.physicsObj.velocity.setZero();
            //let pos = this.physicsObj.position;

            let q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(0,1,0),this.yawrotation);
            let dirvector = new THREE.Vector3( 0, 0, 1 );
            var quaternion = new THREE.Quaternion(q.x,q.y,q.z,q.w);
            dirvector.applyQuaternion( quaternion );
            //console.log(dirvector);
            //pos.x = pos.x + dirvector.x;
            //pos.z = pos.z + dirvector.z;
            this.physicsObj.applyImpulse(
                new CANNON.Vec3(dirvector.x, dirvector.y, dirvector.z), // impulse 
                new CANNON.Vec3().copy(this.physicsObj.position) // world position
            );
        }
    }

    stopmovement(){
        if(this.physicsObj != null){
            this.physicsObj.velocity.setZero();
        }
    }

    reversethrust(){
        if(this.physicsObj != null){

            let CANNON = this.gameEngine.physicsEngine.CANNON;
            //this.physicsObj.velocity.setZero();
            //let pos = this.physicsObj.position;
            let q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(0,1,0),this.yawrotation);
            let dirvector = new THREE.Vector3( 0, 0, -1 );
            var quaternion = new THREE.Quaternion(q.x,q.y,q.z,q.w);
            dirvector.applyQuaternion( quaternion );
            //console.log(dirvector);
            //pos.x = pos.x + dirvector.x;
            //pos.z = pos.z + dirvector.z;
            this.physicsObj.applyImpulse(
                new CANNON.Vec3(dirvector.x, dirvector.y, dirvector.z), // impulse 
                new CANNON.Vec3().copy(this.physicsObj.position) // world position
            );
        }
    }

    turnleft(){
        if(this.physicsObj != null){
            //console.log(this.pawn);
            //console.log(this.quaternion);
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            this.yawrotation = this.yawrotation + 0.1;
            if(this.yawrotation > 360){
                this.yawrotation = 0;
            }
            //console.log("turn left?");
            this.physicsObj.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.yawrotation);
        }
    }

    turnright(){
        if(this.physicsObj != null){
            //console.log(this.quaternion);
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            this.yawrotation = this.yawrotation - 0.1;

            if(this.yawrotation < 0){
                this.yawrotation = 360;
            }
            
            if(this.physicsObj !=null){
                this.physicsObj.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.yawrotation);
            }
        }
        //console.log('turn right');
    }

    //lock camera
    foucscamera(){
        //work when client engine is call for reason when input handle
        this.scene = this.gameEngine.renderer ? this.gameEngine.renderer.scene : null;
        if((this.scene !=null)&&(this.el !=null)){
            console.log("camera set scene client?");
            if(this.playerId == this.gameEngine.renderer.clientEngine.playerId){
                this.el.setAttribute("camera3rd", '');
            }
        }
    }

    fireweapon(inputData){
        this.gameEngine.emit('fire',{playerid:this.playerId});
    }

    toString() {
        return `PlayerCube::${super.toString()}`;
    }

    //create AI 
    attachAI() {
        this.isBot = true;

        this.onPreStep = () => {
            this.steer();
        };

        this.gameEngine.on('preStep', this.onPreStep);

        let fireLoopTime = Math.round(250 + Math.random() * 100);

        this.fireLoop = this.gameEngine.timer.loop(fireLoopTime, () => {
            if (this.target && this.distanceToTarget(this.target) < 400) {
                //this.gameEngine.makeMissile(this);
                this.gameEngine.emit('fire',{playerId:this.playerId});
            }
        });
    }

    distanceToTarget(target) {
        let dx = this.position.x - target.position.x;
        let dz = this.position.z - target.position.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    steer() {
        //console.log("steer?");
        let closestTarget = null;
        let closestDistance = Infinity;
        for (let objId of Object.keys(this.gameEngine.world.objects)) {
            let obj = this.gameEngine.world.objects[objId];
            let distance = this.distanceToTarget(obj);
            if (obj != this && distance < closestDistance) {
                closestTarget = obj;
                closestDistance = distance;
            }
        }
        this.target = closestTarget;

        if (this.target) {

            let newVX = this.target.position.x - this.position.x;
            let newVY = this.target.position.z - this.position.z

            let turnRight = -Utils.shortestArc(Math.atan2(newVX, newVY), Math.atan2(Math.sin(this.angle*Math.PI/180), Math.cos(this.angle*Math.PI/180)));

            if (turnRight > 0.05) {
                this.isRotatingRight = true;
            } else if (turnRight < -0.05) {
                this.isRotatingLeft = true;
            } else {
                this.isAccelerating = true;
                this.showThrust = 5;
            }

        }
    }

    destroy() {
        console.log("destroy physicsObj");
        if(this.physicsObj !=null){
            this.gameEngine.physicsEngine.removeObject(this.physicsObj);
        }

        if((this.scene !=null)&&(this.el)){
            //this.scene.appendChild(this.el);
            //console.log(this.scene);
            let entity = this.el;
            entity.parentNode.removeChild(entity);
        }

        if (this.onPreStep){
            this.gameEngine.removeListener('preStep', this.onPreStep);
            this.onPreStep = null;
        }
        
    }
}
module.exports = PlayerCube;