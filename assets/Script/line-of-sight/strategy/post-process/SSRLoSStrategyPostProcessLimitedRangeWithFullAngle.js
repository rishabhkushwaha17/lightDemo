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
const PostProcessLimitedRange = require('./SSRLoSStrategyPostProcessLimitedRange');

/**
 * @classdesc Post process strategy class for <b>LIMITED_RANGE_WITH_FULL_ANGLE mode only </b>.
 * @class
 * @extends ssr.LoS.Strategy.PostProcess.LimitedRange
 */
ssr.LoS.Strategy.PostProcess.LimitedRangeWithFullAngle = cc.Class( /** @lends ssr.LoS.Strategy.PostProcess.LimitedRangeWithFullAngle# */ {
    name: "ssr.LoS.Strategy.PostProcess.LimitedRangeWithFullAngle",
    "extends": PostProcessLimitedRange,
    /**
     * Post process main entrance.
     * @function
     */
    process:function() {
        if (this._losComponentCore.getHitPointArray().length == 0) {
            // 正圆
            var verts = ssr.LoS.Helper.arcToSegments(this._losComponentCore.getPosition(), this._losComponentCore.getRadius(), 0, 360 * cc.macro.RAD, parseInt(360 * cc.macro.RAD * ssr.LoS.Constant.SEGMENT_PER_RADIANS), false);
            verts.pop();
            this._losComponentCore.getSightArea().push(verts);
        }
        else {
            this._super();
        }
    }
});
