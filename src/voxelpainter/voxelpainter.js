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
var id = 0;
function createbox(pos){
  var sceneEl = document.querySelector('a-scene');
  var entityEl = document.createElement('a-entity');  
  entityEl.setAttribute('geometry', "primitive: box;");
  //entityEl.setAttribute('geometry', "primitive: box; width: 1");
  //entityEl.setAttribute('position', "-1 10 -3");
  //entityEl.setAttribute('position', "-1 10 -2");
  entityEl.setAttribute('position',{x:pos.x,y:pos.y,z:pos.z});
  entityEl.setAttribute('material', "color: yellow");
  entityEl.setAttribute('id', id);
  id = id + 1;
  //entityEl.setAttribute('cursor-listener','');
  entityEl.setAttribute('cursor-listener','');
  //entityEl.setAttribute('dynamic-body', '');
  sceneEl.appendChild(entityEl);
}



// Component to change to a sequential color on click.
AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var lastIndex = -1;
    var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      lastIndex = (lastIndex + 1) % COLORS.length;
      this.setAttribute('material', 'color', COLORS[lastIndex]);
      //console.log('I was clicked at: ', evt.detail.intersection.point);


      //console.log(this);
      //console.log(evt.detail.intersection);
      //console.log(evt.detail.intersection.face.normal);
      var pos =  new THREE.Vector3();
      var currentpos = evt.detail.intersection.object.position;

      currentpos = this.object3D.position;

      if(evt.detail.intersection.face.normal.x != 0){
        pos.x = currentpos.x + (1 * evt.detail.intersection.face.normal.x)
      }else{
        pos.x = currentpos.x;
      }

      if(evt.detail.intersection.face.normal.y != 0){
        pos.y = currentpos.y + (1 * evt.detail.intersection.face.normal.y)
      }else{
        pos.y = currentpos.y;
      }

      if(evt.detail.intersection.face.normal.z != 0){
        pos.z = currentpos.z + (1 * evt.detail.intersection.face.normal.z)
      }else{
        pos.z = currentpos.z;
      }

      //console.log(this.object3D);
      console.log(evt.detail.intersection);
      console.log("normal:");
      console.log(evt.detail.intersection.face.normal);
      console.log("pos:");
      console.log(currentpos);
      //pos.z = currentpos.z + 1;
      createbox(pos);
      //console.log(this.object3D.position);

      console.log(evt);

    });
  }
});