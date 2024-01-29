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
 * @classdesc Culling strategy class for <b>LIMITED_RANGE_WITH_FULL_ANGLE mode only</b>.
 * @class
 * @extends ssr.LoS.Strategy.Culling.LimitedRange
 */
ssr.LoS.Strategy.Culling.LimitedRangeWithFullAngle = cc.Class( /** @lends ssr.LoS.Strategy.Culling.LimitedRangeWithFullAngle# */ {
    name: "ssr.LoS.Strategy.Culling.LimitedRangeWithFullAngle",
    "extends": CullingLimitedRange,
    /**
     * Process the culling algorithm for the input edge.
     
     #### Broad Phase 1

        Test function: pointCircleInclusionTest

        Possibility: IN || ON || OUT

        Test Cases:

        | No.  | E.S  | E.E  |   E.S   |   E.E   |    E    |  B2  |  N1  |
        | :--: | :--: | :--: | :-----: | :-----: | :-----: | :--: | :--: |
        | [1]  |  IN  |  IN  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [2]  | OUT  | OUT  |    ×    |    ×    |    ?    |  √   |  ?   |
        | [3]  |  ON  |  ON  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [4]  |  IN  | OUT  | EAP + 1 |    ×    | PBE + 1 |  ×   |  √   |
        | [5]  | OUT  |  IN  |    ×    | EAP + 1 | PBE + 1 |  ×   |  √   |
        | [6]  |  IN  |  ON  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [7]  |  ON  |  IN  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [8]  |  ON  | OUT  |    ?    |    ×    |    ?    |  √   |  ?   |
        | [9]  | OUT  |  ON  |    ×    |    ?    |    ?    |  √   |  ?   |

    #### Broad Phase 2

        Test function: segmentCircleIntersectionTest

        Possibility: True || False

        Critical conditions:

        Tangent: False
        Only one end point on circle: False

        Test Cases:

        |  No.  |   E   |   E.S   |   E.E   |    E    |  N1  |
        | :---: | :---: | :-----: | :-----: | :-----: | :--: |
        | [2.1] | True  |    -    |    -    | PBE + 1 |  √   |
        | [2.2] | False |    -    |    -    |    ×    |  ×   |
        | [8.1] | True  | EAP + 1 |    -    | PBE + 1 |  √   |
        | [8.2] | False |    ×    |    -    |    ×    |  ×   |
        | [9.1] | True  |    -    | EAP + 1 | PBE + 1 |  √   |
        | [9.2] | False |    -    |    ×    |    ×    |  ×   |

    #### Narrow Phase

        Test function: segmentCircleIntersect

        Test Cases:

        |  No.  |    I    |
        | :---: | :-----: |
        | [2.1] | BAP + 2 |
        |  [4]  | BAP + 1 |
        |  [5]  | BAP + 1 |
        | [8.1] | BAP + 1 |
        | [9.1] | BAP + 1 |
     *
     * @function
     * @param {ssr.LoS.Data.Obstacle} obstacle The obstacle that the edge belongs to.
     * @param {String} sHashCode The start point hash code of the edge.
     * @param {String} eHashCode The end point hash code of the edge.
     * @param {ssr.LoS.Data.Edge} edge The edge being processed.
     * @param {ssr.LoS.Data.Edge|null} prevEdgeS The end point of the edge connected to the start point of the edge being processed.
     * @param {ssr.LoS.Data.Edge|null} nextEdgeS The start point of the edge connected to the start point of the edge being processed.
     * @param {ssr.LoS.Data.Edge|null} prevEdgeE The end point of the edge connected to the end point of the edge being processed.
     * @param {ssr.LoS.Data.Edge|null} nextEdgeE The start point of the edge connected to the end point of the edge being processed.
     */
    _processOneEdge:function(obstacle, sHashCode, eHashCode, edge, prevEdgeS, nextEdgeS, prevEdgeE, nextEdgeE) {
        var center = this._losComponentCore.getSightBoundary().getCenter();
        var radius = this._losComponentCore.getSightBoundary().getRadius();
        var startPoint = edge.getStartPoint();
        var endPoint = edge.getEndPoint();
        var sInclusionTestResult = ssr.LoS.Helper.pointCircleInclusionTest(startPoint, center, radius);
        var eInclusionTestResult = ssr.LoS.Helper.pointCircleInclusionTest(endPoint, center, radius);
        //
        if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.IN &&
            eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.IN) {
            // [1]
            obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT) {
            // [2]
            var edgeRectIntersectionResult = ssr.LoS.Helper.segmentCircleIntersectionTest(startPoint, endPoint, center, radius);
            if (edgeRectIntersectionResult) {
                // [2.1]
                obstacle.addPotentialBlockingEdge(edge);
                this._narrowTest(obstacle, edge);
            }
            else {
                // [2.2]
            }
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.ON &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.ON) {
            // [3]
            obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.IN &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT) {
            // [4]
            obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
            obstacle.addPotentialBlockingEdge(edge);
            this._narrowTest(obstacle, edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.IN) {
            // [5]
            obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
            this._narrowTest(obstacle, edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.IN &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.ON) {
            // [6]
            obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.ON &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.IN) {
            // [7]
            obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.ON) {
            // [8]
            var edgeRectIntersectionResult = ssr.LoS.Helper.segmentCircleIntersectionTest(startPoint, endPoint, center, radius);
            if (edgeRectIntersectionResult) {
                // [8.1]
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
                this._narrowTest(obstacle, edge);
            }
            else {
                // [8.2]
            }
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.ON &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT) {
            // [9]
            var edgeRectIntersectionResult = ssr.LoS.Helper.segmentCircleIntersectionTest(startPoint, endPoint, center, radius);
            if (edgeRectIntersectionResult) {
                // [9.1]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addPotentialBlockingEdge(edge);
                this._narrowTest(obstacle, edge);
            }
            else {
                // [9.2]
            }
        }
    },
    /**
     * Narrow phase test.
     * @function
     * @private
     * @param {ssr.LoS.Data.Obstacle} obstacle The obstacle that the edge belongs to.
     * @param {ssr.LoS.Data.Edge} edge The edge being processed.
     */
    _narrowTest:function(obstacle, edge) {
        var center = this._losComponentCore.getSightBoundary().getCenter();
        var radius = this._losComponentCore.getSightBoundary().getRadius();
        var startPoint = edge.getStartPoint();
        var endPoint = edge.getEndPoint();
        var intersections = ssr.LoS.Helper.segmentCircleIntersect(startPoint, endPoint, center, radius);
        if (intersections.length > 0) {
            var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[0]);
            obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[0], edge);
            if (intersections.length > 1) {
                intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[1]);
                obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[1], edge);
            }
        }
    }
});
