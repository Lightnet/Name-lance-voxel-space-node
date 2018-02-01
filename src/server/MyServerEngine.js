/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';
const ServerEngine = require('lance-gg').ServerEngine;
const ThreeVector = require('lance-gg').serialize.ThreeVector;

const PlayerController = require('../common/PlayerController');
const PlayerCube = require('../common/PlayerCube');
//const Missile = require('../common/Missile');
//const CubeProjectile = require('../common/CubeProjectile');

const NUM_BOTS = 3;

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        //this.serializer.registerClass(require('../common/PlayerAvatar'));

        this.scoreData = {};
        this.playercontrollers = {};
        this.currentNumberPlayers = 0;
    }

    start() {
        super.start();
        this.gameEngine.initGame();
        //for (let x = 0; x < NUM_BOTS; x++) this.makeBot();

        // fire event > projectile
        this.gameEngine.on('fire',(data)=>{
            //console.log("serverengine > event > fire!");
            //this.makeMissile(data);
            //this.gameEngine.makeMissile(data);
            this.gameEngine.makeprojectile(data);
        });

        // create sound?
        this.gameEngine.on('missileHit', (e) => {
            //this.gameEngine.removeObjectFromWorld(e.ship.id);
            //console.log("event > missilehit");
        });
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let controller = new PlayerController(++this.gameEngine.world.idCount, socket.playerId);
        this.gameEngine.addObjectToWorld(controller);

        this.playercontrollers[controller.id] = controller;

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
            this.updateScore();
        };
        // handle client restart requests
        socket.on('requestRestart', makePlayerShip);

        this.updatePlayerCount();
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        for (var key in this.gameEngine.world.objects){
            //console.log(key);
            //console.log(this.gameEngine.world.objects[key]);
            //check for player id for delete in objects list
            if((this.gameEngine.world.objects[key].playerId !=null)&&(this.gameEngine.world.objects[key].playerId == playerId)){
                delete this.playercontrollers[key];

                this.gameEngine.world.objects[key].destroy();
                delete this.gameEngine.world.objects[key];
                break;
            }
        }
        
        this.updatePlayerCount();
    }

    makeBot() {
        let bot = this.gameEngine.makeShip(0);
        bot.attachAI();

        //this.scoreData[bot.id] = {
            //kills: 0,
            //name: nameGenerator('general') + 'Bot'
        //};

        //this.updateScore();
    }

    updatePlayerCount(){
        console.log("playercontrollers:"+ Object.keys(this.playercontrollers).length);
        this.currentNumberPlayers = Object.keys(this.playercontrollers).length;
        // delay so player socket can catch up
        setTimeout(() => {
            this.io.sockets.emit('updatePlayerCount', this.currentNumberPlayers);
        }, 1000);
    }

    updateScore() {
        // delay so player socket can catch up
        setTimeout(() => {
            //this.io.sockets.emit('scoreUpdate', this.scoreData);
        }, 1000);

    }
}

module.exports = MyServerEngine;
