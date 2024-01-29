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
 * @classdesc Post process strategy class for <b>UNLIMITED_RANGE mode only </b>.
 * @class
 * @extends ssr.LoS.Strategy.PostProcess.Base
 */
ssr.LoS.Strategy.PostProcess.UnlimitedRange = cc.Class( /** @lends ssr.LoS.Strategy.PostProcess.UnlimitedRange# */ {
    name: "ssr.LoS.Strategy.PostProcess.UnlimitedRange",
    "extends": PostProcessBase,
    /**
     * Post process main entrance.
     * @function
     */
    process:function() {
        var hitPointArray = this._losComponentCore.getHitPointArray();
        if (hitPointArray.length <= 0) {
            return;
        }
        var blockingEdgeMap = {};
        var potentialBlockingEdgeMap = this._losComponentCore.getPotentialBlockingEdgeMap();
        var blockingEdgeArray = this._losComponentCore.getBlockingEdgeArray();
        var visibleEdgeArray = this._losComponentCore.getVisibleEdgeArray();
        var sightArea = this._losComponentCore.getSightArea();
        hitPointArray.push(hitPointArray[0]);
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
            sightArea.push(
                [
                    preHitPoint.getHitPoint(),
                    currentHitPoint.getHitPoint()
                ]       
            );
            preHitPoint = currentHitPoint;
        }
        hitPointArray.pop();
    }
});
