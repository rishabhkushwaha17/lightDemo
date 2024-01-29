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
 * ssr.LoS.Data.HitPoint
 * @class
 * @extends cc.Class
 * @prop {cc.Point}                         hitPoint                           - The hit point.
 * @prop {Array.<Number>}                   edgeIDs                            - The id of the edges that contains the hit point.
 * @prop {ssr.LoS.Constant.ANGLE_POINT_TYPE}    type                               - The type of the hit point.
 * @prop {Number}                           angle                              - The angle beteen the source point and the angle point in radians.
 */
ssr.LoS.Data.HitPoint = cc.Class(/** @lends ssr.LoS.Data.HitPoint# */{
    name: "ssr.LoS.Data.HitPoint",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     */
    ctor:function() {
        if (ssr.LoS.Data.HitPoint.__alloc === undefined) {
            ssr.LoS.Data.HitPoint.__alloc = 0;
        }
        ssr.LoS.Data.HitPoint.__alloc += 1;
    },
    /**
     * The initializer.
     * @function
     * @param {cc.Point} hitPoint The hit point.
     * @param {Array.<Number>} edgeIDs The id of the edges that contains the hit point.
     * @param {ssr.LoS.Constant.ANGLE_POINT_TYPE} type The type of the hit point.
     */
    init:function(hitPoint, edgeIDs, angle, type) {
        this._hitPoint = hitPoint;
        this._edgeIDs = edgeIDs;
        this._angle = angle;
        this._type = type;
    },
    /**
     * Get the hit point.
     * @function
     * @return {cc.Point} The hit point.
     */
    getHitPoint:function() {
        return this._hitPoint;
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
     * Get the angle.
     * @function
     * @return {Number} The angle.
     */
    getAngle:function() {
        return this._angle;
    }
});
