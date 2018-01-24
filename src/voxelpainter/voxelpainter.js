/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/


require('aframe');
require('aframe-physics-system');
require('aframe-extras');
console.log("voxel painter");

var bind = AFRAME.utils.bind;
var shouldCaptureKeyEvent = AFRAME.utils.shouldCaptureKeyEvent;

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

var KEYS = [
  'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyB',
  'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'
];

function isEmptyObject (keys) {
  var key;
  for (key in keys) { return false; }
  return true;
}

var bcreateblock = true;


AFRAME.registerComponent('shortcut-build', {
  schema: {
    textbuild:{
      type:'string'
    }
  },
  init: function () {
    this.keys = {};
    this.onKeyDown = bind(this.onKeyDown, this);
    this.onKeyUp = bind(this.onKeyUp, this);
    this.bbuild = true;
    this.boldbuild = true;
    this.bpress = false;
  },
  remove: function () {
    this.removeKeyEventListeners();
    //this.removeVisibilityEventListeners();
  },
  play: function () {
    this.attachKeyEventListeners();
  },
  pause: function () {
    this.keys = {};
    this.removeKeyEventListeners();
  },
  attachKeyEventListeners: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },
  removeKeyEventListeners: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },
  onKeyDown: function (event) {
    var code;
    if (!shouldCaptureKeyEvent(event)) { return; }
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    if (KEYS.indexOf(code) !== -1) { 
      this.keys[code] = true; 
      console.log(this.keys);
      //console.log(this.keys[code]);
    }
  },
  onKeyUp: function (event) {
    var code;
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    //console.log(code);

    delete this.keys[code];
  },
  tick: function (time, delta) {
    var keys = this.keys;
    if (keys.KeyB){
      //console.log("A press");
      this.bpress = true;
    }else{
      this.bpress = false;
    }

    if(this.bpress){
      if(this.bbuild == false){
        this.togglebuild();
      }
      this.bbuild = true;
    }else{
      this.bbuild = false;
    }
  },
  togglebuild(){
    //console.log("toggle?");
    let text = "Build Mode: Create";
    if(bcreateblock){
      bcreateblock = false;
      text = "Build Mode: Destory";
    }else{
      bcreateblock = true;
    }
    var textEl = document.querySelector('a-text');
    textEl.setAttribute('value',text);
    //console.log(textEl);
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
      //console.log(evt.detail.intersection);
      //console.log("normal:");
      //console.log(evt.detail.intersection.face.normal);
      //console.log("pos:");
      //console.log(currentpos);
      //pos.z = currentpos.z + 1;
      if(bcreateblock){
        createbox(pos);
      }else{
        console.log("delete object");
        //console.log(this.object3D);
        //var entity = this.el;
        //entity.parentNode.removeChild(entity);
        var sceneEl = document.querySelector('a-scene');
        sceneEl.removeChild(this);
      }
      //console.log(this.object3D.position);
      //console.log(evt);
    });
  }
});