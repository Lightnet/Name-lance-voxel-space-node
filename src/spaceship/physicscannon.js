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


  function createTetra(){
    var verts = [new CANNON.Vec3(0,0,0),
                 new CANNON.Vec3(2,0,0),
                 new CANNON.Vec3(0,2,0),
                 new CANNON.Vec3(0,0,2)];
    var offset = -0.35;
    for(var i=0; i<verts.length; i++){
        var v = verts[i];
        v.x += offset;
        v.y += offset;
        v.z += offset;
    }
    return new CANNON.ConvexPolyhedron(verts,
                                        [
                                            [0,3,2], // -x
                                            [0,1,3], // -y
                                            [0,2,1], // -z
                                            [1,2,3], // +xyz
                                        ]);
}

window.addEventListener("load", function(){
    var mass = 10;


    console.log("window loaded!");
    console.log(global);

    console.log(document.querySelector('a-scene').systems['physics']);

    //console.log(window);
    //console.log(document.querySelector('a-scene').components['physics']);

    var sceneEl = document.querySelector('a-scene');
    //scene.addEventListener('loaded', function() {
        //console.log("scene loaded!");
    //});

    var wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe:true } );

    function shape2mesh(body){

        var shape = body.shapes[0];
        var mesh;


        var geo = new THREE.Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
            var v = shape.vertices[i];
            geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for(var i=0; i < shape.faces.length; i++){
            var face = shape.faces[i];

            // add triangles
            var a = face[0];
            for (var j = 1; j < face.length - 1; j++) {
                var b = face[j];
                var c = face[j + 1];
                geo.faces.push(new THREE.Face3(a, b, c));
            }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();
        //mesh = new THREE.Mesh( geo, wireframeMaterial);

        //return mesh;

        return geo;
    }


    //<a-box position="-1 4 -3" rotation="0 45 0" color="#4CC3D9" dynamic-body></a-box>
    var entityEl = document.createElement('a-entity');
    
    //var entityEl = document.createElement('a-box');
      
      entityEl.setAttribute('geometry', "primitive: box; width: 0.5");
      //entityEl.setAttribute('position', "-1 10 -3");
      //entityEl.setAttribute('position', "-1 10 -2");
      entityEl.setAttribute('material', "color: yellow");
      entityEl.setAttribute('dynamic-body', '');

      entityEl.setAttribute('id', 'block');

      entityEl.setAttribute('do-something-once-loaded', '');

      AFRAME.registerComponent('do-something-once-loaded', {
        init: function () {
          // This will be called after the entity has properly attached and loaded.
          //console.log('I am ready!');
          //console.log(this);
          //console.log(this.object3D);//does not work
          //console.log(this.components['dynamic-body'].body);
          



          var mesh = this.el.getOrCreateObject3D('mesh', THREE.Mesh);//works
          console.log(mesh);


          this.el.body.shapes = [];
          var tetraShape = createTetra();
          this.el.body.addShape(tetraShape);
            var self = this;
          setInterval(function(){
            //console.log(self.el.body.position);
        },1000);

        //mesh = shape2mesh(tetraShape);

        //mesh = shape2mesh(this.el.body);

        //mesh.setGeometry(shape2mesh(this.el.body));

        var geo = shape2mesh(this.el.body);

        mesh.geometry.dispose();
        mesh.geometry = geo;
        



        }
      });

    //console.log(entityEl.object3D);
    //console.log(entityEl.body);

    console.log(entityEl.components['dynamic-body']);

    
    //entityEl.components['dynamic-body'].body.shapes = [];
    //entityEl.components['dynamic-body'].body.addShape(tetraShape);

    //var mesh = entityEl.getOrCreateObject3D('mesh', THREE.Mesh);//works
    //console.log(mesh);
    sceneEl.appendChild(entityEl);
    //var bodyphysics = document.querySelector('#block').components['dynamic-body'];
    //console.log(bodyphysics);



    // ConvexPolyhedron tetra shape
    //var tetraShape = createTetra();
    //var tetraBody = new CANNON.Body({ mass: mass });
    //tetraBody.addShape(tetraShape);
    //tetraBody.position.set(0,100,0);
    //world.addBody(tetraBody);

    //var physics = document.querySelector('a-scene').systems['physics'];
    //console.log(physics.driver);

    //physics.driver.world.addBody(tetraBody);
    
    setInterval(function(){
        //console.log(tetraBody.position);
    },1000);


    //console.log(physics.driver.world);

    //var groupObject3D = document.querySelector('#block').object3D;
    //console.log(groupObject3D);





    //var sceneEl = document.querySelector('a-scene');
    //console.log(sceneEl);
    //var physicsEl = document.querySelector('a-scene').components['physics'];
    //var physicsEl = document.querySelector('a-scene').components;
    //console.log(physicsEl);
});

