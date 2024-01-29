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
 
const ssr = require('../namespace/SSRLoSNamespace');

/**
 * @classdesc A wrapper class for obstacle used in ssr.LoS.Component.Core.
    JSBinding Support [○]
    JSBinding Functions Support:
        isDirtyDetectionOn
        enableDirtyDetection
        disableDirtyDetection
        setVertexArrayProvider
 * @class
 * @extends cc.Class
 * @prop {cc.Node}                               node                         - The cc.Node instance that is wrapped in the ssr.LoS.Data.Obstacle
 * @prop {Array.<ssr.LoS.Data.Edge>}                 obstacleEdgeArray            - Edge data generated based on the vertex array of the obstacle.
 * @prop {Array.<ssr.LoS.Data.AnglePoint>}           anglePointArray              - Angle point array of the obstacle.
 * @prop {Object.<String, ssr.LoS.Data.AnglePoint>}  anglePointMap                - Angle point map of the obstacle.
 * @prop {Array.<ssr.LoS.Data.Edge>}                 potentialBlockingEdgeArray   - Potential blocking edge array of the obstacle.
 * @prop {Boolean}                               dirtyFlag                    - Dirty flag of the obstacle.
 * @prop {Boolean}                               dirtyDetection               - Dirty detection mode flag.
 * @prop {Boolean}                               isPolyogn                    - If the obstacle is polygon or polyline
 * @prop {Boolean}                               isSkipProcess                - Is the obstacle edge process procedure need to be skipped when being created.
 * @prop {vertexArrayProvider}                   vertexArrayProvider          - A callback function which will provide the vertex array of the obstacle.
 * @prop {Array.<cc.Point>}                      vertexArray                  - The vertex array of the obstacle.
 * @prop {Number}                                index                        - The unique index of the obstacle.
 * 
 */
ssr.LoS.Data.Obstacle = cc.Class( /** @lends ssr.LoS.Data.Obstacle# */ {
    name: "ssr.LoS.Data.Obstacle",
    "extends": cc.Object,
    /**
     * Constructor for creating an ssr.LoS.Data.Obstacle instance.
     * @function
     * @param {cc.Node} node The node that represents the obstacle.
     * @param {Array.<cc.Point>|null} vertexArray Obstacle vertex array. If null the boundingbox of the node will be used as the vertex array automaticlly.
     * @param {Boolean} [isPolyogn=true] isPolyogn If the obstacle is a polygon (or polyline).
     * @param {Boolean} [isSkipProcess=false] isSkipProcess If the obstacle edges process procedure need to be skipped.
     */
    ctor:function() {
        this._node = arguments[0];
        this._obstacleEdgeArray = [];
        this._anglePointArray = [];
        this._anglePointMap = {};
        this._anglePointAuxiliaryArray = [];
        this._potentialBlockingEdgeArray = [];
        this._dirtyFlag = true;
        this._dirtyDetection = false;
        this._isPolyogn = (arguments[2] === undefined ? true : arguments[2]);
        this._isSkipProcess = (arguments[3] === undefined ? false : arguments[3]);
        this._vertexArrayProvider = null;
        this.__index = ssr.LoS.Data.Obstacle.INDEX;
        ssr.LoS.Data.Obstacle.INDEX += 1;
        if (!this._isSkipProcess) {
            this._vertexArray = (arguments[1] === undefined ? this.generateVertexArray() : arguments[1]);
            this.processEdges();
        }
    },
    /**
     * Return the vertex array.
     * @function
     * @return {Array.<cc.Point>} The vertex array.
     */
    getVertexArray:function() {
        return this._vertexArray;
    },
    /**
     * Set the vertex array.
     * @function
     * @param {Array.<cc.Point>} vertexArray The vertex array to set.
     */
    setVertexArray:function(vertexArray) {
        this._vertexArray = vertexArray;
    },
    /**
     * clear the vertex array and free the data to pool (if pool is enabled).
     * @function
     */
    clearVertexArray:function() {
        this._vertexArray = [];
    },
    /**
     * Return the prrocessed edge array of the obstacle which will be used in the culling process.
     * @function
     * @return {Array.<ssr.LoS.Data.Edge>} The obstacle edge array.
     */
    getObstacleEdgeArray:function() {
        return this._obstacleEdgeArray;
    },
    /**
     * Add a edge to obstacle edge array.
     * @function
     * @param {Array.<ssr.LoS.Data.Edge>} edge The edge to add.
     */
    addObstacleEdge:function(edge) {
        this._obstacleEdgeArray.push(edge);
    },
    /**
     * clear the obstacle edge array and free the data to pool (if pool is enabled).
     * @function
     */
    clearObstacleEdgeArray:function() {
        for (var i = 0, l = this._obstacleEdgeArray.length; i < l; i ++) {
            ssr.LoS.Data.Manager.getInstance().free(this._obstacleEdgeArray[i]);
        }
        this._obstacleEdgeArray = [];
    },
    /**
     * Return the angle point array of the obstacle which will be used when generating the rays.
     * @function
     * @return {Array.<ssr.LoS.Data.AnglePoint>} The obstacle angle point array.
     */
    getAnglePointArray:function() {
        return this._anglePointArray;
    },
    /**
     * Return the angle point (auxiliary) array of the obstacle which will be used when generating the rays.
     * @function
     * @return {Array.<ssr.LoS.Data.AnglePoint>} The obstacle angle point (auxiliary) array.
     */
    getAnglePointAuxiliaryArray:function() {
        return this._anglePointAuxiliaryArray;
    },
    /**
     * Clear the angle point array and free the data to pool (if pool is enabled).
     * @function
     */
    clearAnglePointArray:function() {
        for (var i = 0, l = this._anglePointArray.length; i < l; i ++) {
            ssr.LoS.Data.Manager.getInstance().free(this._anglePointArray[i]);
        }
        for (var i = 0, l = this._anglePointAuxiliaryArray.length; i < l; i ++) {
            ssr.LoS.Data.Manager.getInstance().free(this._anglePointAuxiliaryArray[i]);
        }
        this._anglePointArray = [];
        this._anglePointAuxiliaryArray = [];
        this._anglePointMap = {};
    },
    /**
     * Return the angle point map of the obstacle which will be used to eliminate the possible duplicate angle point.
     * @function
     * @return {Object.<Number, ssr.LoS.Data.AnglePoint>} The obstacle angle point map.
     */
    getAnglePointMap:function() {
        return this._anglePointMap;
    },
    /**
     * Return the potential blocking edge array of the obstacle which will be used to find the nearest intersections against the generated rays.
     * @function
     * @return {Array.<ssr.LoS.Data.Edge>} The obstacle potential blocking edge array.
     */
    getPotentialBlockingEdgeArray:function() {
        return this._potentialBlockingEdgeArray;
    },
    /**
     * Clear the potential blocking edge array and free the data to pool (if pool is enabled).
     * @function
     */
    clearPotentialBlockingEdgeArray:function() {
        this._potentialBlockingEdgeArray = [];
    },
    /**
     * Return if the obstacle is dirty or not.
     * @function
     * @return {Boolean} True for dirty, false for not.
     */
    isDirty:function() {
        return this._dirtyFlag;
    },
    /**
     * Set if the obstacle is dirty or not.
     * @function
     * @param {Boolean} flag The dirty flag to set.
     */
    setDirty:function(flag) {
        this._dirtyFlag = flag;
    },
    /**
     * Return if the obstacle instance is a polygon (otherwise a polyline).
     * @function
     * @return {Boolean} True for polygon, false for polyline
     */
    isPolygon:function() {
        return this._isPolyogn;
    },
    /**
     * Set the callback function that can provide the vertex array of the obstacle.
     * @function
     * @param {vertexArrayProvider} vertexArrayProvider The callback function that will return the vertex array of the obstacle.
     */
    setVertexArrayProvider:function(vertexArrayProvider) {
        this._vertexArrayProvider = vertexArrayProvider;
    },
    /**
     * Remove the callback function set for vertexArrayProvider.
     * @function
     */
    removeVertexArrayProvider:function() {
        this._vertexArrayProvider = null;
    },
    /**
     * Return if the dirty detection if enabled.
     * @function
     * @return {Boolean} True for enabled, false for disabled
     */
    isDirtyDetectionOn:function() {
        return this._dirtyDetection;
    },
    /**
     * Enable the dirty detection feature.
     * @function
     */
    enableDirtyDetection:function() {
        this._dirtyDetection = true;
    },
    /**
     * Dsiable the dirty detection feature.
     * @function
     */
    disableDirtyDetection:function() {
        this._dirtyDetection = false;
    },
    /**
     * Return the cc.Node instance that the ssr.LoS.Data.Obstacle instance wrapped in.
     * @function
     */
    getNode:function() {
        return this._node;
    },
    /**
     * Generate the vertex array for the obstacle based on the bounding box of the cc.Node instance and take node transformation into consideration. <p>
     * This function is only called when vertexArrayProvider is not provided.
     * @function
     * return {Array.<cc.Point>} The vertex array.
     */
    generateVertexArray:function() {
        var vertexArray = [];
        var rect = this._node.getBoundingBox();
        var left = rect.xMin;
        var right = rect.xMax;
        var top = rect.yMax;
        var bottom = rect.yMin;
        var topLeft = cc.v2(left, top);
        var topRight = cc.v2(right, top);
        var bottomLeft = cc.v2(left, bottom);
        var bottomRight = cc.v2(right, bottom);
        vertexArray.push(bottomLeft);
        vertexArray.push(bottomRight);
        vertexArray.push(topRight);
        vertexArray.push(topLeft);
        return vertexArray;
    },
    /**
     * Clean up the obstacle inner data. <p>
     * Is commonly called when an obstacle vertex array is updated and the obstacle edge array need to be re-processed.
     * @function
     */
    cleanup:function() {
        this.clearVertexArray();
        this.clearObstacleEdgeArray();
        this.clearAnglePointArray();
        this.clearPotentialBlockingEdgeArray();
    },
    /**
     * Clean up the obstacle inner data. <p>
     * Is commonly called when an obstacle vertex array is not updated.
     * @function
     */
    cleanupForProcess:function() {
        this.clearAnglePointArray();
        this._potentialBlockingEdgeArray = [];
        this._dirtyFlag = true;
    },
    /**
     * Generate the edge array for the obstacle.
     * @function
     */
    processEdges:function() {
        if (this.isPolygon()) {
            this._processAsPolyogn();
        }
        else {
            this._processAsPolyline();
        }
    },
    /**
     * Generate the edge array for the obstacle as polygon.
     * @function
     * @private
     */
    _processAsPolyogn:function() {
        for (var j = 0, ll = this._vertexArray.length; j < ll; j += 1) {
            var s = this._vertexArray[j];
            var e = (j == ll - 1) ? this._vertexArray[0] : this._vertexArray[j + 1];
            var edge = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Edge);
            edge.init(s, e, this.__index * 1000 + j + 1, ssr.LoS.Constant.EDGE_TYPE.POLYGON);
            this.addObstacleEdge(edge);
        }
    },
    /**
     * Generate the edge array for the obstacle as polyline.
     * @function
     * @private
     */
    _processAsPolyline:function() {
        for (var j = 0, ll = this._vertexArray.length; j < ll - 1; j += 1) {
            var s = this._vertexArray[j];
            var e = this._vertexArray[j + 1];
            var edge = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Edge);
            edge.init(s, e, this.__index * 1000 + j + 1, ssr.LoS.Constant.EDGE_TYPE.POLYLINE);
            this.addObstacleEdge(edge);
        }
    },
    /**
     * Update the vertex array of the obstacle.
     * @function
     * @param {Array.<cc.Point>} vertexArray The updated vertex array.
     */
    update:function(vertexArray) {
        // clean up first
        this.cleanup();
        if (vertexArray) {
            this._vertexArray = vertexArray;
        }
        else if (this._vertexArrayProvider) {
            // if vertexArrayProvider is specified use it
            this._vertexArray = this._vertexArrayProvider.call(this._node);
        }
        else {
            // if nothing is specified use bondingbox as vertexy array
            this._vertexArray = this.generateVertexArray();
        }
        // process edges based on the new vertex array
        if (!this._isSkipProcess) {
            this.processEdges();
        }
        // finally, make it dirty for up coming culling process
        this._dirtyFlag = true;
    },
    /**
     * If the specified angle point is already added.
     * @function
     * @return {Boolean} true for added, false for not added yet.
     */
    hasAnglePoint:function(key) {
        return this._anglePointMap.hasOwnProperty(key);
    },
    /**
     * Add a angle point to the obstacle with the specified key.
     * @function
     * @return {Boolean} true for added, false for not added yet.
     */
    addAnglePoint:function(key, anglePoint) {
        this._anglePointArray.push(anglePoint);
        this._anglePointMap[key] = true;
    },
    /**
     * Add a potential blocking edge.
     * @function
     * @param {ssr.LoS.Data.Edge} edge The edge to add.
     */
    addPotentialBlockingEdge:function(edge) {
        this._potentialBlockingEdgeArray.push(edge);
    },
    /**
     * Add an angle point to the obstacle with the type of ssr.LoS.Constant.ANGLE_POINT_TYPE.ENDPOINT.
     * @function
     * @param {String} hashCode The hash code of the point to add.
     * @param {cc.Point} point The cc.Point to add.
     * @param {ssr.LoS.Data.Edge} edge The edge that the angle point belongs to.
     * @param {ssr.LoS.Data.Edge|null} The prev edge of the angle point.
     * @param {ssr.LoS.Data.Edge|null} The next edge of the angle point.
     */
    addEndPointAnglePoint:function(hashCode, point, edge, prevEdge, nextEdge) {
        if (!this.hasAnglePoint(hashCode)) {
            var edgeIDs = [];
            if (prevEdge) {
                edgeIDs.push(prevEdge.getEdgeID());
            }
            if (nextEdge) {
                edgeIDs.push(nextEdge.getEdgeID());
            }
            var anglePoint = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
            anglePoint.init(point, edgeIDs, ssr.LoS.Constant.ANGLE_POINT_TYPE.ENDPOINT, prevEdge, nextEdge);
            this.addAnglePoint(hashCode, anglePoint);
        }
    },
    /**
     * Add an angle point to the obstacle with the type of ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY.
     * @function
     * @param {String} hashCode The hash code of the point to add.
     * @param {cc.Point} point The cc.Point to add.
     * @param {ssr.LoS.Data.Edge} edge The edge that the angle point belongs to.
     */
    addBoundaryAnglePoint:function(hashCode, point, edge) {
        if (!this.hasAnglePoint(hashCode)) {
            var anglePoint = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
            anglePoint.init(point, [edge.getEdgeID()], ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY);
            this.addAnglePoint(hashCode, anglePoint);
        }
    },
    /**
     * Add an auxiliary angle point to the obstacle.
     * @function
     * @param {String} hashCode The hash code of the point to add.
     * @param {cc.Point} point The cc.Point to add.
     * @param {ssr.LoS.Data.Edge} edge The edge that the angle point belongs to.
     */
    addAuxiliaryAnglePoint:function(anglePoint) {
        this._anglePointAuxiliaryArray.push(anglePoint);
    }
});

/**
 * Default obstacle index which will be used the identify each obstacle.
 * @constant
 * @type Number
 */
ssr.LoS.Data.Obstacle.INDEX = 1;

/**
 * Reset the total index of the obstacle.
 * @function
 */
ssr.LoS.Data.Obstacle.resetIndex = function() {
    ssr.LoS.Data.Obstacle.INDEX = 1;    
};

/**
 * The function will be called when trying to updating the vertex array of the ostacle.
 * @callback vertexArrayProvider
 * @return {Array.<cc.Point>} 
 */

