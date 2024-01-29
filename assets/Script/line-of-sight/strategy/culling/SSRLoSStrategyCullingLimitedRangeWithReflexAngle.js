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
 * @classdesc Culling strategy class for <b>LIMITED_RANGE_WITH_REFLEX_ANGLE mode only</b>.
 * @class
 * @extends ssr.LoS.Strategy.Culling.LimitedRange
 */
ssr.LoS.Strategy.Culling.LimitedRangeWithReflexAngle = cc.Class( /** @lends ssr.LoS.Strategy.Culling.LimitedRangeWithReflexAngle# */ {
    name: "ssr.LoS.Strategy.Culling.LimitedRangeWithReflexAngle",
    "extends": CullingLimitedRangeWithNonFullAngle,
    /**
     * Process the culling algorithm for the input edge.
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
            var sInclusionTestResult = ssr.LoS.Helper.pointReflexSectorInclusionTest(startPoint, sightBoundary);
            var eInclusionTestResult = ssr.LoS.Helper.pointReflexSectorInclusionTest(endPoint, sightBoundary);
            if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND) {
                // [1]
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT) {
                // [2]
                var intersections = ssr.LoS.Helper.segmentReflexSectorIntersect(startPoint, endPoint, sightBoundary);
                if (intersections.length > 0) {
                    // [2.2, 2.3]
                    obstacle.addPotentialBlockingEdge(edge);
                    for (var k = 0; k < intersections.length; k ++) {
                        var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                        obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                    }
                }
                else {
                    // [2.1]
                }
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [3]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if ((sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT) ||
                     (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                      eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND)) {
                // [4, 5]
                var sectorSEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[0]);
                var sectorEEdgeInteresectResult = ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, center, edges[1]);
                if (!sectorSEdgeInteresectResult && !sectorEEdgeInteresectResult) {
                    // [4/5.4]
                }
                else {
                    // [4/5.1, 4/5.2, 4/5.3]
                    var intersections = ssr.LoS.Helper.segmentReflexSectorIntersect(startPoint, endPoint, sightBoundary);
                    if (intersections.length > 0) {
                        // [4/5.2, 4/5.3]
                        obstacle.addPotentialBlockingEdge(edge);
                        for (var k = 0; k < intersections.length; k ++) {
                            var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                            obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                        }
                    }
                    else {
                        // [4/5.1]
                    }
                }
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [6]
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND) {
                // [7]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addPotentialBlockingEdge(edge);
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN) {
                // [8]
                obstacle.addEndPointAnglePoint(eHashCode, endPoint, edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
                //
                var intersections = ssr.LoS.Helper.segmentReflexSectorIntersect(startPoint, endPoint, sightBoundary);
                if (intersections.length > 0) {
                    obstacle.addPotentialBlockingEdge(edge);
                    for (var k = 0; k < intersections.length; k ++) {
                        var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                        obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                    }
                }
            }
            else if (sInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.IN && 
                     eInclusionTestResult === ssr.LoS.Constant.POINT_SECTOR_TEST.OUT) {
                // [9]
                obstacle.addEndPointAnglePoint(sHashCode, startPoint, edge, prevEdgeS, nextEdgeS);
                obstacle.addPotentialBlockingEdge(edge);
                //
                var intersections = ssr.LoS.Helper.segmentReflexSectorIntersect(startPoint, endPoint, sightBoundary);
                if (intersections.length > 0) {
                    obstacle.addPotentialBlockingEdge(edge);
                    for (var k = 0; k < intersections.length; k ++) {
                        var intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersections[k]);
                        obstacle.addBoundaryAnglePoint(intersectionHashCode, intersections[k], edge);
                    }
                }
            }
        }
    }
});
