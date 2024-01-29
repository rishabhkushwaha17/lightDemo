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
const CullingBase = require('./SSRLoSStrategyCullingBase');

/**
 * @classdesc Culling strategy class for <b>UNLIMITED_RANGE mode only </b>.
 * @class
 * @extends ssr.LoS.Strategy.Culling.Base
 */
ssr.LoS.Strategy.Culling.UnlimitedRange = cc.Class( /** @lends ssr.LoS.Strategy.Culling.UnlimitedRange# */ {
    name: "ssr.LoS.Strategy.Culling.UnlimitedRange",
    "extends": CullingBase,
    /**
     * Generate the boundary obstacle before culling.
     * @function
     * @abstract
     */
    _preProcess:function() {
        // use the boundaryNode to generate a implicit obstacle for boundary
        if (this._losComponentCore.getDirtyFlag(ssr.LoS.Constant.DIRTY_FLAGS.BOUNDARY)) {
            var obstacle = this._losComponentCore.getBoundaryObstacle();
            obstacle.clearObstacleEdgeArray();
            obstacle.clearAnglePointArray();
            obstacle.clearPotentialBlockingEdgeArray();
            // generate angle points and potential blocking edges directly
            var edgeArray = this._extractSightBoundaryEdges();
            for (var i = 0, l = edgeArray.length; i < l; i ++) {
                var edge = edgeArray[i];
                var startPoint = edge.getStartPoint();
                var prevEdgeS = (i == 0 ? edgeArray[l - 1] : edgeArray[i - 1]);
                var nextEdgeS = edge;
                var sHashCode = ssr.LoS.Helper.pointToHashCode(startPoint);
                var anglePoint = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.AnglePoint);
                anglePoint.init(startPoint, [prevEdgeS.getEdgeID(), nextEdgeS.getEdgeID()], ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY);
                obstacle.addObstacleEdge(edge);
                obstacle.addAnglePoint(sHashCode, anglePoint);
                obstacle.addPotentialBlockingEdge(edge);
            }
        }
    },
    /**
     * Process the culling algorithm for the input edge.

    #### Broad Phase 1
        
        Test function: pointRetangleInclusionTest

        Possibility: IN || ON || OUT

        Critical conditions:

        Edge end point at rectangle conner: ON

        Test Cases:

        |      | E.S  | E.E  |   E.S   |   E.E   |    E    |  B2  |  B3  |  N1  |
        | :--: | :--: | :--: | :-----: | :-----: | :-----: | :--: | :--: | :--: |
        | [1]  |  IN  |  IN  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |  ×   |
        | [2]  |  ON  |  ON  |    ?    |    ?    |    ?    |  √   |  ×   |  ×   |
        | [3]  | OUT  | OUT  |    ×    |    ×    |    ?    |  √   |  ?   |  ?   |
        | [4]  |  IN  | OUT  | EAP + 1 |    ×    | PBE + 1 |  ×   |  ×   |  √   |
        | [5]  | OUT  |  IN  |    ×    | EAP + 1 | PBE + 1 |  ×   |  ×   |  √   |
        | [6]  |  IN  |  ON  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |  ×   |
        | [7]  |  ON  |  IN  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |  ×   |
        | [8]  |  ON  | OUT  |    ?    |    ×    |    ?    |  √   |  ?   |  ?   |
        | [9]  | OUT  |  ON  |    ×    |    ?    |    ?    |  √   |  ?   |  ?   |

    #### Broad Phase 2

        Test function: segmentOnSameRectangleEdgeTest

        Possibility: TRUE || FALSE

        Test Cases:

        |       |   R   |   E.S   |   E.E   |    E    |  B3  |  N1  |
        | :---: | :---: | :-----: | :-----: | :-----: | :--: | :--: |
        | [2.1] | True  | EAP + 1 | EAP + 1 | PBE + 1 |  ×   |  ×   |
        | [2.2] | False |    ×    |    ×    |    ×    |  ×   |  ×   |
        | [3.1] | True  |    -    |    -    |    ×    |  ×   |  ×   |
        | [3.2] | False |    -    |    -    |    ?    |  √   |  ?   |
        | [8.1] | True  |    ×    |    -    |    ×    |  ×   |  ×   |
        | [8.2] | False |    ?    |    -    |    ?    |  √   |  ?   |
        | [9.1] | True  |    -    |    ×    |    ×    |  ×   |  ×   |
        | [9.2] | False |    -    |    ?    |    ?    |  √   |  ?   |


    #### Broad Phase 3

        Test function: segmentRetangleDiagonalLineIntersectionTest

        Possibility: TRUE || FALSE

        Test Cases: 

        |         |   R   | E.S  | E.E  |    E    |  N1  |
        | :-----: | :---: | :--: | :--: | :-----: | :--: |
        | [3.2.1] | True  |  -   |  -   | PBE + 1 |  √   |
        | [3.2.2] | False |  -   |  -   |    ×    |  ×   |
        | [8.2.1] | True  |  √   |  -   |    √    |  √   |
        | [8.2.2] | False |  ×   |  -   |    ×    |  ×   |
        | [9.2.1] | True  |  -   |  √   |    √    |  √   |
        | [9.2.2] | False |  -   |  ×   |    ×    |  ×   |


    #### Narrow Phase

        Test function: segmentSegmentIntersect

        Test Case

        |         |    I    |
        | :-----: | :-----: |
        | [3.2.1] | BAP + 2 |
        |   [4]   | BAP + 1 |
        |   [5]   | BAP + 1 |
        | [8.2.1] | BAP + 1 |
        | [9.2.1] | BAP + 1 |
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
        var rectangle = this._losComponentCore.getSightBoundary().getRectangle();
        var sInclusionTestResult = ssr.LoS.Helper.pointRetangleInclusionTest(edge.getStartPoint(), rectangle);
        var eInclusionTestResult = ssr.LoS.Helper.pointRetangleInclusionTest(edge.getEndPoint(), rectangle);
        
        if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.IN &&
            eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.IN) {
            // [1]
            obstacle.addEndPointAnglePoint(sHashCode, edge.getStartPoint(), edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, edge.getEndPoint(), edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.ON &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.ON) {
            // [2]
            if (ssr.LoS.Helper.segmentOnSameRectangleEdgeTest(edge.getStartPoint(), edge.getEndPoint(), rectangle)) {
                // [2.1]
                // prune
            }
            else {
                // [2.2]
                obstacle.addEndPointAnglePoint(sHashCode, edge.getStartPoint(), edge, prevEdgeS, nextEdgeS);
                obstacle.addEndPointAnglePoint(eHashCode, edge.getEndPoint(), edge, prevEdgeE, nextEdgeE);
                obstacle.addPotentialBlockingEdge(edge);
            }
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.OUT &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.OUT) {
            // [3]
            if (ssr.LoS.Helper.segmentOnSameRectangleEdgeTest(edge.getStartPoint(), edge.getEndPoint(), rectangle)) {
                // [3.1]
                // prune
            }
            else {
                // [3.2]
                var edgeRectIntersectionResult = ssr.LoS.Helper.segmentRetangleDiagonalLineIntersectionTest(
                    edge.getStartPoint(), 
                    edge.getEndPoint(), 
                    this._losComponentCore.getSightBoundary().getTopLeft(), 
                    this._losComponentCore.getSightBoundary().getTopRight(), 
                    this._losComponentCore.getSightBoundary().getBottomRight(), 
                    this._losComponentCore.getSightBoundary().getBottomLeft()
                );
                if (edgeRectIntersectionResult) {
                    // [3.2.1]
                    obstacle.addPotentialBlockingEdge(edge);
                    this._narrowTest(obstacle, edge, 2);
                }
                else {
                    // [3.2.2]
                    // prune
                }
            }
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.IN &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.OUT) {
            // [4]
            obstacle.addEndPointAnglePoint(sHashCode, edge.getStartPoint(), edge, prevEdgeS, nextEdgeS);
            obstacle.addPotentialBlockingEdge(edge);
            this._narrowTest(obstacle, edge, 1);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.OUT &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.IN) {
            // [5]
            obstacle.addEndPointAnglePoint(eHashCode, edge.getEndPoint(), edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
            this._narrowTest(obstacle, edge, 1);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.IN &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.ON) {
            // [6]
            obstacle.addEndPointAnglePoint(sHashCode, edge.getStartPoint(), edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, edge.getEndPoint(), edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.ON &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.IN) {
            // [7]
            obstacle.addEndPointAnglePoint(sHashCode, edge.getStartPoint(), edge, prevEdgeS, nextEdgeS);
            obstacle.addEndPointAnglePoint(eHashCode, edge.getEndPoint(), edge, prevEdgeE, nextEdgeE);
            obstacle.addPotentialBlockingEdge(edge);
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.OUT &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.ON) {
            // [8]
            if (ssr.LoS.Helper.segmentOnSameRectangleEdgeTest(edge.getStartPoint(), edge.getEndPoint(), rectangle)) {
                // [8.1]
                // prune
            }
            else {
                // [8.2]
                var edgeRectIntersectionResult = ssr.LoS.Helper.segmentRetangleDiagonalLineIntersectionTest(
                    edge.getStartPoint(), 
                    edge.getEndPoint(), 
                    this._losComponentCore.getSightBoundary().getTopLeft(), 
                    this._losComponentCore.getSightBoundary().getTopRight(), 
                    this._losComponentCore.getSightBoundary().getBottomRight(), 
                    this._losComponentCore.getSightBoundary().getBottomLeft()
                );
                if (edgeRectIntersectionResult) {
                    // [8.2.1]
                    obstacle.addEndPointAnglePoint(eHashCode, edge.getEndPoint(), edge, prevEdgeE, nextEdgeE);
                    obstacle.addPotentialBlockingEdge(edge);
                    //
                    var pointOnBoundaryEdgeArray = this._getPointOnBoundaryEdges(edge.getEndPoint());
                    this._narrowTest(obstacle, edge, 1, pointOnBoundaryEdgeArray);
                }
                else {
                    // [8.2.2]
                    // prune
                }
            }
        }
        else if (sInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.ON &&
                 eInclusionTestResult == ssr.LoS.Constant.POINT_RECT_TEST.OUT) {
            // [9]
            if (ssr.LoS.Helper.segmentOnSameRectangleEdgeTest(edge.getStartPoint(), edge.getEndPoint(), rectangle)) {
                // [9.1]
                // prune
            }
            else {
                // [9.2]
                var edgeRectIntersectionResult = ssr.LoS.Helper.segmentRetangleDiagonalLineIntersectionTest(
                    edge.getStartPoint(), 
                    edge.getEndPoint(), 
                    this._losComponentCore.getSightBoundary().getTopLeft(), 
                    this._losComponentCore.getSightBoundary().getTopRight(), 
                    this._losComponentCore.getSightBoundary().getBottomRight(), 
                    this._losComponentCore.getSightBoundary().getBottomLeft()
                );
                if (edgeRectIntersectionResult) {
                    // [9.2.1]
                    obstacle.addEndPointAnglePoint(sHashCode, edge.getStartPoint(), edge, prevEdgeS, nextEdgeS);
                    obstacle.addPotentialBlockingEdge(edge);
                    //
                    var pointOnBoundaryEdgeArray = this._getPointOnBoundaryEdges(edge.getStartPoint());
                    this._narrowTest(obstacle, edge, 1, pointOnBoundaryEdgeArray);
                }
                else {
                    // [9.2.2]
                    // prune
                }
            }
        }
        else {
            cc.error("ssr.LoS.Strategy.Culling.UnlimitedRange._processOneEdge something weird happened !!!");
        }
    },
    /**
     * Return the type of edges of the boundary that a given point is on.
     * @function
     * @private
     * @param {cc.Point} point The point to check.
     * @return {Array.<ssr.LoS.Constant.BOUNDARY_EDGE>} The edge type array.
     */
    _getPointOnBoundaryEdges:function(point) {
        var pointOnBoundaryEdgeArray = [];
        // top
        if (point.y == this._losComponentCore.getSightBoundary().getTopRight().y) {
            pointOnBoundaryEdgeArray.push(ssr.LoS.Constant.BOUNDARY_EDGE.TOP);
        }
        // right
        if (point.x == this._losComponentCore.getSightBoundary().getTopRight().x) {
            pointOnBoundaryEdgeArray.push(ssr.LoS.Constant.BOUNDARY_EDGE.RIGHT);
        }
        // bottom
        if (point.y == this._losComponentCore.getSightBoundary().getBottomRight().y) {
            pointOnBoundaryEdgeArray.push(ssr.LoS.Constant.BOUNDARY_EDGE.BUTTOM);
        }
        // left
        if (point.x == this._losComponentCore.getSightBoundary().getBottomLeft().x) {
            pointOnBoundaryEdgeArray.push(ssr.LoS.Constant.BOUNDARY_EDGE.LEFT);
        }
        return pointOnBoundaryEdgeArray;
    },
    /**
     * Get the edge of the boundary based on the give edge type.
     * @function
     * @private
     * @param {ssr.LoS.Constant.BOUNDARY_EDGE} edgeType The edge type.
     * @return {Array.<cc.Point>} The edge of the boudary.
     */
    _getSightBoundaryEdge:function(edgeType) {
        if (edgeType == ssr.LoS.Constant.BOUNDARY_EDGE.TOP) {
            return this._losComponentCore.getSightBoundary().getTopEdge();
        }
        else if (edgeType == ssr.LoS.Constant.BOUNDARY_EDGE.RIGHT) {
            return this._losComponentCore.getSightBoundary().getRightEdge();
        }
        else if (edgeType == ssr.LoS.Constant.BOUNDARY_EDGE.BUTTOM) {
            return this._losComponentCore.getSightBoundary().getBottomEdge();
        }
        else {
            // edgeType == ssr.LoS.Constant.BOUNDARY_EDGE.LEFT
            return this._losComponentCore.getSightBoundary().getLeftEdge();
        }
    },
    /**
     * Narrow phase test.
     * @function
     * @private
     * @param {ssr.LoS.Data.Obstacle} obstacle The obstacle that the edge belongs to.
     * @param {ssr.LoS.Data.Edge} edge The edge being processed.
     * @param {Number} expectIntersectionCount The number intesections that are expected to be found.
     * @param {Array.<ssr.LoS.Constant.BOUNDARY_EDGE>} [skipEdgeTypeArray=undefined] The edge types that can be skipped when doing the narrow test.
     */
    _narrowTest:function(obstacle, edge, expectIntersectionCount, skipEdgeTypeArray) {
        var s = edge.getStartPoint();
        var e = edge.getEndPoint();
        var checkSightBoundaryEdgeArray = [
            ssr.LoS.Constant.BOUNDARY_EDGE.TOP,
            ssr.LoS.Constant.BOUNDARY_EDGE.RIGHT,
            ssr.LoS.Constant.BOUNDARY_EDGE.BUTTOM,
            ssr.LoS.Constant.BOUNDARY_EDGE.LEFT
        ];
        for (var i = 0; i < checkSightBoundaryEdgeArray.length; i ++) {
            var edgeType = checkSightBoundaryEdgeArray[i];
            if (skipEdgeTypeArray && ssr.LoS.Helper.isElementInArray(edgeType, skipEdgeTypeArray)) {
                continue;
            }
            var sightBoundaryEdge = this._getSightBoundaryEdge(edgeType);
            var intersection = cc.v2(0, 0);
            var intersectionHashCode = "";
            var intersectionCount = 0;
            if (ssr.LoS.Helper.segmentSegmentTest(s, e, sightBoundaryEdge[0], sightBoundaryEdge[1])) {
                var intersection = ssr.LoS.Helper.segmentSegmentIntersect(s, e, sightBoundaryEdge[0], sightBoundaryEdge[1]);
                if (intersection) {
                    intersectionCount += 1;
                    intersectionHashCode = ssr.LoS.Helper.pointToHashCode(intersection);
                    obstacle.addBoundaryAnglePoint(intersectionHashCode, intersection, edge);
                }
                if (intersectionCount >= expectIntersectionCount) {
                    // expected intersection count, break here
                    break;
                }
            }
        }
    },
    /**
     * Generate edges for boundary rectangle.
     * @function
     * @private
     * @return {Array.<ssr.LoS.Data.Edge>} The edge array.
     */
    _extractSightBoundaryEdges:function() {
        var sightBoundary = this._losComponentCore.getSightBoundary();
        // top
        var edgeArray = [];
        var edgeTop = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Edge);
        edgeTop.init(
            sightBoundary.getTopLeft(), 
            sightBoundary.getTopRight(), 
            -1,
            ssr.LoS.Constant.EDGE_TYPE.POLYGON
        );
        edgeArray.push(edgeTop);
        // right
        var edgeRight = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Edge);
        edgeRight.init(
            sightBoundary.getTopRight(), 
            sightBoundary.getBottomRight(), 
            -2,
            ssr.LoS.Constant.EDGE_TYPE.POLYGON
        );
        edgeArray.push(edgeRight);
        // bottom
        var edgeBottom = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Edge);
        edgeBottom.init(
            sightBoundary.getBottomRight(), 
            sightBoundary.getBottomLeft(), 
            -3,
            ssr.LoS.Constant.EDGE_TYPE.POLYGON
        );
        edgeArray.push(edgeBottom);
        // left
        var edgeLeft = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Edge);
        edgeLeft.init(
            sightBoundary.getBottomLeft(), 
            sightBoundary.getTopLeft(),
            -4,
            ssr.LoS.Constant.EDGE_TYPE.POLYGON
        );
        edgeArray.push(edgeLeft);
        return edgeArray;
    }
});
