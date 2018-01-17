'use strict';

const Renderer = require('lance-gg').render.Renderer;

require('aframe');

class MyRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        this.sprites = {};
        
        var self = this;
        
        setInterval(function(){
            //self.objectlist();
            //console.log(MyRenderer);
            console.log(self.sprites);

          },  5000);  
    }

    objectlist(){ 
        for (let objId of Object.keys(this.sprites)) {
            console.log(this.sprites[objId].el);
        }
    }

    draw() {
        super.draw();

        //this.objectlist();

        for (let objId of Object.keys(this.sprites)) {

            //console.log(objId);

            if (this.sprites[objId].el) {
                this.sprites[objId].el.style.top = this.gameEngine.world.objects[objId].position.y + 'px';
                this.sprites[objId].el.style.left = this.gameEngine.world.objects[objId].position.x + 'px';
                //console.log(objId);
                //console.log(this.sprites[objId].el);
            }
            if(objId == 1){
                var sceneEl = document.querySelector('a-scene');
                var entityEl = sceneEl.querySelector('#paddle1');
                var pos = this.gameEngine.world.objects[objId].position;
                entityEl.setAttribute('position', {x: pos.x, y: pos.y, z: 0});
            }

            if(objId == 2){
                var sceneEl = document.querySelector('a-scene');
                var entityEl = sceneEl.querySelector('#paddle2');
                var pos = this.gameEngine.world.objects[objId].position;
                entityEl.setAttribute('position', {x: pos.x, y: pos.y, z: 0});
            }

            if(objId == 3){
                var sceneEl = document.querySelector('a-scene');
                var entityEl = sceneEl.querySelector('#ball');
                var pos = this.gameEngine.world.objects[objId].position;
                entityEl.setAttribute('position', {x: pos.x, y: pos.y, z: 0});
            }
        }
    }

    addSprite(obj, objName) {
        if (objName === 'paddle') objName += obj.id;
        this.sprites[obj.id] = {
            el: document.querySelector('.' + objName)
        };
        console.log(objName);
    }

}

module.exports = MyRenderer;
