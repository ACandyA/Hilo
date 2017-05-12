/**
 * Hilo 1.0.4 for amd
 * Copyright 2016 alibaba.com
 * Licensed under the MIT License
 */
define('hilo/util/drag', ['hilo/core/Hilo'], function(Hilo){



/**
 * @language=en
 * <iframe src='../../../examples/drag.html?noHeader' width = '550' height = '250' scrolling='no'></iframe>
 * <br/>
 * example:
 * <pre>
 * var bmp = new Bitmap({image:img});
 * Hilo.copy(bmp, Hilo.drag);
 * bmp.startDrag([0, 0, 550, 400]);
 * </pre>
 * @class drag A mixin that contains drag method.You can mix drag method to the visual target by use Class.mix(target, drag) or Hilo.copy(target, drag).
 * @mixin
 * @static
 * @module hilo/util/drag
 * @requires hilo/core/Hilo
 */
var drag = {
    /**
     * @language=en
     * start drag.
      * @param {Array} bounds The bounds area that the view can move, relative to the coordinates of the view's parent, [x, y, width, height]， default is no limit.
    */
    startDrag:function(bounds){
        var that = this;
        var stage;
        bounds = bounds||[-Infinity, -Infinity, Infinity, Infinity];
        var mouse = {
            x:0,
            y:0,
            preX:0,
            preY:0
        };
        var minX = bounds[0];
        var minY = bounds[1];
        var maxX = bounds[2] == Infinity?Infinity:minX + bounds[2];
        var maxY = bounds[3] == Infinity?Infinity:minY + bounds[3];

        var worldPoint = {
            x:0, 
            y:0
        };

        function onStart(e){
            e.stopPropagation();
            updateMouse(e);
            that.off(Hilo.event.POINTER_START, onStart);

            that.fire("dragStart", mouse);

            var worldMatrix = that.parent.getConcatenatedMatrix();
            worldPoint.x = that.x;
            worldPoint.y = that.y;
            worldMatrix.transformPoint(worldPoint);
            that.__dragX = worldPoint.x - mouse.x;
            that.__dragY = worldPoint.y - mouse.y;

            if(!stage){
                stage = this.getStage();
            }
            stage.on(Hilo.event.POINTER_MOVE, onMove);
            document.addEventListener(Hilo.event.POINTER_END, onStop);
        }

        function onStop(e){
            document.removeEventListener(Hilo.event.POINTER_END, onStop);
            stage && stage.off(Hilo.event.POINTER_MOVE, onMove);

            that.fire("dragEnd", mouse);
            that.on(Hilo.event.POINTER_START, onStart);
        }

        function onMove(e){
            updateMouse(e);

            that.fire("dragMove", mouse);
            
            worldPoint.x = mouse.x + that.__dragX;
            worldPoint.y = mouse.y + that.__dragY;

            var viewMatrix = that.parent.getConcatenatedMatrix().invert();
            viewMatrix.transformPoint(worldPoint);

            that.x = Math.max(minX, Math.min(maxX, worldPoint.x));
            that.y = Math.max(minY, Math.min(maxY, worldPoint.y));
        }

        function updateMouse(e){
            mouse.preX = mouse.x;
            mouse.preY = mouse.y;
            mouse.x = e.stageX;
            mouse.y = e.stageY;
        }

        function stopDrag(){
            document.removeEventListener(Hilo.event.POINTER_END, onStop);
            stage && stage.off(Hilo.event.POINTER_MOVE, onMove);
            that.off(Hilo.event.POINTER_START, onStart);
        }
        that.on(Hilo.event.POINTER_START, onStart);

        that.stopDrag = stopDrag;
    },
    /**
     * @language=en
     * stop drag.
    */
    stopDrag:function(){

    }
};

return drag;

});