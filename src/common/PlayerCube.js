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

const MASS = 10;
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
        this.angle = 0;
        this.dir = new ThreeVector();
        this.bpress = false;
        this.bspawn = false;
        this.movespeed = 0.1;

        this.health = 100;
        this.maxhealth = 100;

        this.isBot = false;
        this.isDead = false;
    };

    onAddToWorld(gameEngine) {
        super.onAddToWorld(gameEngine);
        this.gameEngine = gameEngine;
        // create the physics body
        CANNON = this.gameEngine.physicsEngine.CANNON;
        console.log("add to world scene playercube.");
        console.log("Player Id:" + this.id);
        //console.log("playerId:" + this.playerId);
        //console.log(gameEngine.physicsEngine);
        this.physicsObj = gameEngine.physicsEngine.addBox(1,1,1, MASS,0.1);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;
        this.physicsObj.playerId = this.playerId;
        this.physicsObj.fixedRotation = true;
        this.physicsObj.ownerId = this.id;
        //console.log(this.physicsObj);
        //console.log(this);


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

            this.texthealthel = document.createElement('a-text');
            this.texthealthel.setAttribute('value', `Health:${this.health} / ${this.maxhealth} `);
            this.texthealthel.setAttribute('color', `gray`);
            this.texthealthel.setAttribute('align', `center`);
            this.texthealthel.setAttribute('position', `0 2 0`);
            this.texthealthel.setAttribute('cameraface', ``);
            
            el.appendChild(this.texthealthel);

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
                this.gameEngine.emit('fire',{id:this.id});
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
            q.setFromAxisAngle(new CANNON.Vec3(0,1,0),this.angle);
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

    reversethrust(){
        if(this.physicsObj != null){
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            //this.physicsObj.velocity.setZero();
            //let pos = this.physicsObj.position;
            let q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(0,1,0),this.angle);
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

    stopmovement(){
        if(this.physicsObj != null){
            this.physicsObj.velocity.setZero();
        }
    }

    turnleft(){
        if(this.physicsObj != null){
            //console.log(this.pawn);
            //console.log(this.quaternion);
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            this.angle = this.angle + 0.1;
            if(this.angle > 360){
                this.angle = 0;
            }
            //console.log("turn left?");
            this.physicsObj.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.angle);
        }
    }

    turnright(){
        if(this.physicsObj != null){
            //console.log(this.quaternion);
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            this.angle = this.angle - 0.1;
            if(this.angle < 0){
                this.angle = 360;
            }
            if(this.physicsObj !=null){
                this.physicsObj.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), this.angle);
            }
        }
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
        this.gameEngine.emit('fire',{id:this.id});
    }

    eventDamage(params){
        console.log("playercube > eventdamage!");
        if(params==null)return;

        this.scene = this.gameEngine.renderer ? this.gameEngine.renderer.scene : null;

        console.log(this.scene);

        if(params.damage != null){
            console.log("============================================");
            this.health -= params.damage;
            console.log(this.texthealthel);
            if(this.texthealthel !=null){
                console.log("update health?");
                this.texthealthel.setAttribute('value', `Health:${this.health} / ${this.maxhealth} `);
            }
        }
        console.log("Health:"+this.health + "/" + this.maxhealth);
    }

    toString() {
        return `PlayerCube::${super.toString()}`;
    }

    //create AI 
    attachAI() {
        //this.isBot = true;
        this.onPreStep = () => {
            this.steer();
        };
        this.gameEngine.on('preStep', this.onPreStep);
        let fireLoopTime = Math.round(250 + Math.random() * 100);
        this.fireLoop = this.gameEngine.timer.loop(fireLoopTime, () => {
            if (this.target && this.distanceToTarget(this.target) < 400) {
                //this.gameEngine.makeMissile(this);
                //console.log("Id:"+this.playerId);
                //console.log(this.gameEngine);
                //console.log("PlayerCube > AI > fire!");
                this.gameEngine.emit('fire', {id:this.id});
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
            if((obj != this && distance < closestDistance)&&(obj.class == PlayerCube)) {
                closestTarget = obj;
                closestDistance = distance;
            }
        }
        this.target = closestTarget;

        if (this.target) {
            let CANNON = this.gameEngine.physicsEngine.CANNON;
            //console.log("?");
            //console.log("id:"+this.id + "target?" + this.target.id);
            let m1 = new THREE.Matrix4();
            let q1 = new THREE.Quaternion();
            let q2 = new THREE.Quaternion(this.physicsObj.quaternion.x,this.physicsObj.quaternion.y,this.physicsObj.quaternion.z,this.physicsObj.quaternion.w);
            let c1 = new THREE.Vector3(this.position.x,this.position.y,this.position.z);
            let t1 = new THREE.Vector3(this.target.position.x,this.target.position.y,this.target.position.z);
            m1.lookAt( t1, c1, new THREE.Vector3(0,1,0) );
            q1.setFromRotationMatrix( m1 );
            q2.slerp(q1,0.01);
            this.physicsObj.quaternion.set(q2.x,q2.y,q2.z,q2.w);
            let c2 = new THREE.Vector3(0, 0, 1 ).applyQuaternion( q2 );
            //console.log(c2);
            this.dir = c2;
            //let aa1 = this.physicsObj.quaternion.toAxisAngle(new CANNON.Vec3(0,1,0));
            //console.log(aa1[1]);
            //this.angle = aa1[1];

            //let aa1 = this.quaternion.toAxisAngle();
            //console.log(aa1);

            //let q4 = q3.toAxisAngle();
            //console.log(q4);
            //this.angle = q4.angle;

            //console.log(q2.conjugate().y);
            //this.angle = angle;
            //this.angle = this.physicsObj.rotation.y;
            /*
            let newVX = this.target.position.x - this.position.x;
            let newVY = this.target.position.z - this.position.z;
            let turnRight = -Utils.shortestArc(Math.atan2(newVX, newVY), Math.atan2(Math.sin(this.angle*Math.PI/180), Math.cos(this.angle*Math.PI/180)));
            if (turnRight > 0.05) {
                this.isRotatingRight = true;
                this.turnright();
                //console.log("right turn?");
            } else if (turnRight < -0.05) {
                this.isRotatingLeft = true;
                this.turnleft();
                //console.log("left turn?");
            } else {
                this.isAccelerating = true;
                this.showThrust = 5;
            }
            */
        }
    }

    destroy() {
        //console.log("destroy physicsObj");
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