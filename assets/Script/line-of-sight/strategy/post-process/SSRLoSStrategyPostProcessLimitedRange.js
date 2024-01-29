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
const PostProcessBase = require('./SSRLoSStrategyPostProcessBase');

/**
 * @classdesc Post process strategy class for <b>LIMITED_RANGE_XXX modes. </b>.
 * @class
 * @extends ssr.LoS.Strategy.PostProcess.Base
 */
ssr.LoS.Strategy.PostProcess.LimitedRange = cc.Class( /** @lends ssr.LoS.Strategy.PostProcess.LimitedRangeWith# */ {
    name: "ssr.LoS.Strategy.PostProcess.LimitedRange",
    "extends": PostProcessBase,
    /**
     * Post process main entrance.
     * @function
     */
    process:function() {
        var blockingEdgeMap = {};
        var sourcePosition = this._losComponentCore.getPosition();
        var radius = this._losComponentCore.getRadius();
        var centralAngle = this._losComponentCore.getCentralAngle();
        var potentialBlockingEdgeMap = this._losComponentCore.getPotentialBlockingEdgeMap();
        var blockingEdgeArray = this._losComponentCore.getBlockingEdgeArray();
        var visibleEdgeArray = this._losComponentCore.getVisibleEdgeArray();
        var hitPointArray = this._losComponentCore.getHitPointArray();
        var sightArea = this._losComponentCore.getSightArea();

        if (centralAngle == ssr.LoS.Constant.FULL_ANGLE) {
            hitPointArray.push(hitPointArray[0]);
        }
        var preHitPoint = hitPointArray[0];
        for (var i = 1, l = hitPointArray.length; i < l; i ++) {
            var currentHitPoint = hitPointArray[i];
            var sameEdgeID = ssr.LoS.Helper.getSameEdgeID(preHitPoint, currentHitPoint);
            if (sameEdgeID != 0) {
                visibleEdgeArray.push(
                    [
                        preHitPoint.getHitPoint(),
                        currentHitPoint.getHitPoint()
                    ]
                );
                if (!blockingEdgeMap[sameEdgeID.toString()]) {
                    blockingEdgeMap[sameEdgeID.toString()] = sameEdgeID;
                    blockingEdgeArray.push(potentialBlockingEdgeMap[sameEdgeID.toString()]);
                }
            }

            var relation = ssr.LoS.Helper.segmentOrArc(preHitPoint, currentHitPoint);
            if (relation == ssr.LoS.Constant.HIT_POINT_CONNECTION.ARC) {
                // 加入圆弧
                var diff = ssr.LoS.Helper.radiansBetweenAngle(preHitPoint.getAngle(), currentHitPoint.getAngle());
                var segments = Math.ceil(diff * ssr.LoS.Constant.SEGMENT_PER_RADIANS);
                if (segments <= 1) {
                    // 两个点太近了，直接作为端点保存
                    sightArea.push(
                        [
                            preHitPoint.getHitPoint(),
                            currentHitPoint.getHitPoint()
                        ]       
                    );
                }
                else {
                    if (diff > Math.PI) {
                        // 大于 180°，先绘制一个半圆，避免形成凹多边形
                        var diffLeft = (diff - Math.PI);
                        diff = Math.PI;
                        segments = Math.ceil(diff * ssr.LoS.Constant.SEGMENT_PER_RADIANS);
                        var verts = ssr.LoS.Helper.arcToSegments(sourcePosition, radius, preHitPoint.getAngle(), diff, segments, false);
                        sightArea.push(verts);

                        // left
                        segments = Math.ceil(diffLeft * ssr.LoS.Constant.SEGMENT_PER_RADIANS);
                        verts = ssr.LoS.Helper.arcToSegments(sourcePosition, radius, preHitPoint.getAngle() + Math.PI, diffLeft, segments, false);
                        sightArea.push(verts);
                    }
                    else {
                        var verts = ssr.LoS.Helper.arcToSegments(this._losComponentCore.getPosition(), radius, preHitPoint.getAngle(), diff, segments, false);
                        sightArea.push(verts);
                    }   
                }
            }
            else {
                sightArea.push(
                    [
                        preHitPoint.getHitPoint(),
                        currentHitPoint.getHitPoint()
                    ]       
                );
            }
            preHitPoint = currentHitPoint;
        }
        if (centralAngle == ssr.LoS.Constant.FULL_ANGLE) {
            hitPointArray.pop();
        }
    }
});
