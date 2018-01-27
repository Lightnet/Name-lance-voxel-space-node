/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

'use strict';
require('aframe');
require('aframe-physics-system');
require('aframe-orbit-controls-component-2');
//const Renderer = require('lance-gg').render.Renderer;
const AFrameRenderer = require('lance-gg').render.AFrameRenderer;
const PlayerController = require('../common/PlayerController');
const PlayerCube = require('../common/PlayerCube');

const debugWireframes = true;

class MyRenderer extends AFrameRenderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        console.log("[init MyRenderer]");
        //this.sprites = {};
        //var self = this;
        //console.log(gameEngine);
        //setInterval(function(){
            //self.objectlist();
            //console.log(MyRenderer);
            //console.log(self.sprites);
          //},  5000);
    }

    // setup the 3D scene
    init() {
        console.log("init scene...");
        return super.init().then(() =>{
            // show cannon objects wire frame
            if (debugWireframes) {
                console.log("Debug Cannon");
                window.CANNON = this.gameEngine.physicsEngine.CANNON;
                let head = document.getElementsByTagName('head')[0];
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = '/src/lib/CannonDebugRenderer.js';
                script.onload = () => {
                    this.cannonDebugRenderer = new THREE.CannonDebugRenderer( this.scene.object3D, this.gameEngine.physicsEngine.world );
                };
                head.appendChild(script);
            }
            //frame counter
            this.frameNum = 0;
            //assets
            document.querySelector('a-assets').addEventListener('loaded', ()=>{
                console.log('assets loaded');
                //document.body.classList.remove('loading');
                this.emit('ready');
                this.isReady = true;
            });

            this.gameEngine.emit('renderer.ready');
        });
    }

    draw() {
        super.draw();


    }

    toggle_login(){
        console.log("login...");
    }

    addObject(objData, options) {
        super.addObject(objData);

        //check for player controller class
        if(objData.class == PlayerController){
            //check for client own object 
            if (this.clientEngine.isOwnedByPlayer(objData)) {
                this.playercontroller = objData;  //// save reference to the player obj to client
                console.log("player controller assign client");
            }
        }
        //PlayerCube
        if (objData.class == PlayerCube) {
            if (this.clientEngine.isOwnedByPlayer(objData)) {
                console.log("client player cube");
                //hide the hud
                document.querySelector('#guiContainer').hidden = true;
                this.playership = objData;
                console.log(this);
                //document.querySelector('#guiContainer');
            }
        }
    }
}

module.exports = MyRenderer;
