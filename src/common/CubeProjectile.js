/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';

const Serializer = require('lance-gg').serialize.Serializer;
const PhysicalObject = require('lance-gg').serialize.PhysicalObject;
const PlayerCube = require('./PlayerCube');
const MASS = 0.1;
let CANNON = null;

class CubeProjectile extends PhysicalObject {

    static get netScheme() {
        return Object.assign({
            ownerId: { type: Serializer.TYPES.INT32 }
        }, super.netScheme);
    }

    syncTo(other) {
        super.syncTo(other);
        this.ownerId = other.ownerId;
    }

    constructor(id, position) {
        super(id, position);
        this.class = CubeProjectile;
        this.bdestroy = false;
        this.ownerId = null;
        this.damage = 1;
    };

    onAddToWorld(gameEngine) {
        //console.log("Created CubeProjectile.");
        // create the physics body
        console.log("CubeProjectile ID:"+this.id);
        this.gameEngine = gameEngine;
        this.physicsObj = gameEngine.physicsEngine.addBox(1, 1, 1, MASS, 0);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.0;
        this.physicsObj.playerId = 1;
        this.physicsObj.ownerId = this.ownerId;
        var self = this;

        this.physicsObj.addEventListener("collide", (e)=>{ 
            //console.log("//========================");
            //console.log("collided");
            //console.log("//========================");
            if(!this.bdestroy){
                this.bdestroy = true;
                //console.log("trigger destroy?");
                //console.log(e);
                //console.log(e.target);
                //console.log("===========================================!");
                //console.log("Cubeprojectile >  bdestroy!");
                //console.log("[ownerId]"+this.ownerId + "  [Target]" + e.target.ownerId + " [body]" + e.body.ownerId);
                if(e.body.ownerId != this.ownerId ){
                    //console.log("Cubeproejctile >  emit > ondamage!");
                    this.gameEngine.emit('ondamage',{ownerId:this.ownerId, targetId:e.body.ownerId, damage:this.damage});
                }
                this.gameEngine.projectiles.push(this.id);
                //self.gameEngine.removeObjectFromWorld(this); //doesn't work here
                //self.gameEngine.removeObjectFromWorld(this.id); //doesn't work here
            }
        });

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;
        //this.physicsObj.addEventListener("collide", function(e){ console.log("sphere collided"); } );

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
        return `CubeProjectile::${super.toString()}`;
    }

    destroy() {
        super.destroy();
        //console.log("destroy physicsObj");
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
module.exports = CubeProjectile;
