/****************************************************************************
 Copyright (c) 2017-2018 SuperSuRaccoon
 
 Site: http://www.supersuraccoon-cocos2d.com
 Mail: supersuraccoon@gmail.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const ssr = require('../../namespace/SSRLoSNamespace');
 
/**
 * @classdesc Culling strategy base class. The main purpose of this class is: <br>
 * . Check each obstacles edges. <br>
 * . Remove those edges that will not be considered when generating the final visible area based on point && boundary inclusion test and point && boundary intersection algorithm.<br>
 * . Generate anlge points for all the edges end points that are not culled and bind them into the obstacle instance.<br>
 * . Generate anlge points for all the intersections between the edges and the boundary and bind them into the obstacle instance.<br>
 * . Generate potential blocking edge for all the edges that are not culled and bind them into the obstacle instance.<br>
 *
 * @class
 * @extends cc.Class
 * @prop {ssr.LoS.Component.Core}       losComponentCore            - The ssr.LoS.Component.Core instance. 
 * @prop {cc.Node}                      boundaryNode                - A cc.Node used to be wrapped into the obstacle for the boundary.
 */
ssr.LoS.Strategy.Culling.Base = cc.Class( /** @lends ssr.LoS.Strategy.Culling.Base# */ {
    name: "ssr.LoS.Strategy.Culling.Base",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core instance
     */
    ctor:function() {
        this._losComponentCore = arguments[0];
    },
    /**
     * The entrance for the culling process.
     * @function
     */
    process:function() {
        // pre process first if needed
        this._preProcess();
        // start the main loop 
        var obstacles = this._losComponentCore.getObstacles();
        for (var i = 0, l = obstacles.length; i < l; i ++) {
            var obstacle = obstacles[i];
            if (!obstacle.isDirty()) {
                // pass if not dirty since we do not need to redo the culling
                continue;
            }
            else {
                // culling if needed, so we need to clean the angle point and potential blocking edge array first
                obstacle.clearAnglePointArray();
                obstacle.clearPotentialBlockingEdgeArray();
            }
            // start to process all the edges of each obstacle
            var obstacleEdgeArray = obstacle.getObstacleEdgeArray();
            for (var j = 0, ll = obstacleEdgeArray.length; j < ll; j ++) {
                var edge = obstacleEdgeArray[j];
                var s = edge.getStartPoint();
                var e = edge.getEndPoint();
                var sHashCode = ssr.LoS.Helper.pointToHashCode(s);
                var eHashCode = ssr.LoS.Helper.pointToHashCode(e);
                
                var prevEdgeS = null;
                var nextEdgeS = null;
                var prevEdgeE = null;
                var nextEdgeE = null;
                if (edge.getType() == ssr.LoS.Constant.EDGE_TYPE.POLYGON) {
                    prevEdgeS = (j == 0 ? obstacleEdgeArray[ll - 1] : obstacleEdgeArray[j - 1]);
                    nextEdgeS = edge;
                    prevEdgeE = edge;
                    nextEdgeE = (j == ll - 1 ? obstacleEdgeArray[0] : obstacleEdgeArray[j + 1]);
                }
                else if (edge.getType() == ssr.LoS.Constant.EDGE_TYPE.POLYLINE) {
                    prevEdgeS = (j == 0 ? null : obstacleEdgeArray[j - 1]);
                    nextEdgeS = edge;
                    prevEdgeE = edge;
                    nextEdgeE = (j == ll - 1 ? null : obstacleEdgeArray[j + 1]);
                }
                // culling
                this._processOneEdge(
                    obstacle, 
                    sHashCode, 
                    eHashCode, 
                    edge, 
                    prevEdgeS, 
                    nextEdgeS, 
                    prevEdgeE, 
                    nextEdgeE
                );
            }
            // reset the dirty flag of the obstacle after culling
            obstacle.setDirty(false);
        }
        // finish up if needed
        this._postProcess();
    },
    /**
     * Pre process before the main culling process if needed.
     * @function
     * @abstract
     */
    _preProcess:function() {
    },
    /**
     * Process the culling algorithm for the input edge.
     * @function
     * @abstract
     * @param {ssr.LoS.Data.Obstacle} obstacle The obstacle that the edge belongs to.
     * @param {String} sHashCode The start point hash code of the edge.
     * @param {String} eHashCode The end point hash code of the edge.
     * @param {ssr.LoS.Data.Edge} edge The edge being processed.
     * @param {ssr.LoS.Data.Edge|null} prevEdgeS The end point of the edge connected to the start point of the edge being processed.
     * @param {ssr.LoS.Data.Edge|null} nextEdgeS The start point of the edge connected to the start point of the edge being processed.
     * @param {ssr.LoS.Data.Edge|null} prevEdgeE The end point of the edge connected to the end point of the edge being processed.
     * @param {ssr.LoS.Data.Edge|null} nextEdgeE The start point of the edge connected to the end point of the edge being processed.
     * @abstract
     */
    _processOneEdge:function(obstacle, sHashCode, eHashCode, edge, prevEdgeS, nextEdgeS, prevEdgeE, nextEdgeE) {
    },
    /**
     * Post process after the main culling process -- generating a big angle point array and potential blocking edge array / map of all the obstacles.
     * @function
     * @abstract
     */
    _postProcess:function() {
    }
});
