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
const PreProcessLimitedRange = require('./SSRLoSStrategyPreProcessLimitedRange');

/**
 * @classdesc Pre process strategy base class for <b>LIMITED_RANGE_WITH_FULL_ANGLE mode only</b>.
 * @class
 * @extends ssr.LoS.Strategy.PreProcess.LimitedRange
 */
ssr.LoS.Strategy.PreProcess.LimitedRangeWithFullAngle = cc.Class( /** @lends ssr.LoS.Strategy.PreProcess.LimitedRangeWithFullAngle# */ {
    name: "ssr.LoS.Strategy.PreProcess.LimitedRangeWithFullAngle",
    "extends": PreProcessLimitedRange,
    /**
     * Generate the boundary (circle). <br><br>
     * @function
     * @return {ssr.LoS.Data.Boundary} The generated boundary.
     * @see ssr.LoS.Component.Core#setRadius
     */
    generateBoundary: function() {
        return new ssr.LoS.Data.BoundaryCircle(
            this._losComponentCore.getPosition(), 
            this._losComponentCore.getRadius()
        );
    }
});
