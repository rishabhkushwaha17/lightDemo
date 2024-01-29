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
const CullingLimitedRangeWithNonFullAngle = require('./SSRLoSStrategyCullingLimitedRangeWithNonFullAngle');

/**
 * @classdesc Culling strategy class for <b>LIMITED_RANGE_WITH_NON_REFLEX_ANGLE mode only</b>.
 * @class
 * @extends ssr.LoS.Strategy.Culling.LimitedRange
 */
ssr.LoS.Strategy.Culling.LimitedRangeWithNonReflexAngle = cc.Class( /** @lends ssr.LoS.Strategy.Culling.LimitedRangeWithNonReflexAngle# */ {
    name: "ssr.LoS.Strategy.Culling.LimitedRangeWithNonReflexAngle",
    "extends": CullingLimitedRangeWithNonFullAngle,
    /**
     * Process the culling algorithm for the input edge.
    
     #### Broad Phase 1

        Test function: segmentCircleIntersectionTest

        Possibility: True || False

     #### Broad Phase 2

        Test function: pointNonReflexSectorInclusionTest

        Possibility: BEHIND || IN || OUT || FRONT

        Critical conditions:

        End point on sector center => BEHIND
        End point on arc => IN
        End point on edges => FRONT
        End point on arc && edge intersection => FRONT

        Test Cases:

        | No.  |  E.S   |  E.E   |   E.S   |   E.E   |    E    |  B2  |  N1  |
        | :--: | :----: | :----: | :-----: | :-----: | :-----: | :--: | :--: |
        | [1]  | BEHIND | BEHIND |    ×    |    ×    |    ×    |  ×   |  ×   |
        | [2]  |  OUT   |  OUT   |    ×    |    ×    |    ?    |  √   |  ?   |
        | [3]  |   IN   |   IN   | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [4]  | FRONT  | FRONT  |    ×    |    ×    |    ?    |  √   |  ?   |
        | [5]  | BEHIND |  OUT   |    ×    |    ×    |    ?    |  √   |  ?   |
        | [6]  |  OUT   | BEHIND |    ×    |    ×    |    ?    |  √   |  ?   |
        | [7]  | BEHIND |   IN   |    ×    | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [8]  |   IN   | BEHIND | EAP + 1 |    ×    | PBE + 1 |  ×   |  ×   |
        | [9]  | BEHIND | FRONT  |    ×    |    ×    |    ?    |  √   |  ?   |
        | [10] | FRONT  | BEHIND |    ×    |    ×    |    ?    |  √   |  ?   |
        | [11] |  OUT   |   IN   |    ×    | EAP + 1 | PBE + 1 |  √   |  ?   |
        | [12] |   IN   |  OUT   | EAP + 1 |    ×    | PBE + 1 |  √   |  ?   |
        | [13] |  OUT   | FRONT  |    ×    |    ×    |    ?    |  √   |  ?   |
        | [14] | FRONT  |  OUT   |    ×    |    ×    |    ?    |  √   |  ?   |
        | [15] |   IN   | FRONT  | EAP + 1 |    ×    | PBE + 1 |  ×   |  ×   |
        | [16] | FRONT  |   IN   |    ×    | EAP + 1 | PBE + 1 |  ×   |  ×   |


     #### Broad Phase 3

        Test function: segmentSegmentTest

        Possibility: True || False

        |    No.    | E-SS  | E-SE  | E.S  | E.E  |  E   |  N1  |
        | :-------: | :---: | :---: | :--: | :--: | :--: | :--: |
        |   [2.1]   | True  | True  |  -   |  -   |  √   |  ×   |
        |   [2.2]   | True  | False |  -   |  -   |  ?   |  √   |
        |   [2.3]   | False | True  |  -   |  -   |  ?   |  √   |
        |   [2.4]   | False | False |  -   |  -   |  ?   |  √   |
        |   [4.1]   | True  | True  |  -   |  -   |  √   |  ×   |
        |   [4.2]   | True  | False |  -   |  -   |  ×   |  ×   |
        |   [4.3]   | False | True  |  -   |  -   |  ×   |  ×   |
        |   [4.4]   | False | False |  -   |  -   |  ×   |  ×   |
        |  [5/6.1]  | True  | True  |  -   |  -   |  √   |  ×   |
        |  [5/6.2]  | True  | False |  -   |  -   |  √   |  √   |
        |  [5/6.3]  | False | True  |  -   |  -   |  √   |  √   |
        |  [5/6.4]  | False | False |  -   |  -   |  ×   |  ×   |
        | [9/10.1]  | True  | True  |  -   |  -   |  √   |  ×   |
        | [9/10.2]  | True  | False |  -   |  -   |  ×   |  ×   |
        | [9/10.3]  | False | True  |  -   |  -   |  ×   |  ×   |
        | [9/10.4]  | False | False |  -   |  -   |  ×   |  ×   |
        | [11/12.1] | True  | True  |  -   |  -   |  -   |  ×   |
        | [11/12.2] | True  | False |  -   |  -   |  -   |  ×   |
        | [11/12.3] | False | True  |  -   |  -   |  -   |  ×   |
        | [11/12.4] | False | False |  -   |  -   |  -   |  √   |
        | [13/14.1] | True  | True  |  -   |  -   |  √   |  ×   |
        | [13/14.2] | True  | False |  -   |  -   |  √   |  √   |
        | [13/14.3] | False | True  |  -   |  -   |  √   |  √   |
        | [13/14.4] | False | False |  -   |  -   |  ×   |  ×   |

     #### Narrow Phase

        Test function: segmentNonReflexSectorIntersect

        |      No.      |  I   |  E   | BAP  |
        | :-----------: | :--: | :--: | :--: |
        |   [2.2/3.1]   |  0   |  ×   |  -   |
        |   [2.2/3.2]   |  1   |  √   |  1   |
        |   [2.2/3.3]   |  2   |  √   |  2   |
        |    [2.4.1]    |  0   |  ×   |  -   |
        |    [2.4.2]    |  1   |  -   |  1   |
        |    [2.4.3]    |  2   |  √   |  2   |
        |  [5/6.2/3.1]  |  0   |  -   |  -   |
        |  [5/6.2/3.2]  |  1   |  -   |  1   |
        |  [5/6.2/3.3]  |  2   |  -   |  -   |
        |  [11/12.4.1]  |  0   |  -   |  -   |
        |  [11/12.4.2]  |  1   |  -   |  1   |
        |  [11/12.4.3]  |  2   |  -   |  -   |
        | [13/14.2/3.1] |  0   |  -   |  0   |
        | [13/14.2/3.2] |  1   |  -   |  1   |
        | [13/14.2/3.3] |  2   |  -   |  -   |
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
        var startPoint = edge.getStartPoint();
        var endPoint = edge.getEndPoint();
        var sightBoundary = this._losComponentCore.getSightBoundary();
        var center = sightBoundary.getCenter();
        var radius = sightBoundary.getRadius();
        var edges = sightBoundary.getEdges();

        var edgeRectIntersectionResult = ssr.LoS.Helper.segmentCircleIntersectionTest(startPoint, endPoint, center, radius);
        if (edgeRectIntersectionResult) {
            var sInclusionTestResult = ssr.LoS.Helper.pointNonReflexSectorInclusionTest(startPoint, sightBoundary);
            var eInclusionTestResult = ssr.LoS.Helper.pointNonReflexSectorInclusionTest(endPoint, sightBoundary);
            if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND) {
                // [1]
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT) {
                // [2]
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                if (!sectorSEdgeInteresectResult) {
                    // [2.3, 2.4]
                }
                else {
                    // [2.1, 2.2]
                    var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);
                    if (sectorEEdgeInteresectResult) {
                        // [2.1]
                        obstacle.addPotentialBlockingEdge(edge);
                        return;
                    }
                }
                // [2.2, 2.3, 2.4]
                var intersections = ssr.LoS.Helper.segmentNonReflexSectorIntersect(startPoint, endPoint, sightBoundary);
                if (intersections.length > 0) {
                    // [2.2.2, 2.2.3, 2.3.2, 2.3.3, 2.4.3]
                    obstacle.addPotentialBlockingEdge(edge);
                    for (var k = 0; k < intersections.length; k ++) {
                        var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                        obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                    }
                }
                // [2.2.1, 2.3.1, 2.4.1, 2.4.2]
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [3]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS); 
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE); 
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT) {
                // [4]
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                if (!sectorSEdgeInteresectResult) {
                    // [4.3, 4.4]
                }
                else {
                    // [4.1, 4.2]
                    var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);
                    if (sectorEEdgeInteresectResult) {
                        // [4.1]
                        obstacle.addPotentialBlockingEdge(edge);
                        return;
                    }
                }
            }
            else if ((sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT) ||
                     (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND)) {
                // [5, 6]
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);

                if (sectorSEdgeInteresectResult || sectorEEdgeInteresectResult) {
                    // [5.1, 5.2, 5.3, 6.1, 6.2, 6.3]
                    // 这里有一个特例，边和扇形的某边共线的情况，测试结果是 1边，这里要把它剔除掉
                    if (ssr.LoS.Helper.isCollinear(startPoint, endPoint, edges[0]) ||
                        ssr.LoS.Helper.isCollinear(startPoint, endPoint, edges[1])) {
                        return;
                    }
                    obstacle.addPotentialBlockingEdge(edge);
                    if (!(sectorSEdgeInteresectResult && sectorEEdgeInteresectResult)) {
                        // [5.2, 5.3, 6.2 ,6.3]
                        var intersections = ssr.LoS.Helper.segmentNonReflexSectorIntersect(startPoint, endPoint, sightBoundary, true);
                        if (intersections.length > 0) {
                            // [5.2.2, 5.3.2, 6.2.2, 6.3.2]
                            for (var k = 0; k < intersections.length; k ++) {
                                var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                                obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                            }
                        }
                    }
                    // [5.1, 6.1]
                }
                else {
                    // [5.4, 6.4]
                }
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [7]
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND) {
                // [8]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if ((sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT) ||
                     (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND)) {
                // [9, 10]
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);
                if (sectorSEdgeInteresectResult && sectorEEdgeInteresectResult) {
                    // [9.1, 10.1]
                    obstacle.addPotentialBlockingEdge(edge);
                }
                // [9.2, 9.3, 9.3, 10.2, 10.3, 10.4]
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT) {
                // [11]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addPotentialBlockingEdge(edge);

                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                if (sectorSEdgeInteresectResult) {
                    // [11.1, 11.2, 11.3, 12.1, 12.2, 12.3]
                    return;
                }
                var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);
                if (sectorEEdgeInteresectResult) {
                    return;
                }
                var intersections = ssr.LoS.Helper.segmentNonReflexSectorIntersect(startPoint, endPoint, sightBoundary, true);
                if (intersections.length > 0) {
                    for (var k = 0; k < intersections.length; k ++) {
                        var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                        obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                    }
                }
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [12]
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
                //
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                if (sectorSEdgeInteresectResult) {
                    return;
                }
                var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);
                if (sectorEEdgeInteresectResult) {
                    return;
                }
                var intersections = ssr.LoS.Helper.segmentNonReflexSectorIntersect(startPoint, endPoint, sightBoundary, true);
                if (intersections.length > 0) {
                    for (var k = 0; k < intersections.length; k ++) {
                        var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                        obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                    }
                }
            }
            else if ((sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT) ||
                     (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT)) {
                // [13, 14]
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);

                if (sectorSEdgeInteresectResult || sectorEEdgeInteresectResult) {
                    // [13.1, 13.2, 13.3, 14.1, 14,2, 14.3]
                    obstacle.addPotentialBlockingEdge(edge);
                    if (!(sectorSEdgeInteresectResult && sectorEEdgeInteresectResult)) {
                        // [13.2, 13.3, 14,2, 14.3]
                        var intersections = ssr.LoS.Helper.segmentNonReflexSectorIntersect(startPoint, endPoint, sightBoundary);
                        if (intersections.length > 0) {
                            // [13.2.2, 13.3.2, 14.2.2, 14.3.2]
                            for (var k = 0; k < intersections.length; k ++) {
                                var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                                obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                            }
                        }
                        // [13.2.1, 13.3.1, 14.2.1, 14.3.1]
                    }
                    // [13.1, 14.1]
                }
                else {
                    // [13.4, 14.4]
                }
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT) {
                // [15]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [16]
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
            }
        }
        // prune
    }
});
