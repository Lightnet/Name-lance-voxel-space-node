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

const Missile = require('./Missile');

const SphereCannon = require('./SphereCannon');
const PlaneCannon = require('./PlaneCannon');
const BoxCannon = require('./BoxCannon');

// todo check if this should be global
let CANNON = null;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        //CANNON = this.physicsEngine.CANNON;

        this.timer = new Timer();
        this.timer.play();

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


    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        //console.log(playerId);
        //console.log(this.world);
        let playercontrol = this.world.getPlayerObject(playerId);
        let player = null;
        let playerShip;
        
        if(playercontrol.class == PlayerController){
            if(playercontrol.pawn != null){
                console.log(inputData);
                console.log("pawn found!");
                let pawn = playercontrol.pawn;
                pawn.processInput(inputData);
            }else{
                console.log("not pawn found!");
                playercontrol.checkpawn();
            }
        }
        
    }

    initGame() {
        console.log("count:"+ this.world.idCount);
        // create the paddle objects
        //this.addObjectToWorld(new Paddle(++this.world.idCount, PADDING, 1));
        //this.addObjectToWorld(new Paddle(++this.world.idCount, WIDTH - PADDING, 2));
        //this.addObjectToWorld(new Ball(++this.world.idCount, WIDTH / 2, HEIGHT / 2));
        let position;// = new ThreeVector(0, 0, 0);
        //this.addObjectToWorld(new PlayerAvatar(++this.world.idCount,this, position,1));
        position = new ThreeVector(0, 5, 0);
        this.addObjectToWorld(new SphereCannon(++this.world.idCount,this, position));
        //position = new ThreeVector(0, -4, 0);
        //this.addObjectToWorld(new BoxCannon(++this.world.idCount,this, position));
        //this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 0, 0)));
        //position = new ThreeVector(0, 20, 0);
        //this.addObjectToWorld(new PlayerCube(++this.world.idCount,this,position ));
        //this.addObjectToWorld(new PlayerCube(++this.world.idCount,this, new ThreeVector(0, 20, 0)));
        //this.spawnship();
    }

    makeMissile(data) {
        let objplayer;
        //= this.world.objects[data.playerId];

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
        let angle = objplayer.yawrotation;
        dir.applyAxisAngle(new THREE.Vector3(0,1,0), angle);
        //apply face direction for make missile in world and scene
        pos.x += dir.x;
        pos.z += dir.z;
        //copy setting from ship
        missile.physicsObj.position.copy(pos);
        missile.physicsObj.velocity.copy(objplayer.physicsObj.velocity);
        //apply rotation y 
        missile.angle = angle;
        //missile.playerId = playerShip.playerId;
        missile.playerId = objplayer.playerId;
        //missile.ownerId = playerShip.id;
        //missile.inputId = inputId;
        //missile.physicsObj.velocity.x += Math.cos(missile.angle * (Math.PI / 180)) * 10;
        //missile.physicsObj.velocity.z += Math.sin(missile.angle * (Math.PI / 180)) * 10;
        missile.physicsObj.velocity.x += dir.x;
        missile.physicsObj.velocity.z += dir.z;
        this.trace.trace(`missile[${missile.id}] created vel=${missile.velocity}`);
        this.timer.add(40, this.destroyMissile, this, [missile.id]);
        return missile;
    }


    // destroy the missile if it still exists
    destroyMissile(missileId) {
        if (this.world.objects[missileId]) {
            this.trace.trace(`missile[${missileId}] destroyed`);
            this.removeObjectFromWorld(missileId);
        }
    }

    //makeprojectile(){
    //}


    makeShip(playerId) {
        console.log("make ship");
        //let ship = new Ship(++this.world.idCount, this, new TwoVector(newShipX, newShipY));
        var pawn = this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 0, 0)));
        pawn.playerId = playerId;
        return pawn;
    };

    requestspawn(playerId){
        console.log("spawn ship....")
        let pawn = new PlayerCube(++this.world.idCount, new ThreeVector(0, 0, 0));
        pawn.playerId = playerId;
        this.addObjectToWorld(pawn);
        //return this.spawnship(playerId);
    }

    spawnship(playerId){
        let pawn;
        //console.log("==================================");
        //console.log("create player object...");
        //console.log(PlayerCube);
        //console.log("count:"+ this.world.idCount);
        pawn = this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 0, 0)));
        pawn.playerId = playerId;
        return pawn;
        //return this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 20, 0)));
    }

    postStepHandleBall() {
        /*
        if (!this.ball)
            return;

        // CHECK LEFT EDGE:
        if (this.ball.position.x <= PADDING + PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle1.y && this.ball.position.y <= this.paddle1.position.y + PADDLE_HEIGHT &&
            this.ball.velocity.x < 0) {

            // ball moving left hit player 1 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = PADDING + PADDLE_WIDTH + 1;
        } else if (this.ball.position.x <= 0) {

            // ball hit left wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = 0;
            console.log(`player 2 scored`);
        }

        // CHECK RIGHT EDGE:
        if (this.ball.position.x >= WIDTH - PADDING - PADDLE_WIDTH &&
            this.ball.position.y >= this.paddle2.position.y && this.ball.position.y <= this.paddle2.position.y + PADDLE_HEIGHT &&
            this.ball.velocity.x > 0) {

            // ball moving right hits player 2 paddle
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH - PADDING - PADDLE_WIDTH - 1;
        } else if (this.ball.position.x >= WIDTH ) {

            // ball hit right wall
            this.ball.velocity.x *= -1;
            this.ball.position.x = WIDTH - 1;
            console.log(`player 1 scored`);
        }

        // ball hits top
        if (this.ball.position.y <= 0) {
            this.ball.position.y = 1;
            this.ball.velocity.y *= -1;
        } else if (this.ball.position.y >= HEIGHT) {
            // ball hits bottom
            this.ball.position.y = HEIGHT - 1;
            this.ball.velocity.y *= -1;
        }
        */
    }

    registerClasses(serializer) {
        serializer.registerClass(require('../common/PlayerAvatar'));
        serializer.registerClass(require('../common/PlayerCube'));
        serializer.registerClass(require('../common/PlayerData'));
        serializer.registerClass(require('../common/PlayerController'));
        serializer.registerClass(require('../common/Missile'));
        serializer.registerClass(require('../common/SphereCannon'));
        serializer.registerClass(require('../common/PlaneCannon'));
        serializer.registerClass(require('../common/BoxCannon'));
    }
}

module.exports = MyGameEngine;
