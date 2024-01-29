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
const ProcessBase = require('./SSRLoSStrategyProcessBase');

/**
 * @classdesc Process strategy class for <b>UNLIMITED_RANGE mode only </b>.
 * @class
 * @extends ssr.LoS.Strategy.Process.Base
 */
ssr.LoS.Strategy.Process.UnlimitedRange = cc.Class( /** @lends ssr.LoS.Strategy.Process.UnlimitedRange# */ {
    name: "ssr.LoS.Strategy.Process.UnlimitedRange",
    "extends": ProcessBase,
    /**
     * Generate auxiliary angle point(s) if needed.
     * @function
     */
    generateAuxiliaryAnglePoint:function() {
        var sourcePosition = this._losComponentCore.getPosition();
        var obstacles = this._losComponentCore.getObstacles();
        for (var i = 0, l = obstacles.length; i < l; i ++) {
            var anglePointArray = obstacles[i].getAnglePointArray();
            for (var j = 0, ll = anglePointArray.length; j < ll; j ++) {
                var anglePoint = anglePointArray[j];
                if (anglePoint.getType() != ssr.LoS.Constant.ANGLE_POINT_TYPE.ENDPOINT) {
                    continue;
                }
                var auxiliaryAnglePointType = this._calculateAuxiliaryAnglePointType(anglePoint);
                if (auxiliaryAnglePointType == ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.PLUS ||
                    auxiliaryAnglePointType == ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.BOTH) {
                    var plusRay = ssr.LoS.Helper.generateAuxiliaryRay(
                        sourcePosition, 
                        anglePoint.getEndPoint(), 
                        ssr.LoS.Constant.IOTA_RADIANS_PLUS_COS, 
                        ssr.LoS.Constant.IOTA_RADIANS_PLUS_SIN, 
                        this._losComponentCore.getSightBoundary().getRectangle().width
                    );
                    var plusRayAnglePoint = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
                    plusRayAnglePoint.init(plusRay, [0], ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY);
                    obstacles[i].addAuxiliaryAnglePoint(plusRayAnglePoint);
                }
                if (auxiliaryAnglePointType == ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.MINUS ||
                    auxiliaryAnglePointType == ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.BOTH) {
                    var minusRay = ssr.LoS.Helper.generateAuxiliaryRay(
                        sourcePosition, 
                        anglePoint.getEndPoint(), 
                        ssr.LoS.Constant.IOTA_RADIANS_MINUS_COS, 
                        ssr.LoS.Constant.IOTA_RADIANS_MINUS_SIN, 
                        this._losComponentCore.getSightBoundary().getRectangle().width
                    );
                    var minusRayAnglePoint = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
                    minusRayAnglePoint.init(minusRay, [0], ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY);
                    obstacles[i].addAuxiliaryAnglePoint(minusRayAnglePoint);
                }
            }            
        }
    }
});



