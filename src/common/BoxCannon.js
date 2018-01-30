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
const RADIUS = 4;

const _width = 1;
const _height = 1;
const _depth = 1;
const MASS = 0;
let CANNON = null;

//class PlayerAvatar extends DynamicObject {
class BoxCannon extends PhysicalObject {

    constructor(id,gameEngine, position) {
        super(id, position);
        this.class = BoxCannon;
        this.gameEngine = gameEngine;
    };

    onAddToWorld(gameEngine) {
        //console.log("add to world scene BoxCannon.");

        // create the physics body
        this.gameEngine = gameEngine;
        //CANNON = this.gameEngine.physicsEngine.CANNON;
        //console.log(gameEngine.physicsEngine);
        this.physicsObj = gameEngine.physicsEngine.addBox(_width/2,_height/2,_depth/2,MASS,0);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.0;
        this.physicsObj.playerId = 0;
        this.physicsObj.objectid = this.id;


        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;

        if (this.scene) {
            let el = this.renderEl = document.createElement('a-entity');

            //el.addEventListener('physicscollided', function (event) { //nothing
                //console.log('Entity collided with', event.detail.collidingEntity);
              //});
            this.scene.appendChild(el);
            let p = this.position;
            let q = this.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            el.setAttribute('geometry', `primitive: box; width: ${_width}; height: ${_height}; depth: ${_depth}; segmentsWidth: 32; segmentsHeight: 16`);
            el.setAttribute('game-object-id', this.id);
            //this.setupEmitters();
            //console.log("a-entity box");
        }
    }

    toString() {
        return `BoxCannon::${super.toString()}`;
    }

}

module.exports = BoxCannon;
