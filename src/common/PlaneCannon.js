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

const _width = 10;
const _height = 10;
const _depth = 10;
const MASS = 0;
let CANNON = null;

//class PlayerAvatar extends DynamicObject {
class PlaneCannon extends PhysicalObject {

    constructor(id,gameEngine, position) {
        super(id, position);
        this.class = PlaneCannon;
        this.gameEngine = gameEngine;
    };

    onAddToWorld(gameEngine) {
        console.log("add to world scene PlaneCannon.");

        // create the physics body
        this.gameEngine = gameEngine;
        
        // create the physics body
        this.gameEngine = gameEngine;
        //CANNON = this.gameEngine.physicsEngine.CANNON;
        //this.physicsObj = gameEngine.physicsEngine.addSphere(RADIUS, MASS);
        this.physicsObj = gameEngine.physicsEngine.addBox(_width/2,_height/2,_depth/2,MASS,0);

        //console.log(gameEngine.physicsEngine);

        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.0;

        //this.physicsObj

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
            console.log("a-entity ball");
        }
    }

    toString() {
        return `PlaneCannon::${super.toString()}`;
    }

}

module.exports = PlaneCannon;
