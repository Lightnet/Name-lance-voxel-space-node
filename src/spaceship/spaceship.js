/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

require('aframe');
require('aframe-physics-system');
console.log("test");

//console.log(this);

//console.log(AFRAME);


var self = this;

AFRAME.registerComponent('scene-check', {
    init: function () {
      var sceneEl = this.el;
      console.log(this);
    }
  });

window.addEventListener("load", function(){
    console.log("window loaded!");
    console.log(global);

    console.log(document.querySelector('a-scene').systems['physics']);

    //console.log(window);
    //console.log(document.querySelector('a-scene').components['physics']);

    //var scene = document.querySelector('a-scene');
    //scene.addEventListener('loaded', function() {
        //console.log("scene loaded!");
    //});



    //var sceneEl = document.querySelector('a-scene');
    //console.log(sceneEl);
    //var physicsEl = document.querySelector('a-scene').components['physics'];
    //var physicsEl = document.querySelector('a-scene').components;
    //console.log(physicsEl);
});

