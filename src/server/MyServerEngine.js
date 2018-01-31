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

class MyServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        //this.serializer.registerClass(require('../common/PlayerAvatar'));
    }

    start() {
        super.start();

        this.gameEngine.initGame();
        this.playercontrollers = {};

        this.gameEngine.on('fire',(data)=>{
            console.log("serverengine > event > fire!");
            //this.makeMissile(data);
            //this.gameEngine.makeMissile(data);
            this.gameEngine.makeprojectile(data);
        });

        this.gameEngine.on('missileHit', (e) => {
            //this.gameEngine.removeObjectFromWorld(e.ship.id);
            console.log("event > missilehit");
        });
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let controller = new PlayerController(++this.gameEngine.world.idCount, socket.playerId);
        this.gameEngine.addObjectToWorld(controller);
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

    //call gameengine to make object
    //makeMissile(data) {
        //this.gameEngine.makeMissile(data);
    //}
}

module.exports = MyServerEngine;
