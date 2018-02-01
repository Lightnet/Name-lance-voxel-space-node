/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

const ClientEngine = require('lance-gg').ClientEngine;
const MyRenderer = require('../client/MyRenderer');
const Utils = require('./../common/Utils');
const MobileControls = require('../client/MobileControls');
const KeyboardControls = require('../client/KeyboardControls');
const PlayerCube = require('../common/PlayerCube');


class MyClientEngine extends ClientEngine {

    constructor(gameEngine, options) {
        super(gameEngine, options, MyRenderer);

        //this.serializer.registerClass(require('../common/PlayerAvatar'));
        this.gameEngine.on('client__preStep', this.preStep.bind(this));
        // keep a reference for key press state
        this.pressedKeys = {
            down: false,
            up: false,
            left: false,
            right: false,
            a: false,
            w: false,
            s: false,
            d: false,
            b: false,
            space: false
        };

        let that = this;
        document.onkeydown = (e) => { that.onKeyChange(e, true); };
        document.onkeyup = (e) => { that.onKeyChange(e, false); };
    }

    start() {
        super.start();
        // handle gui for game condition
        this.gameEngine.on('objectDestroyed', (obj) => {
            //console.log("objectDestroyed");
            if (obj.class == PlayerCube && this.isOwnedByPlayer(obj)) {
                //document.body.classList.add('lostGame');
                document.querySelector('#tryAgain').disabled = false;
                document.querySelector('#tryAgain').hidden = false;
            }
            document.querySelector('#tryAgain').disabled = false;
        });

        this.gameEngine.once('renderer.ready', () => {
            console.log("==============================");
            console.log("renderer.ready");
            setTimeout(function(){ 
                document.querySelector('#loadingscreen').hidden= true;
            }, 1000);

            document.querySelector('#tryAgain').hidden = true;
            document.querySelector('#reconnect').hidden = true;

            // click event for "try again" button
            document.querySelector('#tryAgain').addEventListener('click', () => {
                if (Utils.isTouchDevice()){
                    this.renderer.enableFullScreen();
                }
                this.socket.emit('requestRestart');
                console.log("#tryAgain");
            });

            document.querySelector('#joinGame').addEventListener('click', () => {
                if (Utils.isTouchDevice()){
                    this.renderer.enableFullScreen();
                }
                this.socket.emit('requestRestart');
                console.log("#joinGame");
            });

            document.querySelector('#reconnect').addEventListener('click', () => {
                window.location.reload();
                console.log("#reconnect");
            });
        });

        //  Game input
        if (Utils.isTouchDevice()){
            this.controls = new MobileControls(this.renderer);
        } else {
            this.controls = new KeyboardControls(this.renderer);
        }

        this.controls.on('fire', () => {
            console.log("send spacebar...");
            this.sendInput('space');
        });

        this.networkMonitor.on('RTTUpdate', (e) => {
            this.renderer.updateHUD(e);
        });
    }

    // our pre-step is to process all inputs
    preStep() {
        //need to fixed this later...

        if (this.pressedKeys.up) {
            this.sendInput('up', { movement: true });
        }

        if (this.pressedKeys.down) {
            this.sendInput('down', { movement: true });
        }

        if (this.pressedKeys.left) {
            this.sendInput('left', { movement: true });
        }

        if (this.pressedKeys.right) {
            this.sendInput('right', { movement: true });
        }

        if (this.pressedKeys.space) {
            //this.sendInput('space', { movement: true });
        }

        if (this.pressedKeys.b) {
            this.sendInput('b', { movement: true });
        }

        //console.log(this.pressedKeys);
    }

    onKeyChange(e, isDown) {
        e = e || window.event;
        //console.log(isDown);
        //console.log(e.keyCode);
        if (e.keyCode == '38') {
            this.pressedKeys.up = isDown;
        } else if (e.keyCode == '40') {
            this.pressedKeys.down = isDown;
        } else if (e.keyCode == '37') {
            this.pressedKeys.left = isDown;
        } else if (e.keyCode == '39') {
            this.pressedKeys.right = isDown;
        } else if (e.keyCode == '32') {
            this.pressedKeys.space = isDown;
        }

        if (e.keyCode == '65') {//a
            this.pressedKeys.a = isDown;
        }
        if (e.keyCode == '83') {//s
            this.pressedKeys.s = isDown;
        }
        if (e.keyCode == '68') {//d
            this.pressedKeys.d = isDown;
        }
        if (e.keyCode == '87') {//w
            this.pressedKeys.w = isDown;
        }

        if (e.keyCode == '66') {//b
            this.pressedKeys.b = isDown;
        }
        
    }

    // extend ClientEngine connect to add own events
    connect() {
        return super.connect().then(() => {
            //console.log("client engine connected...");
            document.querySelector('#reconnect').hidden = true;


            this.socket.on('updatePlayerCount', (e) => {
                //console.log('updatePlayerCount');
                //console.log(e);
                this.renderer.updatePlayerCount(e);
            });

            this.socket.on('scoreUpdate', (e) => {
                console.log('scoreUpdate');
                //this.renderer.updateScore(e);
            });
            //console.log(this.playerId);

            //console.log(this.gameEngine.world );
            //let playercontrol = this.world.getPlayerObject(playerId);
            //console.log(this.gameEngine.world.getPlayerObject(this.playerId) );

            this.socket.on('disconnect', (e) => {
                console.log('disconnected');
                //document.body.classList.add('disconnected');
                //document.body.classList.remove('gameActive');
                document.querySelector('#reconnect').disabled = false;
                document.querySelector('#reconnect').hidden = false;
                document.querySelector('#joinGame').hidden = true;
            });

            //if ('autostart' in Utils.getUrlVars()) {
                //this.socket.emit('requestRestart');
            //}

            //in presentation mode make sure to not idle
            //if ('presentation' in Utils.getUrlVars()) {
                setInterval(() =>{
                    this.socket.emit('keepAlive');
                }, 1000 * 10)
            //}
        });
    }
}

module.exports = MyClientEngine;
