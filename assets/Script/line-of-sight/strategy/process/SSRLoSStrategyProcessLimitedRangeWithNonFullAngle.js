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
const ProcessLimitedRange = require('./SSRLoSStrategyProcessLimitedRange');

/**
 * @classdesc Process strategy base class for <b>LIMITED_RANGE_WITH_NON_REFLEX_ANGLE mode only </b>.
 * @class
 * @extends ssr.LoS.Strategy.Process.LimitedRange
 */
ssr.LoS.Strategy.Process.LimitedRangeWithNonFullAngle = cc.Class( /** @lends ssr.LoS.Strategy.Process.LimitedRangeWithNonFullAngle# */ {
    name: "ssr.LoS.Strategy.Process.LimitedRangeWithNonFullAngle",
    "extends": ProcessLimitedRange,
    /**
     * Sort all the angle point by angle clockwisely.
     * @function
     */
	sortAnglePointArray:function() {
		this._super();
        var edges = this._losComponentCore.getSightBoundary().getEdges();
        var sourcePosition = this._losComponentCore.getPosition();
        var startAngle = ssr.LoS.Helper.pToAngle(edges[0], sourcePosition);
        var endAngle = ssr.LoS.Helper.pToAngle(edges[1], sourcePosition);
        if (startAngle > endAngle) {
            this._sortAnglePointArrayFromStartToEnd(startAngle, endAngle);
        }
	},
    /**
     * Check if the given angle point of an obstacle is collinear with one of the edges and the source
     * @function
     * @private
     * @param {Number} angleStart The angle of start edge.
     * @param {Number} angleEnd The angle of end edge.
     */
    _isAnglePointCollinearWithEdges:function(anglePoint) {
        var sourcePosition = this._losComponentCore.getPosition();
        var edge1 = this._losComponentCore.getSightBoundary().getEdges()[0];
        var edge2 = this._losComponentCore.getSightBoundary().getEdges()[1];
        if (ssr.LoS.Helper.isCollinearAndSameDirection(anglePoint.getEndPoint(), edge1, sourcePosition) || 
            ssr.LoS.Helper.isCollinearAndSameDirection(anglePoint.getEndPoint(), edge2, sourcePosition)) {
            return true;
        }
        else {
            return false;
        }
    }
});
