/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';

//const DynamicObject= require('lance-gg').serialize.DynamicObject;
//const PhysicalObject = require('lance-gg').serialize.PhysicalObject;
//const GameObject = require('lance-gg').serialize.ThreeVector;

const GameObject = require('lance-gg').serialize.DynamicObject;

//console.log(GameObject);

//class PlayerAvatar extends DynamicObject {
class PlayerController extends GameObject {

    constructor(id, playerId) {
        super(id);
        this.class = PlayerController;
        //this.gameEngine = gameEngine;
        this.playerId = playerId; //number id 
        this.clientId = ""; // socket client id
        this.teamid = 0;//0 = free for all
        this.pawn = null; //object control
        
    };

    onAddToWorld(gameEngine) {
        console.log("====================================");
        console.log("add to world scene PlayerController.");
        console.log(this);
    }

    toString() {
        return `PlayerController::${super.toString()}`;
    }

    test(){
        //console.log("test log player");

        this.scene = this.gameEngine.renderer ? this.gameEngine.renderer.scene : null;
        if (this.scene) {
            //console.log(this.gameEngine);
            //console.log(this.gameEngine.world.objects[2]);
            let sphereobject = this.gameEngine.world.objects[2];
            if(sphereobject !=null){
                sphereobject.reset();
            }
            //console.log(this.scene);
            //console.log(this.world);
            //let sphereobject = this.gameEngine.world.getPlayerObject(2);
            //console.log(sphereobject);
            //
        }
    }

}

module.exports = PlayerController;
