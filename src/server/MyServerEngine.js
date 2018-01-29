/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';
const ServerEngine = require('lance-gg').ServerEngine;

const PlayerController = require('../common/PlayerController');
const PlayerCube = require('../common/PlayerCube');
const ThreeVector = require('lance-gg').serialize.ThreeVector;

const Missile = require('../common/Missile');

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        //this.serializer.registerClass(require('../common/PlayerAvatar'));
    }

    start() {
        super.start();

        this.gameEngine.initGame();
        this.playercontrollers = {};
        //this.players = {
            //player1: null,
            //player2: null
        //};

        this.gameEngine.on('fire',function(data){
            console.log("data");
            console.log(data);
            this.makeMissile(data);
        });
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        //console.log(PlayerController);
        //console.log(this.gameEngine);
        //this.gameEngine.addObjectToWorld(new PlayerController(++this.gameEngine.world.idCount,this.gameEngine ,socket.playerId));
        let controller = new PlayerController(++this.gameEngine.world.idCount, socket.playerId);
        this.gameEngine.addObjectToWorld(controller);
        //let pawn = new PlayerCube(++this.gameEngine.world.idCount,this.gameEngine, new ThreeVector(0, 0, 0));
        //controller.pawn = pawn;
        //this.gameEngine.addObjectToWorld(pawn);

        socket.on('keepAlive', ()=>{
            this.resetIdleTimeout(socket);
            //console.log("keepAlive");
        });

        let makePlayerShip = () => {
            console.log("requestRestart > makePlayerShip");
            let ship = this.gameEngine.makeShip(socket.playerId);
            //this.scoreData[ship.id] = {
                //kills: 0,
                //name: nameGenerator('general')
            //};
            //this.updateScore();
        };
        // handle client restart requests
        socket.on('requestRestart', makePlayerShip);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        /*
        if (this.players.player1 == socketId) {
            console.log('Player 1 disconnected');
            this.players.player1 = null;
        } else if (this.players.player2 == socketId) {
            console.log('Player 2 disconnected');
            this.players.player2 = null;
        }
        */
        //delete this.gameEngine.world.objects[playerId];
        //console.log("=================================:");
        //console.log(playerId);
        //console.log("objects count:");
        //console.log(this.gameEngine.world.objects);
        for (var key in this.gameEngine.world.objects){
            //console.log(key);
            //console.log(this.gameEngine.world.objects[key]);
            //check for player id for delete in objects list
            if((this.gameEngine.world.objects[key].playerId !=null)&&(this.gameEngine.world.objects[key].playerId == playerId)){
                this.gameEngine.world.objects[key].destroy();
                delete this.gameEngine.world.objects[key];
                break;
            }
        }
    }

    makeMissile(data) {
        //let missile = new Missile(++this.gameEngine.world.idCount);
        //this.gameEngine.addObjectToWorld(missile);

        this.gameEngine.makeMissile();


    }
}

module.exports = MyServerEngine;
