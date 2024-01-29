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
const Boundary = require('./SSRLoSDataBoundary');

/**
 * ssr.LoS.Data.BoundarySector
 * @class
 * @extends ssr.LoS.Data.Boundary
 * @prop {cc.Point}                                  center                    - The center of the boundary.
 * @prop {Number}                                    radius                    - The radius of the boundary.
 * @prop {Number}                                    radiusSQ                  - The square of the radius of the boundary.
 * @prop {cc.Point}                                  dir                       - The direction of the boundary.
 * @prop {Array.<cc.Point>}                          edges                     - The edges of the boundary.
 * @prop {Array.<cc.Point>}                          edgesVec                  - The edges vector of the boundary.
 */
ssr.LoS.Data.BoundarySector = cc.Class(/** @lends ssr.LoS.Data.BoundarySector# */{
    name: "ssr.LoS.Data.BoundarySector",
    "extends": Boundary,
    /**
     * The constructor
     * @function
     * @param {cc.Point}   center  The center of the boundary.
     * @param {Number}   radius   The radius of the boundary.
     * @param {cc.Point}   dir   The direction of the sector.
     * @param {Number}   angle  The central angle between the two edges.
     */
    ctor:function() {
        this._type = ssr.LoS.Constant.BOUNDARY_TYPE.SECTOR;
        this._center = arguments[0];
        this._radius = arguments[1];
        this._radiusSQ = this._radius * this._radius;
        this._dir = arguments[2];
        this._edges = [];
        this._edgesVec = [];

        var halfRadians = arguments[3] * cc.macro.RAD * 0.5;
        var halfRadiansSin = Math.sin(halfRadians);
        var halfRadiansCos = Math.cos(halfRadians);

        this.halfRadiansCos = halfRadiansCos;

        var xC = this._dir.x * halfRadiansCos;
        var yC = this._dir.y * halfRadiansCos;
        var xS = this._dir.x * halfRadiansSin;
        var yS = this._dir.y * halfRadiansSin;

        this._edgesVec[0] = cc.v2((xC + yS) * this._radius, (-xS + yC) * this._radius);
        this._edgesVec[1] = cc.v2((xC - yS) * this._radius, (xS + yC) * this._radius);
        this._edges[0] = cc.v2(this._center.x + this._edgesVec[0].x, this._center.y + this._edgesVec[0].y);
        this._edges[1] = cc.v2(this._center.x + this._edgesVec[1].x, this._center.y + this._edgesVec[1].y);
    },
    /**
     * Get the center of the boundary.
     * @function
     * @return {cc.Point} The center of the boundary. 
     */
    getCenter:function() {
        return this._center;
    },
    /**
     * Get the radius of the boundary.
     * @function
     * @return {Number} The radius of the boundary. 
     */
    getRadius:function() {
        return this._radius;
    },
    /**
     * Get the square of radius of the boundary.
     * @function
     * @return {Number} The square of radius of the boundary. 
     */
    getRadiusSQ:function() {
        return this._radiusSQ;
    },
    /**
     * Get the edges of the boundary.
     * @function
     * @return {Array.<cc.Point>} The edges of the boundary. 
     */
    getEdges:function() {
        return this._edges;
    },
    /**
     * Get the edges vector of the boundary.
     * @function
     * @return {Array.<cc.Point>} The edges vector of the boundary. 
     */
    getEdgesVec:function() {
        return this._edgesVec;
    },
    /**
     * Get the direction of the boundary.
     * @function
     * @return {Number} The direction of the boundary. 
     */
    getDir:function() {
        return this._dir;
    }
});
