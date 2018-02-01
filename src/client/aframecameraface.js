/*
    Information:
        Simple Lookat camera behind the object base on three npm lookat function.
        Aframe camera lookat function doesn't work reason is the parenting nodes I think.

        //copy from node_module\three\src\core\object3d.js
        ```
        // lookat function
        // This method does not support objects with rotated and/or translated parent(s)
        ```

*/

AFRAME.registerComponent('cameraface', {
    schema: {
        enabled: {type: 'boolean',default:true},
        cameraid: {type: 'string',default:"a-camera"},
        target: {type: 'string',default:null},
        offset: {type: 'vec3', default:{x:0,y:3,z:0}}
    },
    init: function () {
        this.cameraEL = null;
        this.targetEL = null;
    },
    tick: function (time, delta) {
        
        if(!this.data.enabled){
            return;
        }
        //console.log(this.data.enabled);
        //let relativeCameraOffset = new THREE.Vector3(0,5,-10);
        if(this.cameraEL == null){
            this.cameraEL = document.querySelector(this.data.cameraid);
        }
        //let cameraOffset = relativeCameraOffset.applyMatrix4( this.el.object3D.matrixWorld.clone() );
        if((this.cameraEL !=null)){
            let m1 = new THREE.Matrix4();

            m1.lookAt( this.el.sceneEl.camera.getWorldPosition(), this.el.object3D.getWorldPosition(), new THREE.Vector3(0,1,0) );
            //m1.lookAt( this.cameraEL.object3D.getWorldPosition(), this.el.object3D.getWorldPosition(), new THREE.Vector3(0,1,0) );
            //m1.lookAt( this.cameraEL.object3D.position, this.el.object3D.position, new THREE.Vector3(0,1,0) );
            //m1.lookAt( this.el.object3D.position, this.cameraEL.object3D.position, new THREE.Vector3(0,1,0) );
            //console.log(this.el.object3D);
            this.el.object3D.quaternion.setFromRotationMatrix( m1 );

            if(this.targetEL == null){
                this.targetEL = document.querySelector(this.data.target);
            }

            if(this.targetEL != null){
                this.el.object3D.position.x = this.targetEL.object3D.position.x + this.data.offset.x;
                this.el.object3D.position.y = this.targetEL.object3D.position.y + this.data.offset.y;
                this.el.object3D.position.z = this.targetEL.object3D.position.z + this.data.offset.z;
            }

            //console.log(this.el.sceneEl.camera);
            //this.el.object3D.rotation.y += 0.1;
        }
    }
});