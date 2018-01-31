/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';

const GameEngine = require('lance-gg').GameEngine;
const ThreeVector = require('lance-gg').serialize.ThreeVector;
const Timer = require('./Timer');

const THREE = require('three');

//game objects
const PlayerAvatar = require('./PlayerAvatar');
const PlayerController = require('./PlayerController');
const PlayerCube = require('./PlayerCube');


//projectile
const Missile = require('./Missile');
const CubeProjectile = require('./CubeProjectile');


//basic shapes
const SphereCannon = require('./SphereCannon');
const PlaneCannon = require('./PlaneCannon');
const BoxCannon = require('./BoxCannon');

// todo check if this should be global
let CANNON = null;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        //CANNON = this.physicsEngine.CANNON;
        //console.log(this.physicsEngine.world.step(1/60));

        this.projectiles = [];

        this.timer = new Timer();
        this.timer.play();

        this.objmissile = null;

        this.on('server__postStep', ()=>{
            this.timer.tick();
        });

        //this.on('fire',function(data){
            //console.log("data");
            //console.log(data);
            //this.makeMissile();
        //});
        //console.log(this);
    }

    start() {
        super.start();
        //let CANNON = this.physicsEngine.CANNON;
        //console.log(CANNON);
        //console.log(this.physicsEngine.world.gravity.y);
        //set gravity to zero
        this.physicsEngine.world.gravity.y = 0;
        //this.worldSettings = {
            //width: 400,
            //height: 400
        //};
        this.on('postStep', () => {

        });

        this.on('objectAdded', (object) => {
            console.log("object added");
            //if (object.id == 1) {
                //this.playeravatar = object;
            //}
            this.object_physics_handler(object);
        });
    }

    object_physics_handler(obj){
        console.log("handle object...");
        if(obj.class == Missile){
            console.log("obj Missile found!");
            obj.playerId = 0;
            //obj.physicsObj.addEventListener("collide", function(e){
                //console.log(e);
                //console.log("sphere collided");
            //});
        }
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        //console.log(playerId);
        //console.log(this.world);
        let playercontrol = this.world.getPlayerObject(playerId);
        
        if(playercontrol.class == PlayerController){
            playercontrol.checkpawn();

            if((playercontrol.pawn)){
                //console.log(inputData);
                //console.log("pawn found!");
                let pawn = playercontrol.pawn;
                pawn.processInput(inputData);
            }
        }
    }

    //=================================
    // Create object world/scene
    //=================================
    initGame() {
        //console.log("count:"+ this.world.idCount);
        this.addObjectToWorld(new SphereCannon(++this.world.idCount,this, new ThreeVector(0, 6, 0)));

        this.addObjectToWorld(new BoxCannon(++this.world.idCount,this, new ThreeVector(0, 0, -7)));

        let pawn = new PlayerCube(++this.world.idCount, new ThreeVector(-10, 0, -10));
        pawn.isBot = true;
        this.addObjectToWorld(pawn);
    }

    // Game Engine Step.
    // Check object physics to be remove from world
    step(isReenact) {
        super.step(isReenact);
        //console.log("step");

        //if(this.objmissile){
            //this.physicsEngine.removeObject(this.objmissile);
            //this.objmissile = null;
            //this.gameEngine.physicsEngine.removeObject(this.physicsObj);
        //}

        var i = this.projectiles.length
        while (i--) {
            console.log("remove object?");
            let _objid = this.projectiles[i];
            //this.physicsEngine.removeObject(_objid);
            //let obj = this.world.objects[objid];
            //if(obj != null){
                //this.removeObjectFromWorld(obj);
                //console.log(this.projectiles[i]);
            //}
            //this.emit("destorymissile",_objid);
            for (let objId in this.world.objects) {
                let o = this.world.objects[objId];
                if (o.id == _objid ) {
                    //objplayer = o;
                    if(o !=null){
                        console.log("delete!?");
                        this.removeObjectFromWorld(o.id);
                        //this.emit("destorymissile",o.id);
                    }
                    break;
                }
            }
            this.projectiles.splice(i, 1);
        }
    }


    //=================================
    // Create Projectile
    //=================================
    makeMissile(data) {
        let objplayer;
        console.log("create missile?");

        for (let objId in this.world.objects) {
            let o = this.world.objects[objId];
            if (o.playerId == data.playerId && o.class == PlayerCube) {
                objplayer = o;
                break;
            }
        }

        if(objplayer == null){
            console.log("null player ship!");
            return;
        }

        let missile = new Missile(++this.world.idCount);
        this.addObjectToWorld(missile);
        //copy vector
        let pos = objplayer.physicsObj.position.clone();
        //threejs
        let dir = new THREE.Vector3(0,0,5);
        let angle = objplayer.angle;
        dir.applyAxisAngle(new THREE.Vector3(0,1,0), angle);
        //apply face direction for make missile in world and scene
        pos.x += dir.x;
        pos.z += dir.z;
        //copy setting from ship
        missile.physicsObj.position.copy(pos);
        missile.physicsObj.velocity.copy(objplayer.physicsObj.velocity);
        //apply rotation y 
        missile.angle = angle;
        missile.playerId = objplayer.playerId;
        missile.ownerId = objplayer.id;
        //missile.inputId = inputId;
        //missile.physicsObj.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
        //missile.physicsObj.velocity.z += Math.sin(missile.angle * (Math.PI / 180)) * 10;
        missile.physicsObj.velocity.x += dir.x;
        missile.physicsObj.velocity.z += dir.z;
        this.trace.trace(`missile[${missile.id}] created vel=${missile.velocity}`);
        this.timer.add(500, this.destroyMissile, this, [missile.id]);
        return missile;
    }

    //=================================
    // destroy Projectile
    //=================================
    // destroy the missile if it still exists
    destroyMissile(missileId) {
        if (this.world.objects[missileId]) {
            this.trace.trace(`missile[${missileId}] destroyed`);
            this.removeObjectFromWorld(missileId);
        }
    }

    makeprojectile(data){
        let objplayer;
        //console.log("create projectile?");
        for (let objId in this.world.objects) {
            let o = this.world.objects[objId];
            if ((o.id == data.id)&&(o.class == PlayerCube)) {
                objplayer = o;
                break;
            }
        }

        console.log("playerId" + objplayer.playerId);

        if(objplayer == null){
            console.log("null player ship!");
            return;
        }

        let cubeprojectile = new CubeProjectile(++this.world.idCount);
        this.addObjectToWorld(cubeprojectile);
        //copy vector
        let pos = objplayer.physicsObj.position.clone();
        //threejs
        let dir = new THREE.Vector3(0,0,3);
        let angle = objplayer.angle;
        if(objplayer.isBot){
            dir = objplayer.dir;
            //dir.addScalar(3);
            dir.x *= 3;
            dir.z *= 3;
            console.log(dir);

        }else{
            dir.applyAxisAngle(new THREE.Vector3(0,1,0), angle);
        }

        //apply face direction for make cubeprojectile in world and scene
        pos.x += dir.x;
        pos.z += dir.z;
        //copy setting from ship
        cubeprojectile.physicsObj.position.copy(pos);
        cubeprojectile.physicsObj.velocity.copy(objplayer.physicsObj.velocity);
        //apply rotation y 
        cubeprojectile.angle = angle;
        cubeprojectile.playerId = objplayer.playerId;
        cubeprojectile.ownerId = objplayer.id;
        //missile.inputId = inputId;
        //missile.physicsObj.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
        //missile.physicsObj.velocity.z += Math.sin(missile.angle * (Math.PI / 180)) * 10;
        cubeprojectile.physicsObj.velocity.x += dir.x;
        cubeprojectile.physicsObj.velocity.z += dir.z;
        this.trace.trace(`cubeprojectile[${cubeprojectile.id}] created vel=${cubeprojectile.velocity}`);
        this.timer.add(500, this.destroyMissile, this, [cubeprojectile.id]);
        return cubeprojectile;
    }

    //=======================
    // Create Ship Object
    //=======================

    makeShip(playerId) {
        console.log("call > makeship");
        let playercontrol = this.world.getPlayerObject(playerId);
        let pawn;
        //console.log(playercontrol);
        if(!playercontrol.pawn){
            pawn = this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 0, 0)));
            pawn.playerId = playerId;
            //playercontrol.pawn = pawn;
            //console.log("created?");
        }else{
            pawn = playercontrol.pawn;
        }
        return pawn;
    };

    registerClasses(serializer) {
        //player objects
        serializer.registerClass(require('../common/PlayerAvatar'));
        serializer.registerClass(require('../common/PlayerData'));
        serializer.registerClass(require('../common/PlayerController'));
        serializer.registerClass(require('../common/PlayerCube'));

        //projectiles
        serializer.registerClass(require('../common/Missile'));
        serializer.registerClass(require('../common/CubeProjectile'));

        //basic shapes
        serializer.registerClass(require('../common/SphereCannon'));
        serializer.registerClass(require('../common/PlaneCannon'));
        serializer.registerClass(require('../common/BoxCannon'));
    }
}

module.exports = MyGameEngine;