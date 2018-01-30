/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';

const ThreeVector = require('lance-gg').serialize.ThreeVector;
const DynamicObject = require('lance-gg').serialize.DynamicObject;
const PlayerCube = require('./PlayerCube');

class PlayerController extends DynamicObject {

    constructor(id, playerId) {
        super(id);
        this.class = PlayerController;
        //this.gameEngine = gameEngine;
        this.playerId = playerId; //number id 
        this.clientId = ""; // socket client id
        this.teamid = 0;//0 = free for all
        this.pawn = null; //object control
        this.state="spector";
        this.yawrotation = 0;
        this.bpress = false;
        this.bspawn = false; //check create object player ship
        this.movespeed = 0.1;
    };

    onAddToWorld(gameEngine) {
        this.gameEngine = gameEngine;
        //console.log("====================================");
        //console.log("add to world scene PlayerController.");
        //console.log(this);
    }

    processInput(inputData){
        //console.log(inputData);
        if ((inputData.input === 'up') && (inputData.options.movement == true)) {
            
        } else if ((inputData.input === 'down') && (inputData.options.movement == true)) {
            
        } else if ((inputData.input === 'left') && (inputData.options.movement == true)) {
            
        } else if ((inputData.input === 'right') && (inputData.options.movement == true)) {
            
        }
        if( (inputData.input === 'space')) {

        }
    }

    checkpawn(){
        if(this.bspawn == false){
            for (let objId in this.gameEngine.world.objects) {
                var o = this.gameEngine.world.objects[objId];
                if (o.playerId == this.playerId && o.class == PlayerCube) {
                    console.log("PlayerCube found! Assign");
                    this.pawn = this.gameEngine.world.objects[objId];
                    //this.pawn.foucscamera();
                    this.bspawn = true;
                    break;
                }
            }
        }
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
        return `PlayerController::${super.toString()}`;
    }

    test(){
        
    }

    destroy(){
        super.destroy();
        console.log("player controller destroy!");
    }
}

module.exports = PlayerController;
