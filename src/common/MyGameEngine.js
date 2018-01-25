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

//game objects
const PlayerAvatar = require('./PlayerAvatar');

const PlayerCube = require('./PlayerCube');
const SphereCannon = require('./SphereCannon');
const PlaneCannon = require('./PlaneCannon');
const BoxCannon = require('./BoxCannon');

//const Paddle = require('./Paddle');
//const Ball = require('./Ball');
//const PADDING = 20;
//const WIDTH = 400;
//const HEIGHT = 400;
//const PADDLE_WIDTH = 10;
//const PADDLE_HEIGHT = 50;
/*
var window = {
    addEventListener:function(){}
};
global.window=window;

var navigator= {
    //addEventListener:function(){}
};

global.navigator=navigator;

require('aframe');
*/

// todo check if this should be global
let CANNON = null;

class MyGameEngine extends GameEngine {

    constructor(options) {
        super(options);

        //CANNON = this.physicsEngine.CANNON;
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
        
        /*
        this.on('postStep', () => { this.postStepHandleBall(); });
        this.on('objectAdded', (object) => {
            if (object.id == 1) {
                this.paddle1 = object;
            } else if (object.id == 2) {
                this.paddle2 = object;
            } else if (object.class == Ball) {
                this.ball = object;
            }
        });
        */

        this.on('postStep', () => {

        });
        //this.on('objectAdded', (object) => {
            //if (object.id == 1) {
                //this.playeravatar = object;
            //}
        //});
    }

    /*
    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        // get the player's primary object
        let player = this.world.getPlayerObject(playerId);
        if (player) {
            console.log(`player ${playerId} pressed ${inputData.input}`);
            if (inputData.input === 'up') {
                player.isMovingUp = true;
            } else if (inputData.input === 'down') {
                player.isMovingDown = true;
            } else if (inputData.input === 'right') {
                player.isRotatingRight = true;
            } else if (inputData.input === 'left') {
                player.isRotatingLeft = true;
            } else if (inputData.input === 'space') {
                this.fire(player, inputData.messageIndex);
                this.emit('fire');
            }
        }
    }
    */

    processInput(inputData, playerId) {

        super.processInput(inputData, playerId);

        //console.log(playerId);
    
        // get the player paddle tied to the player socket
        let playercontrol = this.world.getPlayerObject(playerId);

        //console.log(playercontrol);

        if (playercontrol) {
            if(playercontrol.processInput !=null){
                //console.log(inputData);
                playercontrol.processInput(inputData);

                if(inputData.input === 'space'){
                    if(playercontrol.bspawn == false){
                        playercontrol.bspawn = true;
                        playercontrol.pawn = this.requestspawn(playerId);
                        //this.requestspawn(playerId);
                    }
                }
            }

            //if (inputData.input === 'up') {
                //playerPaddle.position.y -= 5;
            //} else if (inputData.input === 'down') {
                //playerPaddle.position.y += 5;
                //playercontrol.test();
            //} else if (inputData.input === 'left') {
                //playerPaddle.position.y += 5;
                //console.log("left");
            //} else if (inputData.input === 'right') {
                //playerPaddle.position.y += 5;
                //console.log("right");
            //}
            //if (inputData.input === 'space') {
                //playerPaddle.position.y += 5;
                //console.log("space");
            //}
        }
        //console.log("move?");
    }

    initGame() {
        console.log("count:"+ this.world.idCount);
        // create the paddle objects
        //this.addObjectToWorld(new Paddle(++this.world.idCount, PADDING, 1));
        //this.addObjectToWorld(new Paddle(++this.world.idCount, WIDTH - PADDING, 2));
        //this.addObjectToWorld(new Ball(++this.world.idCount, WIDTH / 2, HEIGHT / 2));
        let position;// = new ThreeVector(0, 0, 0);
        //this.addObjectToWorld(new PlayerAvatar(++this.world.idCount,this, position,1));
        position = new ThreeVector(0, 50, 0);
        this.addObjectToWorld(new SphereCannon(++this.world.idCount,this, position));
        //position = new ThreeVector(0, -4, 0);
        //this.addObjectToWorld(new BoxCannon(++this.world.idCount,this, position));
        //this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 0, 0)));
        //position = new ThreeVector(0, 20, 0)
        //this.addObjectToWorld(new PlayerCube(++this.world.idCount,this,position ));
        //this.addObjectToWorld(new PlayerCube(++this.world.idCount,this, new ThreeVector(0, 20, 0)));

        //this.spawnship();
    }

    makeprojectile(){


    }

    requestspawn(playerId){
        console.log("spawn ship....")
        return this.spawnship(playerId);
    }

    spawnship(playerId){
        let pawn;
        //console.log("==================================");
        //console.log("create player object...");
        //console.log(PlayerCube);
        //console.log("count:"+ this.world.idCount);
        pawn = this.addObjectToWorld(new PlayerCube(++this.world.idCount, new ThreeVector(0, 20, 0)));
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
        //serializer.registerClass(require('../common/Paddle'));
        //serializer.registerClass(require('../common/Ball'));
        serializer.registerClass(require('../common/PlayerAvatar'));
        serializer.registerClass(require('../common/PlayerCube'));
        serializer.registerClass(require('../common/PlayerData'));
        serializer.registerClass(require('../common/PlayerController'));


        serializer.registerClass(require('../common/SphereCannon'));
        serializer.registerClass(require('../common/PlaneCannon'));
        serializer.registerClass(require('../common/BoxCannon'));
    }
}

module.exports = MyGameEngine;
