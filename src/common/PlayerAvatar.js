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

//class PlayerAvatar extends DynamicObject {
class PlayerAvatar extends PhysicalObject {

    //static get netScheme() {
        //return Object.assign({}, super.netScheme);
    //}

    constructor(id, gameEngine, position, playerId) {
        super(id, position);
        this.class = PlayerAvatar;
        this.playerId = playerId;

        //console.log("this.playerId");
        //console.log(this.playerId);
        this.gameEngine = gameEngine;
    };

    onAddToWorld(gameEngine) {
        console.log("add to world scene PlayerAvatar.");

        // create the physics body
        this.gameEngine = gameEngine;
        
        // create the physics body
        this.gameEngine = gameEngine;
        //CANNON = this.gameEngine.physicsEngine.CANNON;
        this.physicsObj = gameEngine.physicsEngine.addSphere(4, 0);
        this.physicsObj.position.set(this.position.x, this.position.y, this.position.z);
        this.physicsObj.angularDamping = 0.1;

        this.scene = gameEngine.renderer ? gameEngine.renderer.scene : null;

        if (this.scene) {
            let el = this.renderEl = document.createElement('a-entity');
            this.scene.appendChild(el);
            let p = this.position;
            let q = this.quaternion;
            el.setAttribute('position', `${p.x} ${p.y} ${p.z}`);
            //el.setAttribute('material', 'src: #ball');
            el.setAttribute('geometry', `primitive: sphere; radius: ${4}; segmentsWidth: 32; segmentsHeight: 16`);
            el.setAttribute('game-object-id', this.id);
            //this.setupEmitters();
            console.log("a-entity ball");
        }
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

module.exports = PlayerAvatar;
