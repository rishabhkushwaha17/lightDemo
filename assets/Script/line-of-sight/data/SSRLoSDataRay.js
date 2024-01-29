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
 * ssr.LoS.Data.Ray
 * @class
 * @extends cc.Class
 * @prop {cc.Point}                         endPoint                           - The end point of the ray.
 * @prop {Array.<Number>}                   edgeIDs                            - The id of the edges that contains the angle point of the ray.
 * @prop {ssr.LoS.Constant.ANGLE_POINT_TYPE}    type                               - The type of the angle point of the ray.
 * @prop {Number}                           distanceSQ                         - The square of the distance between the source point and the angle point of the ray.
 * @prop {Number}                           angle                              - The angle beteen the source point and the angle point in radians of the ray.
 */
ssr.LoS.Data.Ray = cc.Class(/** @lends ssr.LoS.Data.Ray# */{
    name: "ssr.LoS.Data.Ray",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     * @param {cc.Point} endPoint The end point of the ray.
     * @param {Array.<Number>} edgeIDs The id of the edges that contains the angle point of the ray.
     * @param {ssr.LoS.Constant.ANGLE_POINT_TYPE} type The type of the angle point.
     * @param {Number|null} [distanceSQ=-1] The square of the distance between the source point and the angle point.
     * @param {Number|null} [angle=0] The angle beteen the source point and the angle point in radians.
     */
    ctor:function() {
        if (ssr.LoS.Data.Ray.__alloc === undefined) {
            ssr.LoS.Data.Ray.__alloc = 0;
        }
        ssr.LoS.Data.Ray.__alloc += 1;
    },
    /**
     * The initializer.
     * @function
     * @prop {cc.Point} endPoint The end point of the ray.
     * @prop {Array.<Number>} edgeIDs The id of the edges that contains the angle point of the ray.
     * @prop {ssr.LoS.Constant.ANGLE_POINT_TYPE} type The type of the angle point of the ray.
     * @prop {Number} distanceSQ The square of the distance between the source point and the angle point of the ray.
     * @prop {Number} angle The angle beteen the source point and the angle point in radians of the ray.
     */
    init:function(endPoint, edgeIDs, type, angle, distanceSQ) {
        this._endPoint = endPoint;
        this._edgeIDs = edgeIDs;
        this._type = type;
        this._angle = angle;
        this._distanceSQ = distanceSQ || -1;
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
     * Set the end point.
     * @function
     * @param {cc.Point} The end point to set.
     */
    setEndPoint:function(endPoint) {
        this._endPoint = endPoint;
    },
    /**
     * Get the edge ids.
     * @function
     * @return {Array.<Number>} The edge ids.
     */
    getEdgeIDs:function() {
        return this._edgeIDs;
    },
    /**
     * Set the edge ids.
     * @function
     * @param {Array.<Number>} The edge ids to set.
     */
    setEdgeIDs:function(edgeIDs) {
        this._edgeIDs = edgeIDs;
    },
    /**
     * Get the angle point type.
     * @function
     * @return {ssr.LoS.Constant.ANGLE_POINT_TYPE} The type.
     */
    getType:function() {
        return this._type;
    },
    /**
     * Set the angle point type.
     * @function
     * @return {ssr.LoS.Constant.ANGLE_POINT_TYPE} The type to set.
     */
    setType:function(type) {
        this._type = type;
    },
    /**
     * Get the square distance.
     * @function
     * @return {Number} The square distance.
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
     * @param {Number} The angle to set.
     */
    setAngle:function(angle) {
        this._angle = angle;
    }
});
