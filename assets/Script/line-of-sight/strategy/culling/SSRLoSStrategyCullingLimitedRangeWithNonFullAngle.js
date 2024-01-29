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
const CullingLimitedRange = require('./SSRLoSStrategyCullingLimitedRange');

/**
 * @classdesc Culling strategy class for <b>LIMITED_RANGE_WITH_NON_REFLEX_ANGLE mode only</b>.
 * @class
 * @extends ssr.LoS.Strategy.Culling.LimitedRange
 */
ssr.LoS.Strategy.Culling.LimitedRangeWithNonFullAngle = cc.Class( /** @lends ssr.LoS.Strategy.Culling.LimitedRangeWithNonFullAngle# */ {
    name: "ssr.LoS.Strategy.Culling.LimitedRangeWithNonFullAngle",
    "extends": CullingLimitedRange,
    /**
     * Generate the boundary obstacle before culling.
     * @function
     * @abstract
     */
    _preProcess:function() {
        // use the boundaryNode to generate a implicit obstacle for boundary
        if (this._losComponentCore.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY)) {
            var obstacle = this._losComponentCore.getBoundaryObstacle();
            obstacle.clearAnglePointArray();
            obstacle.clearPotentialBlockingEdgeArray();
            // process the two edges of the sector
            var sightBoundary = this._losComponentCore.getSightBoundary();
            var edges = sightBoundary.getEdges();
            var sEdge = edges[0];
            var sHashCode = ssr.LoS.Helper.pointToHashCode(sEdge);
            var anglePointStart = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
            anglePointStart.init(sEdge, [0], ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY);
            obstacle.addAnglePoint(sHashCode, anglePointStart);
            var eEdge = edges[1];
            var eHashCode = ssr.LoS.Helper.pointToHashCode(eEdge);
            var anglePointEnd = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
            anglePointEnd.init(eEdge, [0], ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY);
            obstacle.addAnglePoint(eHashCode, anglePointEnd);
        }
    }
});
