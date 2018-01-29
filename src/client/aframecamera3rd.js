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

AFRAME.registerComponent('camera3rd', {
    schema: {
        enabled: {type: 'boolean',default:true},
        cameraid: {type: 'string',default:"a-camera"}
    },
    init: function () {
        
    },
    tick: function (time, delta) {
        
        if(!this.data.enabled){
            return;
        }
        //console.log(this.data.enabled);
        let relativeCameraOffset = new THREE.Vector3(0,5,-10);
        let cameraEL = document.querySelector(this.data.cameraid);
        let cameraOffset = relativeCameraOffset.applyMatrix4( this.el.object3D.matrixWorld.clone() );

        if((cameraEL !=null)){
            cameraEL.object3D.position.set(cameraOffset.x,cameraOffset.y,cameraOffset.z);
            let m1 = new THREE.Matrix4();
            m1.lookAt( cameraEL.object3D.position, this.el.object3D.position, new THREE.Vector3(0,1,0) );
            cameraEL.object3D.quaternion.setFromRotationMatrix( m1 );
        }
    }
});