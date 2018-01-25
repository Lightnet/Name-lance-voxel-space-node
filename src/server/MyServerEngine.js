/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

//console.log("server");

'use strict';

const ServerEngine = require('lance-gg').ServerEngine;

const PlayerController = require('../common/PlayerController');

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        //this.serializer.registerClass(require('../common/PlayerAvatar'));
    }

    start() {
        super.start();

        this.gameEngine.initGame();

        this.players = {
            player1: null,
            player2: null
        };
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        //console.log(PlayerController);
        //console.log(this.gameEngine);
        //this.gameEngine.addObjectToWorld(new PlayerController(++this.gameEngine.world.idCount,this.gameEngine ,socket.playerId));
        this.gameEngine.addObjectToWorld(new PlayerController(++this.gameEngine.world.idCount, socket.playerId));
        //console.log(this.gameEngine.world.idCount);
        //console.log("socket.id:");
        //console.log(socket.id);
        //console.log("socket.playerId:");
        //console.log(socket.playerId);
        /*
        // attach newly connected player an available paddle
        if (this.players.player1 === null) {
            this.players.player1 = socket.id;
            this.gameEngine.playeravatar.playerId = socket.playerId;
            //this.gameEngine.paddle1.playerId = socket.playerId;
        } else if (this.players.player2 === null) {
            this.players.player2 = socket.id;
            //this.gameEngine.paddle2.playerId = socket.playerId;
        }
        */
        //console.log(socket);
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
}

module.exports = MyServerEngine;
