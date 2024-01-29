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
 * ssr.LoS.Data.BoundaryRectangle
 * @class
 * @extends ssr.LoS.Data.Boundary
 * @prop {cc.Rect}                                  rectangle                    - The rectangle represents the boundary.
 * @prop {cc.Point}                                 topLeft                      - The top left of the boundary.
 * @prop {cc.Point}                                 topRight                     - The top right of the boundary.
 * @prop {cc.Point}                                 bottomRight                  - The bottom right of the boundary.
 * @prop {cc.Point}                                 bottomLeft                   - The bottom left of the boundary.
 */
ssr.LoS.Data.BoundaryRectangle = cc.Class( /** @lends ssr.LoS.Data.BoundaryRectangle# */ {
    name: "ssr.LoS.Data.BoundaryRectangle",
    "extends": Boundary,
    /**
     * The constructor
     * @function
     * @param {cc.Rect} rectangle The rectangle represents the boundary
     */
    ctor:function() {
        this._type = ssr.LoS.Constant.BOUNDARY_TYPE.RECTANGLE;
        this._rectangle = arguments[0];
        // 
        this._topLeft = cc.v2(this._rectangle.x, this._rectangle.y + this._rectangle.height);
        this._topRight = cc.v2(this._rectangle.x + this._rectangle.width, this._rectangle.y + this._rectangle.height);
        this._bottomRight = cc.v2(this._rectangle.x + this._rectangle.width, this._rectangle.y);
        this._bottomLeft = cc.v2(this._rectangle.x, this._rectangle.y);
    },
    /**
     * Get the rect of the boundary.
     * @function
     * @return {cc.Rect} The rect of the boundary. 
     */
    getRectangle:function() {
        return this._rectangle;   
    },
    /**
     * Get the top left of the boundary.
     * @function
     * @return {cc.Point} The top left of the boundary. 
     */
    getTopLeft:function() {
        return this._topLeft;
    },
    /**
     * Get the top right of the boundary.
     * @function
     * @return {cc.Point} The top right of the boundary. 
     */
    getTopRight:function() {
        return this._topRight;
    },
    /**
     * Get the bottom left of the boundary.
     * @function
     * @return {cc.Point} The bottom left of the boundary. 
     */
    getBottomLeft:function() {
        return this._bottomLeft;
    },
    /**
     * Get the bottom right of the boundary.
     * @function
     * @return {cc.Point} The bottom right of the boundary. 
     */
    getBottomRight:function() {
        return this._bottomRight;
    },
    /**
     * Get the top edge of the boundary.
     * @function
     * @return {Array.<cc.Point>} The top edge of the boundary. 
     */
    getTopEdge:function() {
        return [this.getTopLeft(), this.getTopRight()];
    },
    /**
     * Get the left edge of the boundary.
     * @function
     * @return {Array.<cc.Point>} The left edge of the boundary. 
     */
    getLeftEdge:function() {
        return [this.getBottomLeft(), this.getTopLeft()];
    },
    /**
     * Get the bottom edge of the boundary.
     * @function
     * @return {Array.<cc.Point>} The bottom edge of the boundary. 
     */
    getBottomEdge:function() {
        return [this.getBottomRight(), this.getBottomLeft()];
    },
    /**
     * Get the right edge of the boundary.
     * @function
     * @return {Array.<cc.Point>} The right edge of the boundary. 
     */
    getRightEdge:function() {
        return [this.getTopRight(), this.getBottomRight()];
    }
});
