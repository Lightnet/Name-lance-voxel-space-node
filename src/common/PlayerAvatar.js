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

    constructor(id, gameEngine, position) {
        super(id, position);
        this.class = PlayerAvatar;
    };

    /*
    constructor(id, position, velocity) {
        super(id, position, velocity);
        this.class = PlayerAvatar;
    };
    */
}

module.exports = PlayerAvatar;
