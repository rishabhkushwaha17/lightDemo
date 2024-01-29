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

/**
 * @classdesc Prcess strategy base class. The main purpose of this class is: <br>
 * . Generate auxiliary angle point if needed. <br>
 * . Generate rays.<br>
 * . Sort all the rays.<br>
 * . Find all the hit points.<br>
 *
 * @class
 * @extends cc.Class
 * @prop {ssr.LoS.Component.Core}                losComponentCore                - The ssr.LoS.Component.Core instance. 
 */
ssr.LoS.Strategy.Process.Base = cc.Class( /** @lends ssr.LoS.Strategy.Process.Base# */ {
    name: "ssr.LoS.Strategy.Process.Base",
    "extends": cc.Object,
    /**
     * The constructor
     * @function
     * @param {ssr.LoS.Component.Core} losComponentCore The ssr.LoS.Component.Core instance
     */
    ctor: function () {
        this._losComponentCore = arguments[0];
    },
    /**
     * Return the auxiliary angle point type based on the input angle point.
     * @function
     * @private
     * @param {ssr.LoS.Data.AnglePoint} The angle point.
     * @return {ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE} The auxiliary angle point type.
     */
    _calculateAuxiliaryAnglePointType:function(anglePoint) {
        // only a ANGLE_POINT_TYPE.ENDPOINT might need auxiliary angle point(s)
        var prepX = anglePoint.getEndPoint().x - this._losComponentCore.getPosition().x;
        var prepY = this._losComponentCore.getPosition().y - anglePoint.getEndPoint().y;

        var p1 = null;
        var p2 = null;
        if (anglePoint.getPrevEdge()) {   
            p1 = (anglePoint.getPrevEdge().getEdgeVector().x * prepY) + (anglePoint.getPrevEdge().getEdgeVector().y * prepX);
        }
        if (anglePoint.getNextEdge()) {
            p2 = (anglePoint.getNextEdge().getEdgeVector().x * prepY) + (anglePoint.getNextEdge().getEdgeVector().y * prepX);
        }
        if (p1 != null && p2 != null) {
            if ((p1 >= 0) && (p2 <= 0)) {
                return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.PLUS;
            }
            else if ((p1 <= 0) && (p2 >= 0)) {
                return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.MINUS;
            }
            else {
                return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.NONE;
            }
        }
        else {
            if (p2 == null) {
                if (p1 > 0) {
                    return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.PLUS;
                }
                else if (p1 < 0) {
                    return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.MINUS;
                }
                else {
                    // p1 == 0
                    return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.BOTH;
                }
            }
            if (p1 == null) {
                if (p2 < 0) {
                    return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.PLUS;
                }
                else if (p2 > 0) {
                    return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.MINUS;
                }
                else {
                    // p2 == 0
                    return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.BOTH;
                }
            }
        }
        return ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE.NONE;
    },
    /**
     * Generate auxiliary angle point(s) if needed.
     * @function
     */
    generateAuxiliaryAnglePoint:function() {
    },
    packAnglePoints:function() {
        var obstacles = this._losComponentCore.getObstacles();
        var anglePointArray = this._losComponentCore.getAnglePointArray();
        for (var i = 0, l = obstacles.length; i < l; i ++) {
            obstacles[i].getAnglePointArray().forEach(function(v) {this.push(v)}, anglePointArray); 
            obstacles[i].getAnglePointAuxiliaryArray().forEach(function(v) {this.push(v)}, anglePointArray); 
        }
        //
        var obstacle = this._losComponentCore.getBoundaryObstacle();
        obstacle.getAnglePointArray().forEach(function(v) {this.push(v)}, anglePointArray); 
        obstacle.getAnglePointAuxiliaryArray().forEach(function(v) {this.push(v)}, anglePointArray); 
    },
    packPotentialBlockingEdges:function() {
        var obstacles = this._losComponentCore.getObstacles();
        var potentialBlockingEdgeArray = this._losComponentCore.getPotentialBlockingEdgeArray();
        var potentialBlockingEdgeMap = this._losComponentCore.getPotentialBlockingEdgeMap();
        for (var i = 0, l = obstacles.length; i < l; i ++) {
            obstacles[i].getPotentialBlockingEdgeArray().forEach(function(v) {this.push(v)}, potentialBlockingEdgeArray);
        }
        var obstacle = this._losComponentCore.getBoundaryObstacle();
        obstacle.getPotentialBlockingEdgeArray().forEach(function(v) {this.push(v)}, potentialBlockingEdgeArray);
        //
        for (var i = 0, l = potentialBlockingEdgeArray.length; i < l; i ++) {
            potentialBlockingEdgeMap[potentialBlockingEdgeArray[i].getEdgeID().toString()] = potentialBlockingEdgeArray[i];
        }
    },
    /**
     * Sort all the angle point by angle clockwisely.
     * @function
     */
	sortAnglePointArray:function() {
        var anglePointArray = this._losComponentCore.getAnglePointArray();
		if (anglePointArray.length <= 0) {
            return;
        }
        var self = this;
        var sourcePosition = this._losComponentCore.getPosition();
        for (var i = 0, l = anglePointArray.length; i < l; i ++) {
            anglePointArray[i].setAngle(
                ssr.LoS.Helper.pToAngle(anglePointArray[i].getEndPoint(), sourcePosition)
            );
        }
        anglePointArray.sort(function(a, b) {
            return a.getAngle() - b.getAngle();
        });
	},
    /**
     * Determine if two rays can be merged (if the angle in between them is very tiny).
     * @function
     * @private
     * @param {Number} First angle point angle.
     * @param {Number} Second angle point angle.
     * @return {Boolean} True for can be merged, false for can not.
     */
    _canMergeRays:function(angleA, angleB) {
        return (Math.abs(angleA - angleB) < cc.macro.FLT_EPSILON);
    },
    /**
     * Generate rays based on the angle point array will merge the rays that are close enough.
     * @function
     */
	generateRays:function() {
        var anglePointArray = this._losComponentCore.getAnglePointArray();
		if (anglePointArray.length <= 0) {
            return;
        }
        var rayArray = this._losComponentCore.getRayArray();
        var sourcePosition = this._losComponentCore.getPosition();
        var ray = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Ray);
        ray.init(
            anglePointArray[0].getEndPoint(), 
            anglePointArray[0].getEdgeIDs(), 
            anglePointArray[0].getType(), 
            anglePointArray[0].getAngle()
        );
        ray.setDistanceSQ(ssr.LoS.Helper.pDistanceSQ(anglePointArray[0].getEndPoint(), sourcePosition));
        rayArray.push(ray);
        for (var i = 1, j = 0, n = anglePointArray.length; i < n; i ++) {
            if (!this._canMergeRays(anglePointArray[i].getAngle(), rayArray[j].getAngle())) {
                ray = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.Ray);
                ray.init(
                    anglePointArray[i].getEndPoint(), 
                    anglePointArray[i].getEdgeIDs(), 
                    anglePointArray[i].getType(), 
                    anglePointArray[i].getAngle()
                );
                anglePointArray[i].setDistanceSQ(ssr.LoS.Helper.pDistanceSQ(anglePointArray[i].getEndPoint(), sourcePosition));
                ray.setDistanceSQ(anglePointArray[i].getDistanceSQ());
                rayArray.push(ray);
                j ++;
            }
            else {
                var distanceSQ = ssr.LoS.Helper.pDistanceSQ(anglePointArray[i].getEndPoint(), sourcePosition);
                if (rayArray[j].getDistanceSQ() == -1 || distanceSQ < rayArray[j].getDistanceSQ()) {
                    rayArray[j].setType(anglePointArray[i].getType());
                    rayArray[j].setEdgeIDs(anglePointArray[i].getEdgeIDs());
                    rayArray[j].setDistanceSQ(distanceSQ);
                    rayArray[j].setEndPoint(anglePointArray[i].getEndPoint());
                }
            }
        }
	},
    /**
     * Cast rays and find all the hit points.
     This is the core process of finding all the hit points based on all the infomation we have collected this far.
     The basic concept of the algorithm:
        - All he rays are generated so we need to find a hit point for each ray.
        - For each ray we need to find out the closest intersection by looping all the potential blocking edges.
        - So the algorithm complexity (worst) might be rays.length * potentialBlockingEdge.length calculations
     The optimizations:
        - Remeber all the rays are already sorted (in anti-clockwise)
        - If the ray type is ENDPOINT, skip the intersection process with thoses edges that contain the ray anlge point.

        - Reduce hit points
     * @function
     */
	castRays:function() {
        var rayArray = this._losComponentCore.getRayArray();
        if (rayArray.length <= 0) {
            return;
        }
        var potentialBlockingEdgeArray = this._losComponentCore.getPotentialBlockingEdgeArray();
        var preBlockingEdge = null;
        var collineationCount = 0;
        var sourcePosition = this._losComponentCore.getPosition();
        var hitPointArray = this._losComponentCore.getHitPointArray();
        for (var i = 0, l = rayArray.length; i < l; i ++) {
            var ray = rayArray[i];
            var rayEndPoint = ray.getEndPoint();
            var blockingEdge = null;
            var hitPoint = ray.getEndPoint();
            var closestSQ = ray.getDistanceSQ();
            if (preBlockingEdge) {
                /*
                    If there is a recorded pre blocking edge, we do not need to do the intersection test with all the potential blocking edges.
                    Just do the intersection in between the ray and the preBlockingEdge.
                    If they do not intersect, then the angle point of the ray if the hit point we need.
                    If they do intersect, then the intersection is the hit point we need.
                */
                if (ssr.LoS.Helper.segmentSegmentTest(
                    sourcePosition, 
                    rayEndPoint, 
                    preBlockingEdge.getStartPoint(), 
                    preBlockingEdge.getEndPoint())) {
                    var intersection = ssr.LoS.Helper.segmentSegmentIntersect(
                        sourcePosition, 
                        rayEndPoint, 
                        preBlockingEdge.getStartPoint(), 
                        preBlockingEdge.getEndPoint()
                    );
                    if (intersection) {
                        var distanceSQ = ssr.LoS.Helper.pDistanceSQ(sourcePosition, intersection);
                        if (closestSQ == -1) {
                            hitPoint = cc.v2(intersection.x, intersection.y);
                            blockingEdge = preBlockingEdge;
                        }
                        else {
                            if (distanceSQ < (closestSQ - cc.macro.FLT_EPSILON)) {
                                hitPoint = cc.v2(intersection.x, intersection.y);
                                blockingEdge = preBlockingEdge;
                            }
                            else if (distanceSQ == closestSQ) {
                                if (ray.getType() == ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY &&
                                    ray.getEdgeIDs().length == 1 &&
                                    ray.getEdgeIDs()[0] == 0) {
                                    /*
                                        The ray is one of the sector's edge.
                                        In this case ==> ssr.LoS.Data.Ray.edgeIDs == [0] .
                                        So we need to rewrite it with the edgeIDs of the potentialBlockingEdge.
                                    */
                                    ray.setEdgeIDs([preBlockingEdge.getEdgeID()]);
                                }
                            }
                        }
                    }
                }
            }
            else {
                for (var j = 0, ll = potentialBlockingEdgeArray.length; j < ll; j ++) {
                    var potentialBlockingEdge = potentialBlockingEdgeArray[j];
                    var potentialBlockingEdgeStartPoint = potentialBlockingEdge.getStartPoint();
                    var potentialBlockingEdgeEndPoint = potentialBlockingEdge.getEndPoint();
                    if (ray.getType() == ssr.LoS.Constant.ANGLE_POINT_TYPE.ENDPOINT) {
                        if ((rayEndPoint.x == potentialBlockingEdgeStartPoint.x &&
                             rayEndPoint.y == potentialBlockingEdgeStartPoint.y) || 
                            (rayEndPoint.x == potentialBlockingEdgeEndPoint.x &&
                             rayEndPoint.y == potentialBlockingEdgeEndPoint.y)) {
                            continue;
                        }
                    }
                    else if (ray.getType() == ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY) {
                        if ((rayEndPoint.x == potentialBlockingEdgeStartPoint.x &&
                             rayEndPoint.y == potentialBlockingEdgeStartPoint.y) || 
                            (rayEndPoint.x == potentialBlockingEdgeEndPoint.x &&
                             rayEndPoint.y == potentialBlockingEdgeEndPoint.y)) {
                            /*
                                The ray is one of the sector's edge.
                                In this case ==> ssr.LoS.Data.Ray.edgeIDs == [0] .
                                So we need to rewrite it with the edgeIDs of the potentialBlockingEdge.
                            */
                            if (ray.getEdgeIDs().length == 1 && ray.getEdgeIDs()[0] == 0) {
                                ray.setEdgeIDs([potentialBlockingEdge.getEdgeID()]);
                            }
                        }
                    }
                    if (ssr.LoS.Helper.segmentSegmentTest(sourcePosition, rayEndPoint, potentialBlockingEdgeStartPoint, potentialBlockingEdgeEndPoint)) {
                        var intersection = ssr.LoS.Helper.segmentSegmentIntersect(sourcePosition, rayEndPoint, potentialBlockingEdgeStartPoint, potentialBlockingEdgeEndPoint);
                        if (intersection) {
                            var distanceSQ = ssr.LoS.Helper.pDistanceSQ(sourcePosition, intersection);
                            if (closestSQ == -1 || distanceSQ < closestSQ - cc.macro.FLT_EPSILON) {
                                closestSQ = distanceSQ;
                                hitPoint = cc.v2(intersection.x, intersection.y);
                                blockingEdge = potentialBlockingEdge;
                            }
                        }     
                    } 
                }
            }
            /* 
                Try reduce the redundant hit points while processing each ray.
                This is very important since in fact we only need two hit points (exact two hit points) for any edges.
                If we dot reduce the hit points count here the amount of hit points might be 10 times more and will slow down the sight area render process significantly.
            */
            var secondToLastHitPoint = hitPointArray[hitPointArray.length - 2];
            if (!blockingEdge) {
                /* 
                    In this block, it means that:
                        - The closest hit point is the end point of the ray itself (HIT_POINT_TYPE.ENDPOINT/BOUNDARY)
                */
                // The hit point is the ray angle point itself
                if (collineationCount > 0 && 
                    preBlockingEdge && 
                    ssr.LoS.Helper.isElementInArray(preBlockingEdge.getEdgeID(), ray.getEdgeIDs())) {
                    if (secondToLastHitPoint) {
                        // need at least 2 hit points before the new one
                        if (secondToLastHitPoint.getType() == ssr.LoS.Constant.HIT_POINT_TYPE.SEGMENT) {
                            // the second to last hit point has to be on an edge (not on an end point)
                            var popHitPoint = hitPointArray.pop();
                            ssr.LoS.Data.Manager.getInstance().free(popHitPoint);
                        }
                        else {
                            if (ssr.LoS.Helper.getSameEdgeID(secondToLastHitPoint, ray) > 0) {
                                var popHitPoint = hitPointArray.pop();
                                ssr.LoS.Data.Manager.getInstance().free(popHitPoint);
                            }
                        }
                    }
                }
                // clear recorded data
                preBlockingEdge = null;
                collineationCount = 0;
                // add the hit point
                var hitPointData = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.HitPoint);
                if (ray.getType() == ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY) {
                    hitPointData.init(rayEndPoint, ray.getEdgeIDs(), ray.getAngle(), ssr.LoS.Constant.HIT_POINT_TYPE.BOUNDARY);
                }
                else {
                    hitPointData.init(rayEndPoint, ray.getEdgeIDs(), ray.getAngle(), ssr.LoS.Constant.HIT_POINT_TYPE.ENDPOINT);
                }
                hitPointArray.push(hitPointData);
            }
            else {
                /* 
                    In this block, it means that:
                        - The closest hit point is on an edge (HIT_POINT_TYPE.SEGMENT/BOUNDARY)
                        - Remember if the closest hit point is the end point of the ray itself than if will go to the if block
                */
                if (preBlockingEdge && 
                    collineationCount > 0 && 
                    secondToLastHitPoint && 
                    ssr.LoS.Helper.isElementInArray(blockingEdge.getEdgeID(), secondToLastHitPoint.getEdgeIDs())) {
                    // remove pre hit point that is on the same edge of the new one
                    var popHitPoint = hitPointArray.pop();
                    ssr.LoS.Data.Manager.getInstance().free(popHitPoint);
                }
                else {
                    // record the count of hit points on the same edge
                    collineationCount += 1;
                }
                // add the hit point
                var hitPointData = ssr.LoS.Data.Manager.getInstance().create(ssr.LoS.Data.HitPoint);
                if (ray.getType() == ssr.LoS.Constant.ANGLE_POINT_TYPE.BOUNDARY) {
                    hitPointData.init(hitPoint, [blockingEdge.getEdgeID()], ray.getAngle(), ssr.LoS.Constant.HIT_POINT_TYPE.BOUNDARY);
                }
                else {
                    hitPointData.init(hitPoint, [blockingEdge.getEdgeID()], ray.getAngle(), ssr.LoS.Constant.HIT_POINT_TYPE.SEGMENT);
                }
                hitPointArray.push(hitPointData);
                // record the blockingEdge
                preBlockingEdge = blockingEdge; 
            }
        }
        this._removePossibleRedundantHitPoints();
    },
    /**
     * Remove the possible looping redundant hit points
     * @function
     * @private
     */
    _removePossibleRedundantHitPoints:function() {
    }
});
