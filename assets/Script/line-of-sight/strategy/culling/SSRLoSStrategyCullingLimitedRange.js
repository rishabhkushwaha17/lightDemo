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
const CullingBase = require('./SSRLoSStrategyCullingBase');

/**
 * @classdesc Culling strategy class for <b>LIMITED_RANGE_XXX modes.</b>.
 * @class
 * @extends ssr.LoS.Strategy.Culling.Base
 */
ssr.LoS.Strategy.Culling.LimitedRange = cc.Class( /** @lends ssr.LoS.Strategy.Culling.LimitedRange# */ {
    name: "ssr.LoS.Strategy.Culling.LimitedRange",
    "extends": CullingBase,
    /**
     * Generate the boundary obstacle before culling.
     * @function
     * @abstract
     * @author supersuraccoon <supersuraccoon@gmail.com>
     */
    _preProcess:function() {
        // use the boundaryNode to generate a implicit obstacle for boundary
        if (this._losComponentCore.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY)) {
            var obstacle = this._losComponentCore.getBoundaryObstacle();
            obstacle.clearObstacleEdgeArray();
            obstacle.clearAnglePointArray();
            obstacle.clearPotentialBlockingEdgeArray();
        }
    }
});
