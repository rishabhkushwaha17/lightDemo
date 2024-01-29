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

const ssr = require('../namespace/SSRLoSNamespace');
 
/**
 * Counter clockwise test.
 * @function
 * @param {cc.Point} a Point a.
 * @param {cc.Point} b Point b.
 * @param {cc.Point} c Point c.
 * @return {Boolean} True means ab is in the clockwise direction of ac, false means not.
 */
ssr.LoS.Helper.ccw = function(a, b, c) {
    var A = (c.y - a.y) * (b.x - a.x);
    var B = (b.y - a.y) * (c.x - a.x); 
    return (A > B + cc.macro.FLT_EPSILON) ? 1 : (A + cc.macro.FLT_EPSILON < B) ? -1 : 0;
};

/**
 * Segment segment intersection test.
 * @function
 * @param {cc.Point} a1 Point a1 of segment a.
 * @param {cc.Point} a2 Point a2 of segment a.
 * @param {cc.Point} b1 Point b1 of segment b.
 * @param {cc.Point} b2 Point b2 of segment b.
 * @return {Boolean} True means ab intersects with each other, false means not.
 */
 // a,b 相交 => true  a,b 共线 => false a某端点在b上 => true a某端点等于b某端点 => true
ssr.LoS.Helper.segmentSegmentTest = function(a1, a2, b1, b2) {
    return ssr.LoS.Helper.ccw(a1, b1, b2) != ssr.LoS.Helper.ccw(a2, b1, b2) && ssr.LoS.Helper.ccw(a1, a2, b1) != ssr.LoS.Helper.ccw(a1, a2, b2);
};

/**
 * Calculate segment segment intersection points.
 * @function
 * @param {cc.Point} a1 Point a1 of segment a.
 * @param {cc.Point} a2 Point a2 of segment a.
 * @param {cc.Point} b1 Point b1 of segment b.
 * @param {cc.Point} b2 Point b2 of segment b.
 * @return {cc.Point|null} The possible intersection point.
 */
ssr.LoS.Helper.segmentSegmentIntersect = function(a1, a2, b1, b2) {
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b != 0) {
        var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
        var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;
        if (-cc.macro.FLT_EPSILON <= ua && ua <= 1 + cc.macro.FLT_EPSILON && 
            -cc.macro.FLT_EPSILON <= ub && ub <= 1 + cc.macro.FLT_EPSILON) {
            return cc.v2(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y));
        }
    } 
    return null;
};

/**
 * Calculate segment circle intersection points.
 * @function
 * @param {cc.Point} a Point a of segment ab.
 * @param {cc.Point} b Point b of segment ab.
 * @param {cc.Point} c Center of the circle.
 * @param {Number} r Radius of the circle.
 * @return {Array.<cc.Point>} The possible intersection point array.
 */
ssr.LoS.Helper.segmentCircleIntersect = function(a, b, c, r) {
    if (a.x == b.x && a.y == b.y) {
        return [];
    }
    else {
        var baDistSQ = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        var bb = 2 * ((b.x - a.x) * (a.x - c.x) + (b.y - a.y) * (a.y - c.y));
        var ccc = c.x * c.x + c.y * c.y + a.x * a.x + a.y * a.y - 2 * (c.x * a.x + c.y * a.y) - r * r;
        var deter = bb * bb - 4 * baDistSQ * ccc;
        if (deter < 0) {
            return [];
        } 
        else if (deter == 0) {
            var u = (-bb) / (2 * baDistSQ);
            res.push(cc.v2(a.x - (a.x - b.x) * u, a.y - (a.y - b.y) * u));
        } 
        else {
            var e  = Math.sqrt(deter);
            var u1 = (-bb + e) / (2 * baDistSQ);
            var u2 = (-bb - e) / (2 * baDistSQ);

            if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
                return [];
            } 
            else {
                var res = [];
                if (0 <= u1 && u1 <= 1) {
                    res.push(cc.v2(a.x - (a.x - b.x) * u1, a.y - (a.y - b.y) * u1));
                }
                if (0 <= u2 && u2 <= 1) {
                    res.push(cc.v2(a.x - (a.x - b.x) * u2, a.y - (a.y - b.y) * u2));
                }
                return res;
            }
        }
    }
};

/**
 * Convert an arc to a serial of segments.
 * @function
 * @param {cc.Point} origin The origin of the arc.
 * @param {Number} radius The radius of the arc.
 * @param {Number} beginRadians The begin radians of the arc.
 * @param {Number} centralRadians The central radians of the arc.
 * @param {Number} segments How many segments the arc needs to be divided in.
 * @param {Boolean} [addOriginFlag=true] Dose the origin need to be added into the result.
 * @return {Array.<cc.Point>} The point array.
 */
ssr.LoS.Helper.arcToSegments = function(origin, radius, beginRadians, centralRadians, segments, addOriginFlag) {
    addOriginFlag = (addOriginFlag == undefined ? true : addOriginFlag);
    var coef = centralRadians / segments;
    var vertices = [];
    for(var i = 0; i <= segments; i ++) {
        var rads = i * coef + beginRadians;
        vertices[i] = cc.v2(
            origin.x + Math.cos(rads) * radius,
            origin.y + Math.sin(rads) * radius
        );
    }
    if (addOriginFlag) {
        vertices.push(origin);
    }
    return vertices;
};

/**
 * Segment retangle diagonal line intersection test.
 * @function
 * @param {cc.Point} startPoint The startPoint of the segment.
 * @param {cc.Point} endPoint The endPoint of the segment.
 * @param {cc.Point} topLeft The topLeft of the rectangle.
 * @param {cc.Point} topRight The topRight of the rectangle.
 * @param {cc.Point} bottomRight The bottomRight of the rectangle.
 * @param {cc.Point} bottomLeft The bottomLeft of the rectangle.
 * @return {Boolean} True means the retangle diagonal line intersects with the segment, false means not.
 */
ssr.LoS.Helper.segmentRetangleDiagonalLineIntersectionTest = function(startPoint, endPoint, topLeft, topRight, bottomRight, bottomLeft) {
    if (ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, bottomLeft, topRight)) {
        return true;
    }
    if (ssr.LoS.Helper.segmentSegmentTest(startPoint, endPoint, bottomRight, topLeft)) {
        return true;
    }
    return false;
};

/**
 * The shortest distance (squared) from a point to a segment.
 * @function
 * @param {cc.Point} point The point.
 * @param {cc.Point} startPoint The start point of the segment.
 * @param {cc.Point} endPoint The end point of the segment.
 * @return {Number} The shortest distance (squared).
 */
ssr.LoS.Helper.pointSegmentShortestDistance = function(point, startPoint, endPoint) {
     var e1ToPtX = point.x - startPoint.x;
     var e1ToPtY = point.y - startPoint.y;
     var lineVecX = endPoint.x - startPoint.x;
     var lineVecY = endPoint.y - startPoint.y;
     var num = e1ToPtX * lineVecX + e1ToPtY * lineVecY;
     var s = num / (lineVecX * lineVecX + lineVecY * lineVecY);
     s = (s <= 0) ? 0 : ((s >= 1) ? 1 : s);
     var perpx = e1ToPtX - lineVecX * s;
     var perpy = e1ToPtY - lineVecY * s;
     return perpx * perpx + perpy * perpy;
};

/**
 * Point rectangle inclusion test.
 * @function
 * @param {cc.Point} point The point to test.
 * @param {cc.Rect} rect The rect to test.
 * @return {ssr.LoS.Constant.POINT_RECT_TEST} The test result.
 */
ssr.LoS.Helper.pointRetangleInclusionTest = function(point, rect) {
    if (point.x < rect.x || point.x > (rect.x + rect.width) || point.y < rect.y || point.y > (rect.y + rect.height)) {
        return ssr.LoS.Constant.POINT_RECT_TEST.OUT;
    }
    if (point.x > rect.x && point.x < (rect.x + rect.width) && point.y > rect.y && point.y < (rect.y + rect.height)) {
        return ssr.LoS.Constant.POINT_RECT_TEST.IN;
    }
    return ssr.LoS.Constant.POINT_RECT_TEST.ON;
};

/**
 * Point non-reflex sector inclusion test.
 * @function
 * @param {cc.Point} point The point to test.
 * @param {ssr.LoS.Data.BoundarySector} sector The sector.
 * @return {ssr.LoS.Constant.POINT_SECTOR_TEST} The test result.
 */
ssr.LoS.Helper.pointNonReflexSectorInclusionTest = function(point, sector) {
    if (point.fuzzyEquals(sector.getCenter(), cc.macro.FLT_EPSILON)) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND;
    }
    var v = point.sub(sector.getCenter());
    if ((v.magSqr() - sector.getRadiusSQ()) > cc.macro.FLT_EPSILON) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.OUT;
    }
    if (ssr.LoS.Helper.isPointOnSegment(point, sector.getEdges()[0], sector.getCenter()) ||
        ssr.LoS.Helper.isPointOnSegment(point, sector.getEdges()[1], sector.getCenter())) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT;
    }
    var dot = v.dot(sector.getDir());
    if (dot <= 0) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND;
    }
    if (ssr.LoS.Helper.isPointInBetweenNonReflexSectorEdge(point, sector.getEdgesVec()[0], sector.getEdgesVec()[1], sector.getCenter())) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.IN;
    }
    else {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.FRONT;
    }
};

/**
 * Point reflex sector inclusion test.
 * @function
 * @param {cc.Point} point The point to test.
 * @param {ssr.LoS.Data.BoundarySector} sector The sector.
 * @return {ssr.LoS.Constant.POINT_SECTOR_TEST} The test result.
 */
ssr.LoS.Helper.pointReflexSectorInclusionTest = function(point, sector) {
    if (point.fuzzyEquals(sector.getCenter(), cc.macro.FLT_EPSILON)) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND;
    }
    var v = point.sub(sector.getCenter());
    if (v.magSqr() - sector.getRadiusSQ() > cc.macro.FLT_EPSILON) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.OUT;
    }
    var dot = v.dot(sector.getDir());
    if (dot >= 0) {
        return ssr.LoS.Constant.POINT_SECTOR_TEST.IN;
    }
    else {
        if (ssr.LoS.Helper.isPointInBetweenReflexSectorEdge(point, sector.getEdgesVec()[0], sector.getEdgesVec()[1], sector.getCenter())) {
            return ssr.LoS.Constant.POINT_SECTOR_TEST.IN;
        }
        else {
            return ssr.LoS.Constant.POINT_SECTOR_TEST.BEHIND;
        }
    }
};

/**
 * Segment circle inclusion test.
 * @function
 * @param {cc.Point} startPoint The start point of the segment.
 * @param {cc.Point} endPoint The end point of the segment.
 * @param {cc.Point} center The center of the circle.
 * @param {Number} radius The radius of the circle.
 * @return {Boolean} True for inside circle, false for not.
 */
ssr.LoS.Helper.segmentCircleIntersectionTest = function(startPoint, endPoint, center, radius) {
    return ssr.LoS.Helper.pointSegmentShortestDistance(center, startPoint, endPoint) < radius * radius;
};

/**
 * Point circle inclusion test.
 * @function
 * @param {cc.Point} point The point to test.
 * @param {cc.Point} center The center of the circle.
 * @param {Number} radius The radius of the circle.
 * @return {ssr.LoS.Constant.POINT_CIRCLE_TEST} The test result.
 */
ssr.LoS.Helper.pointCircleInclusionTest = function(point, center, radius) {
    // 点到圆心的距离平方
    var lengthSq = (point.x - center.x) * (point.x - center.x) + (point.y - center.y) * (point.y - center.y);
    var radiusSq = radius * radius;
    if (lengthSq > radiusSq) {
        return ssr.LoS.Constant.POINT_CIRCLE_TEST.OUT;
    }
    else if (lengthSq < radiusSq) {
        return ssr.LoS.Constant.POINT_CIRCLE_TEST.IN;
    }
    else {
        return ssr.LoS.Constant.POINT_CIRCLE_TEST.ON;   
    }
};

/**
 * Calculate the intersections of segment and reflex sector.
 * @function
 * @param {cc.Point} pa Segment end point a.
 * @param {cc.Point} pb Segment end point b.
 * @param {ssr.LoS.Data.BoundarySector} sector The sector.
 * @param {Boolean} [isSkipAngleCheck=false] Is valid angle check needed for the point.
 * @return {Array.<cc.Point>} The possible intersection.
 */
ssr.LoS.Helper.segmentReflexSectorIntersect = function(pa, pb, sector, isSkipAngleCheck) {
    isSkipAngleCheck = (isSkipAngleCheck === undefined ? false : isSkipAngleCheck);
    var intersections = ssr.LoS.Helper.segmentCircleIntersect(pa, pb, sector.getCenter(), sector.getRadius());
    if (intersections.length <= 0) {
        return intersections;
    }
    if (isSkipAngleCheck) {
        return intersections;
    }
    var filterIntersections = [];
    for (var i = 0; i < intersections.length; i ++) {
        if (ssr.LoS.Helper.isPointInBetweenReflexSectorEdge(intersections[i], sector.getEdgesVec()[0], sector.getEdgesVec()[1], sector.getCenter())) {
            filterIntersections.push(intersections[i]);
        }
    }
    return filterIntersections;
};

/**
 * Calculate the intersections of segment and non-reflex sector.
 * @function
 * @param {cc.Point} pa Segment end point a.
 * @param {cc.Point} pb Segment end point b.
 * @param {ssr.LoS.Data.BoundarySector} sector The sector.
 * @param {Boolean} [isSkipAngleCheck=false] Is valid angle check needed for the point.
 * @return {Array.<cc.Point>} The possible intersection.
 */
ssr.LoS.Helper.segmentNonReflexSectorIntersect = function(pa, pb, sector, isSkipAngleCheck) {
    isSkipAngleCheck = (isSkipAngleCheck === undefined ? false : isSkipAngleCheck);
    var intersections = ssr.LoS.Helper.segmentCircleIntersect(pa, pb, sector.getCenter(), sector.getRadius());
    if (intersections.length <= 0) {
        return intersections;
    }
    if (isSkipAngleCheck) {
        return intersections;
    }
    var filterIntersections = [];
    for (var i = 0; i < intersections.length; i ++) {
        if (ssr.LoS.Helper.isPointInBetweenNonReflexSectorEdge(intersections[i], sector.getEdgesVec()[0], sector.getEdgesVec()[1], sector.getCenter())) {
            filterIntersections.push(intersections[i]);
        }
    }
    return filterIntersections;
};

/**
 * Convert a given radians to the range of [0, 2 * Math.PI]
 * @function
 * @param {Number} radians The radians to convert.
 * @return {Number} The result.
 */
ssr.LoS.Helper.radiansNormalize = function(radians) {
    while (radians < 0 || radians > 2 * Math.PI) {
        if (radians < 0) {
            radians += 2 * Math.PI;
        }
        else {
            radians -= 2 * Math.PI;
        }
    }
    return radians;
};

/**
 * Convert a given angle (degree) to the range of [0, 360]
 * @function
 * @param {Number} angle The angle to convert.
 * @return {Number} The result.
 */
ssr.LoS.Helper.angleNormalize = function(angle) {
    while (angle < 0 || angle > 360) {
        if (angle < 0) {
            angle += 360;
        }
        else {
            angle -= 360;
        }
    }
    return angle;
};

/**
 * Calculate the angle (radians) in between two angles.
 * @function
 * @param {Number} randians1 One angle.
 * @param {Number} randians1 Another angle.
 * @return {Number} The result.
 */
ssr.LoS.Helper.radiansBetweenAngle = function(radians1, radians2) {
    if (radians1 <= radians2) {
        return radians2 - radians1;
    }
    else {
        return radians2 + Math.PI * 2 - radians1;
    }
};

/**
 * Return the possible same edge ID of two hit points.
 * @function
 * @param {ssr.LoS.Data.HitPoint} hitPointPrev One hit point.
 * @param {ssr.LoS.Data.HitPoint} hitPointNext Another hit point.
 * @return {Number} The same edge ID.
 */
ssr.LoS.Helper.getSameEdgeID = function(hitPointPrev, hitPointNext) {
    if (hitPointPrev.getEdgeIDs()[0] == hitPointNext.getEdgeIDs()[0]) {
        return hitPointPrev.getEdgeIDs()[0];
    }
    if (hitPointNext.getEdgeIDs().length > 1) {
        if (hitPointPrev.getEdgeIDs()[0] == hitPointNext.getEdgeIDs()[1]) {
            return hitPointPrev.getEdgeIDs()[0];
        }   
    }
    if (hitPointPrev.getEdgeIDs().length > 1) {
        if (hitPointPrev.getEdgeIDs()[1] == hitPointNext.getEdgeIDs()[0]) {
            return hitPointPrev.getEdgeIDs()[1];
        }
        if (hitPointNext.getEdgeIDs().length > 1) {
            if (hitPointPrev.getEdgeIDs()[1] == hitPointNext.getEdgeIDs()[1]) {
                return hitPointPrev.getEdgeIDs()[1];
            }   
        }            
    }
    return 0;
},

/**
 * Determine if two hit points need to be connect by segment or arc.
 * @function
 * @param {ssr.LoS.Data.HitPoint} hitPointPrev One hit point.
 * @param {ssr.LoS.Data.HitPoint} hitPointNext Another hit point.
 * @return {ssr.LoS.Constant.HIT_POINT_CONNECTION} The result.
 */
ssr.LoS.Helper.segmentOrArc = function(hitPointPrev, hitPointNext) {
    if (hitPointPrev.getType() != ssr.LoS.Constant.HIT_POINT_TYPE.BOUNDARY ||
        hitPointNext.getType() != ssr.LoS.Constant.HIT_POINT_TYPE.BOUNDARY) {
        return ssr.LoS.Constant.HIT_POINT_CONNECTION.SEGMENT;    
    }
    if (hitPointPrev.getType() == ssr.LoS.Constant.HIT_POINT_TYPE.BOUNDARY ||
        hitPointNext.getType() == ssr.LoS.Constant.HIT_POINT_TYPE.BOUNDARY) {
        if (hitPointPrev.getEdgeIDs()[0]  == 0 && hitPointNext.getEdgeIDs()[0]  == 0) {
            return ssr.LoS.Constant.HIT_POINT_CONNECTION.ARC;
        }
        if (hitPointPrev.getEdgeIDs()[0]  == 0 && hitPointNext.getEdgeIDs()[0]  > 0 ||
            hitPointNext.getEdgeIDs()[0]  == 0 && hitPointPrev.getEdgeIDs()[0]  > 0) {
            return ssr.LoS.Constant.HIT_POINT_CONNECTION.ARC;
        }
        if (hitPointPrev.getEdgeIDs()[0]  > 0 && hitPointNext.getEdgeIDs()[0]  > 0) {
            if (hitPointPrev.getEdgeIDs()[0]  == hitPointNext.getEdgeIDs()[0] ) {
                var diffPN = ssr.LoS.Helper.radiansBetweenAngle(hitPointPrev.getAngle(), hitPointNext.getAngle());
                if (diffPN < Math.PI) {
                    return ssr.LoS.Constant.HIT_POINT_CONNECTION.SEGMENT;
                }
                else {
                    return ssr.LoS.Constant.HIT_POINT_CONNECTION.ARC;
                }
            }
            else {
                return ssr.LoS.Constant.HIT_POINT_CONNECTION.ARC;
            }
        }
    }
};

/**
 * Rotate the given ray and generate a auxiliary ray.
 * @function
 * @param {cc.Point} o The origin of the ray.
 * @param {cc.Point} v The vector of the ray.
 * @param {Number} cosa The Math.cos of the angle of the auxiliary ray.
 * @param {Number} sina The Math.sin of the angle of the auxiliary ray.
 * @param {Number} exaggerateFactor The exaggerate factor.
 * @return {cc.Point} The vector of the generate a auxiliary ray.
 */
ssr.LoS.Helper.generateAuxiliaryRay = function(o, v, cosa, sina, exaggerateFactor) {
    var rx = v.x - o.x;
    var ry = v.y - o.y;
    if (exaggerateFactor) {
        rx = rx * exaggerateFactor;
        ry = ry * exaggerateFactor;
    }
    var t = rx;
    rx = t * cosa - ry * sina + v.x;
    ry = t * sina + ry * cosa + v.y;
    return cc.v2(rx, ry);

};


/**
 * Convert a cc.Point into a string that will be used as hash code.
 * @function
 * @param {cc.Point} point The point to convert.
 * @return {String} The converted hash code.
 * @todo String might be slow, try something like the hashCode in java.
 */
ssr.LoS.Helper.pointToHashCode = function(point) {
    return point.x + "_" + point.y;
};


/**
 * Check if the two end points of a segment is on the same edge of a rectangle.
 * @function
 * @param {cc.Point} startPoint The start point of the segment.
 * @param {cc.Point} endPoint The end point of the segment.
 * @param {cc.Rect} rect The rectangle.
 * @return {Boolean} True for segment on same edge of rectangle, false for not.
 */
ssr.LoS.Helper.segmentOnSameRectangleEdgeTest = function(startPoint, endPoint, rect) {
    if (startPoint.x == endPoint.x || startPoint.y == endPoint.y) {
        if (startPoint.x != rect.x &&
            startPoint.x != rect.x + rect.width &&
            startPoint.y != rect.y &&
            startPoint.y != rect.y + rect.height) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
};

/**
 * Same as cc.pDistance but faster in native.
 * @function
 * @param {cc.Point} p1 One point.
 * @param {cc.Point} p2 Another point.
 * @return {Number} Squared distance.
 */
ssr.LoS.Helper.pDistanceSQ = function(p1, p2) {
    var vx = p1.x - p2.x;
    var vy = p1.y - p2.y;
    return vx * vx + vy * vy;    
};

/**
 * Same as cc.pToAngle but faster in native.
 * @function
 * @param {cc.Point} p1 One point.
 * @param {cc.Point} p2 Another point.
 * @return {Number} Angle between p1 and p2.
 */
ssr.LoS.Helper.pToAngle = function(p1, p2) {
    return Math.atan2(p1.y - p2.y, p1.x - p2.x);
};

/**
 * Check if a given point is on the segment.
 * @function
 * @param {cc.Point} p The point to check.
 * @param {cc.Point} pa Segment end point a.
 * @param {cc.Point} pb Segment end point b.
 * @return {Boolean} True for point on segment, false for not.
 */
ssr.LoS.Helper.isPointOnSegment = function(p, pa, pb) {
    if (Math.abs((pa.x - p.x) * (pb.y - p.y) - (pb.x - p.x) * (pa.y - p.y)) > cc.macro.FLT_EPSILON) {
        return false;
    }
    var minX = Math.min(pa.x, pb.x);
    var minY = Math.min(pa.y, pb.y);
    var maxX = Math.max(pa.x, pb.x);
    var maxY = Math.max(pa.y, pb.y);
    if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
        return true;
    }
    else {
        return false;
    }
};

/**
 * Check if a given point is in between a reflex sector's edges.
 * @function
 * @param {cc.Point} p The point to check.
 * @param {cc.Point} vs Vector of one edge of the sector.
 * @param {cc.Point} ve Vector of another edge of the sector.
 * @param {cc.Point} o Center of the sector.
 * @return {Boolean} True for point in between sector's edges, false for not.
 */
ssr.LoS.Helper.isPointInBetweenReflexSectorEdge = function(p, vs, ve, o) {
    // 逆时针 vs => v => ve
    var vx = p.x - o.x;
    var vy = p.y - o.y;
    return !((vs.x * vy - vs.y * vx) < 0 && (vx * ve.y - vy * ve.x) < 0);
};

/**
 * Check if a given point is in between a non-reflex sector's edges.
 * @function
 * @param {cc.Point} p The point to check.
 * @param {cc.Point} vs Vector of one edge of the sector.
 * @param {cc.Point} ve Vector of another edge of the sector.
 * @param {cc.Point} o Center of the sector.
 * @return {Boolean} True for point in between sector's edges, false for not.
 */
ssr.LoS.Helper.isPointInBetweenNonReflexSectorEdge = function(p, vs, ve, o) {
    // 逆时针 vs => v => ve
    var vx = p.x - o.x;
    var vy = p.y - o.y;
    return (vs.x * vy - vs.y * vx) > 0 && (vx * ve.y - vy * ve.x) > 0;
};

/**
 * Check if 2 vectors are collinear.
 * @function
 * @param {cc.Point} pa Point a.
 * @param {cc.Point} pb Point b.
 * @param {cc.Point} o Point o.
 * @return {Boolean} True for collinear, false for not.
 */
ssr.LoS.Helper.isCollinear = function(pa, pb, o) {
    var vax = pa.x - o.x;
    var vay = pa.y - o.y;
    var vbx = pb.x - o.x;
    var vby = pb.y - o.y;
    return Math.abs(vax * vby - vay * vbx) <= cc.macro.FLT_EPSILON;
};

/**
 * Check if 2 vectors face same direction.
 * @function
 * @param {cc.Point} pa Point a.
 * @param {cc.Point} pb Point b.
 * @param {cc.Point} o Point o.
 * @return {Boolean} True for collinear, false for not.
 */
ssr.LoS.Helper.isSameDirection = function(pa, pb, o) {
    var va = pa.sub(o);
    var vb = pb.sub(o);
    return va.dot(vb) > 0;
};

/**
 * Check if 2 vectors are collinear and face same direction.
 * @function
 * @param {cc.Point} pa Point a.
 * @param {cc.Point} pb Point b.
 * @param {cc.Point} o Point o.
 * @return {Boolean} True for collinear, false for not.
 */
ssr.LoS.Helper.isCollinearAndSameDirection = function(pa, pb, o) {
    var vax = pa.x - o.x;
    var vay = pa.y - o.y;
    var vbx = pb.x - o.x;
    var vby = pb.y - o.y;
    if (Math.abs(vax * vby - vay * vbx) <= cc.macro.FLT_EPSILON) {
        // collinear
        if (vax * vbx + vay * vby >= cc.macro.FLT_EPSILON) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
};


/**
 * A help funciton to check if a element is in a array
 * @function
 * @param {*} element Element to check.
 * @param {Array.<*>} array The array.
 * @return {Boolean} True for contains, false for not.
 */
ssr.LoS.Helper.isElementInArray = function(element, array) {
    var i = array.length;
    while (i--) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
};

/**
 * Same as cc.pNormalize.
 * @function
 * @param {cc.Point} a
 * @param {cc.Point} b
 * @return {cc.Point}
 */
ssr.LoS.Helper.pNormalize = function(a, b) {
    var v = cc.v2(a.x - b.x, a.y - b.y);
    var n = Math.sqrt(v.x * v.x + v.y * v.y);
    if (n === 0) {
        return v;
    }
    else {
        var inverseN = 1.0 / n;
        return cc.v2(v.x * inverseN, v.y * inverseN);
    }
};

ssr.LoS.Helper.rectContainsRect = function(rect1, rect2) {
    if(rect1.x > rect2.x + rect2.width ||
       rect2.x > rect1.x + rect1.width ||
       rect1.y > rect2.y + rect2.height ||
       rect2.y > rect1.y + rect1.height) {
        return false;
    }
    else{
        return true;
    }
};
