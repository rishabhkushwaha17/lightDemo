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
 * ssr.LoS.Data.AnglePoint
 * @class
 * @extends cc.Class
 * @prop {cc.Point}                             endPoint        - The end point of the angle point.
 * @prop {Array.<Number>}                       edgeIDs         - The id of the edges that contains the end point.
 * @prop {ssr.LoS.Constant.ANGLE_POINT_TYPE}    type            - The type of the angle point.
 * @prop {ssr.LoS.Data.Edge}                    prevEdge        - The pre edge of the angle point.
 * @prop {ssr.LoS.Data.Edge}                    nextEdge        - The next edge of the angle point.
 * @prop {Number}                               distanceSQ      - The square of the distance between the source point and the angle point.
 * @prop {Number}                               angle           - The angle beteen the source point and the angle point in radians.
 */
ssr.LoS.Data.AnglePoint = cc.Class(/** @lends ssr.LoS.Data.AnglePoint# */{
    name: "ssr.LoS.Data.AnglePoint",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     */
    ctor:function() {
        if (ssr.LoS.Data.AnglePoint.__alloc === undefined) {
            ssr.LoS.Data.AnglePoint.__alloc = 0;
        }
        ssr.LoS.Data.AnglePoint.__alloc += 1;
        // cc.log("ssr.LoS.Data.AnglePoint.__alloc: " + ssr.LoS.Data.AnglePoint.__alloc);
    },
    /**
     * The initializer.
     * @function
     * @param {cc.Point} endPoint The end point of the angle point.
     * @param {Array.<Number>} edgeIDs The id of the edges that contains the end point.
     * @param {ssr.LoS.Constant.ANGLE_POINT_TYPE} type The type of the angle point.
     * @param {ssr.LoS.Data.Edge} prevEdge The pre edge of the angle point.
     * @param {ssr.LoS.Data.Edge} nextEdge The next edge of the angle point.
     * @param {Number|null} [distanceSQ=-1] The square of the distance between the source point and the angle point.
     * @param {Number|null} [angle=0] The angle beteen the source point and the angle point in radians.
     */
    init:function(endPoint, edgeIDs, type, prevEdge, nextEdge, distanceSQ, angle) {
        this._endPoint = endPoint;
        this._edgeIDs = edgeIDs;
        this._type = type;
        this._prevEdge = prevEdge;
        this._nextEdge = nextEdge;
        this._distanceSQ = distanceSQ || -1;
        this._angle = angle || 0;
    },
    /**
     * Get the end point.
     * @function
     * @return {cc.Point} The end point.
     */
    getEndPoint:function() {
        return this._endPoint;
    },
    /**
     * Get the edge id.
     * @function
     * @return {Array.<Number>} The edge id.
     */
    getEdgeIDs:function() {
        return this._edgeIDs;
    },
    /**
     * Get the angle point type.
     * @function
     * @return {ssr.LoS.Constant.ANGLE_POINT_TYPE} The edge type.
     */
    getType:function() {
        return this._type;
    },
    /**
     * Get the pre edge.
     * @function
     * @return {ssr.LoS.Data.Edge|null} The pre edge.
     */
    getPrevEdge:function() {
        return this._prevEdge;
    },
    /**
     * Get the next edge.
     * @function
     * @return {ssr.LoS.Data.Edge|null} The next edge.
     */
    getNextEdge:function() {
        return this._nextEdge;
    },
    /**
     * Get the square of distance.
     * @function
     * @return {Number} The square of distance.
     */
    getDistanceSQ:function() {
        return this._distanceSQ;
    },
    /**
     * Set the square distance.
     * @function
     * @param {Number} distanceSQ The square distance to set.
     */
    setDistanceSQ:function(distanceSQ) {
        this._distanceSQ = distanceSQ;
    },
    /**
     * Get the angle.
     * @function
     * @return {Number} The angle.
     */
    getAngle:function() {
        return this._angle;
    },
    /**
     * Set the angle.
     * @function
     * @param {Number} angle The angle to set.
     */
    setAngle:function(angle) {
        this._angle = angle;
    }
});
