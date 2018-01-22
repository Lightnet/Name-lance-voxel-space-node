/*
    Project Name: lance-voxel-space-node
    License: CC0
    Multiples Licenses check the README.md file.

    Created by: Lightnet

    Information: Multiplayer Node Server Prototype Spaceship Game

*/

require('aframe');
require('aframe-physics-system');

var mouse = new THREE.Vector2();

console.log("test");
AFRAME.registerComponent('rayplane', {
    init: function () {
      var sceneEl = this.el;
      //console.log(this);


      var point = document.querySelector('#point').object3D;
      var objplane = document.querySelector('#plane').object3D.children[0];
      console.log(objplane)
      //window.addEventListener( 'mousemove', onMouseMove, false );

      

      var raycaster = new THREE.Raycaster();

        //console.log(this.el);

        var camera = this.el.object3D.children[2];
        //var camera = document.querySelector('#camera');

        //console.log(camera);
        //var plane =  new THREE.Plane()

        //var vector = new THREE.Vector3();

        window.addEventListener( 'mousemove',function ( event ) {

          let vector = new THREE.Vector3(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 ).unproject( camera );


            //vector.unproject( camera );

            //console.log(vector.unproject);
            var dir = vector.sub( camera.position ).normalize();

            //console.log(dir);
            var distance = - camera.position.z / dir.z;
            console.log(distance);
            let pos = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z).add( dir.multiplyScalar( distance ) );
            //let pos = new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z).add( dir.multiplyScalar( 10 ) );
            console.log(pos);
            if(pos !=null){
                point.position.x = pos.x;
                point.position.y = pos.y;
                point.position.z = pos.z;
            }




        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
    
            //mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            //mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            //console.log("x:"+ mouse.x +"y:" +mouse.y);

            //raycaster.setFromCamera( mouse, camera);
            // Get 3D vector from 3D mouse position using 'unproject' function
            //var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
            // Set the raycaster position
            //raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

            //vector.unproject(camera);
            //var intersectsobjmovers = raycaster.intersectObject(objplane);

            //console.log(intersectsobjmovers[0]);
            //if(intersectsobjmovers[0] !=null){
                //point.position.x = intersectsobjmovers[0].point.x;
                //point.position.y = intersectsobjmovers[0].point.y;
                //point.position.z = intersectsobjmovers[0].point.z;
            //}
            //point.position.x = mouse.x;
            //point.position.y = mouse.y;
            //position

            //console.log(point);
    
        });

    },
    tick: function (time, delta) {

    }
});
/*
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
  */