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

const AFrameRenderer = require('lance-gg').render.AFrameRenderer;
const PlayerController = require('../common/PlayerController');
const PlayerCube = require('../common/PlayerCube');

const debugWireframes = true;

class MyRenderer extends AFrameRenderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        //console.log("[init MyRenderer]");
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
        //console.log("init scene...");
        return super.init().then(() =>{
            // show cannon objects wire frame
            if (debugWireframes) {
                //console.log("Debug Cannon");
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

            document.querySelector('#tryAgain').hidden = true;
            document.querySelector('#reconnect').hidden = true;
            document.querySelector('#joinGame').hidden = true;

            //assets
            document.querySelector('a-assets').addEventListener('loaded', ()=>{
                //console.log('assets loaded');
                //document.body.classList.remove('loading');
                //this.emit('ready');
                this.gameEngine.emit('renderer.ready');
                this.isReady = true;
            });

            //this.gameEngine.emit('renderer.ready');
        });
    }

    draw() {
        super.draw();
        //Aframe draw
        //for(let objId of Object.keys(this.gameEngine.world.objects)){
            //let o = this.gameEngine.world.objects[objId];
            //if(o.class == PlayerCube){
                //o.updateHealthText();
            //}
        //}
        //console.log(this.gameEngine.world);
    }

    toggle_login(){
        //console.log("login...");
    }

    addObject(objData, options) {
        super.addObject(objData);

        //check for player controller class
        if(objData.class == PlayerController){
            //check for client own object 
            if (this.clientEngine.isOwnedByPlayer(objData)) {
                this.playercontroller = objData;  //// save reference to the player obj to client
                //console.log("player controller assign client");
            }
        }
        //PlayerCube
        if (objData.class == PlayerCube) {
            if (this.clientEngine.isOwnedByPlayer(objData)) {
                console.log("client player cube");
                //hide the hud
                //document.querySelector('#joinGame').hidden = true;
                document.querySelector('#tryAgain').hidden = true;
                document.querySelector('#reconnect').hidden = true;

                this.playership = objData;
                //console.log(this);
                //document.querySelector('#guiContainer');
            }
        }
    }

    updateHUD(data){
        if (data.RTT){ qs('.latencyData').innerHTML = data.RTT;}
        if (data.RTTAverage){ qs('.averageLatencyData').innerHTML = truncateDecimals(data.RTTAverage, 2);}
    }

    updatePlayerCount(data){
        if (data){ qs('.playerCountData').innerHTML = data;}
    }

    onKeyChange(e){
        //if (this.playerShip) {
            //if (e.keyName === 'up') {
                //this.playerShip.actor.thrustEmitter.emit = e.isDown;
            //}
        //}
    }
}

// convenience function
function qs(selector) { return document.querySelector(selector);}
// average time
function truncateDecimals(number, digits) {
    let multiplier = Math.pow(10, digits);
    let adjustedNum = number * multiplier;
    let truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

module.exports = MyRenderer;
