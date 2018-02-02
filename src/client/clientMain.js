/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

const qsOptions = require('query-string').parse(location.search);
const MyClientEngine = require('../client/MyClientEngine');
const MyGameEngine = require('../common/MyGameEngine');
const CannonPhysicsEngine = require('lance-gg').physics.CannonPhysicsEngine;
//require('../../assets/sass/main.scss');
//===============================================
// Load libs
//===============================================
require('./aframecamera3rd');
require('./aframecameraface');

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: 1000,//1 = debug, 1000= no debug
    delayInputCount: 3,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.0,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

// extrapolate mode requires a physics engine on the client
if (options.syncOptions.sync === 'extrapolate')
    options.physicsEngine = new CannonPhysicsEngine();

// create a client engine and a game engine
const gameEngine = new MyGameEngine(options);
const clientEngine = new MyClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });