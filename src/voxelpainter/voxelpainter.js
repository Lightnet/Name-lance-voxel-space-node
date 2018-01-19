/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/


require('aframe');
require('aframe-physics-system');
console.log("voxel painter");

//var pos =  new THREE.Vector3();
//console.log(pos);


AFRAME.registerComponent('camerapaint', {
  init: function () {},
  update: function (oldData) {},
  tick: function () {}
});

AFRAME.registerComponent('collider-check', {
  dependencies: ['raycaster'],
  init: function () {
    this.el.addEventListener('raycaster-intersected', function (evt) {
      //console.log('Player hit something!');
      //console.log(obj);
      //console.log(evt.detail);
      //evt.detail.el.setAttribute('material', 'opacity', '0.5');
    });
  }
});

// Component to change to a sequential color on click.
AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});


// Component to change to a sequential color on click.
/*
AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      //console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});
*/

//https://github.com/aframevr/aframe/blob/master/examples/test/raycaster/simple.html

/* //works
AFRAME.registerComponent('raycast-blab', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', function (evt) {
      var el = evt.detail.target;
// May get two intersection events per tick; same element, different faces.
      console.log('raycaster-intersected ' + el.outerHTML);
      el.setAttribute('material', 'color', '#7f7');
    });
    this.el.addEventListener('raycaster-intersected-cleared', function (evt) {
      var el = evt.detail.target;
// May get two intersection events per tick; same element, different faces.
      console.log('raycaster-intersected-cleared ' + el.outerHTML);
      el.setAttribute('material', 'color', '#f77');
    });
  }
});
*/

/*
AFRAME.registerComponent('collider-check', {
  dependencies: ['raycaster'],

  init: function () {
    console.log("ray init");
    this.el.addEventListener('raycaster-intersected', function () {
      console.log('Player hit something!');
    });
  }
});
*/