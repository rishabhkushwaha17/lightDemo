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
 * ssr.LoS.Data.BoundaryCircle
 * @class
 * @extends ssr.LoS.Data.Boundary
 * @prop {cc.Point}                                  center                    - The center of the boundary.
 * @prop {Number}                                    radius                    - The radius of the boundary.
 */
ssr.LoS.Data.BoundaryCircle = cc.Class( /** @lends ssr.LoS.Data.BoundaryCircle# */{
    name: "ssr.LoS.Data.BoundaryCircle",
    "extends": Boundary,
    /**
     * The constructor
     * @function
     * @param {cc.Point} center The center of the boundary. 
     * @param {Number} radius The radius of the boundary. 
     */
    ctor:function() {
        this._type = ssr.LoS.Constant.BOUNDARY_TYPE.CIRCLE;
        this._center = arguments[0];
        this._radius = arguments[1];
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
    }
});
