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
 * @classdesc Tool strategy base class.
 * @class
 * @extends cc.Class
 */
ssr.LoS.Strategy.Tool.Base = cc.Class( /** @lends ssr.LoS.Strategy.Tool.Base# */ {
    name: "ssr.LoS.Strategy.Tool.Base",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core instance
     */
    ctor: function () {
        this._losComponentCore = arguments[0];
    },
    /**
     * Check if the given point is visible (within the visible area).
     * @function
     * @param {cc.Point} targetPoint The point to check.
     * @return {Boolean} True for visible, false for invisible.
     */
    isPointVisible:function(targetPoint) {
        var sourcePosition = this._losComponentCore.getPosition();
        var blockingEdgeArray = this._losComponentCore.getBlockingEdgeArray();
        for (var i = 0, l = blockingEdgeArray.length; i < l; i ++) {
            var blockingEdge = blockingEdgeArray[i];
            var testResult = ssr.LoS.Helper.segmentSegmentTest(
                sourcePosition, 
                targetPoint, 
                blockingEdge.getStartPoint(), 
                blockingEdge.getEndPoint()
            );
            if (testResult) {
                return false;
            }
        }
        return true;
    }
});
