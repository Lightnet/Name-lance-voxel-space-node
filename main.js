/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

    This main file for game client/server and host express and socket.io handler.

*/


'use strict';

//main point entry

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, './index.html');

// define routes and socket
const server = express();
server.get('/', function(req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '.')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
const io = socketIO(requestHandler);

// Game Server
const MyServerEngine = require(path.join(__dirname, 'src/server/MyServerEngine.js'));
const MyGameEngine = require(path.join(__dirname, 'src/common/MyGameEngine.js'));
//const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;
const CannonPhysicsEngine = require('lance-gg').physics.CannonPhysicsEngine;

// Game Instances
//const physicsEngine = new SimplePhysicsEngine();
const physicsEngine = new CannonPhysicsEngine();
//const gameEngine = new MyGameEngine({ physicsEngine, traceLevel: 1 });
const gameEngine = new MyGameEngine({ physicsEngine, traceLevel: 1000 });
//const gameEngine = new MyGameEngine({ physicsEngine });

const serverEngine = new MyServerEngine(io, gameEngine, { debug: {}, updateRate: 6,tracesPath: './logs' });
//const serverEngine = new MyServerEngine(io, gameEngine, { updateRate: 6 });

// start the game
serverEngine.start();
