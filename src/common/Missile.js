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
const MASS = 1;
let CANNON = null;

class Missile extends PhysicalObject {

    constructor(id, position) {
        super(id, position);
        this.class = Missile;
    };

    onAddToWorld(gameEngine) {
        //console.log("add to world scene BoxCannon.");
        // create the physics body
        console.log("Missile ID:"+this.id);
        this.gameEngine = gameEngine;
        this.physicsObj = gameEngine.physicsEngine.addBox(1, 1, 1, MASS, 0);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.0;

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
            el.setAttribute('geometry', `primitive: box; width: 1; height: 1; depth: 1;`);
            el.setAttribute('game-object-id', this.id);
            //this.setupEmitters();
            //console.log("a-entity box");
            this.el = el;
        }
    }

    toString() {
        return `Missile::${super.toString()}`;
    }

    destroy() {
        console.log("destroy physicsObj");
        if(this.physicsObj !=null){
            this.gameEngine.physicsEngine.removeObject(this.physicsObj);
        }

        if((this.scene !=null)&&(this.el)){
            //this.scene.appendChild(this.el);
            //console.log(this.scene);
            let entity = this.el;
            entity.parentNode.removeChild(entity);
        }

    }

}

module.exports = Missile;
