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
 * Different modes that will be used in LoS component.
 * enum ssr.LoS.Constant.MODE
 * @enum {Number}
 */
ssr.LoS.Constant.MODE = {
    /** UNKNOWN */
    "UNKNOWN"                                : 0,
    /** UNLIMITED_RANGE */
    "UNLIMITED_RANGE"                        : 1,
    /** LIMITED_RANGE_WITH_FULL_ANGLE */
    "LIMITED_RANGE_WITH_FULL_ANGLE"          : 2,
    /** LIMITED_RANGE_WITH_REFLEX_ANGLE */
    "LIMITED_RANGE_WITH_REFLEX_ANGLE"        : 3,
    /** LIMITED_RANGE_WITH_NON_REFLEX_ANGLE */
    "LIMITED_RANGE_WITH_NON_REFLEX_ANGLE"    : 4
};

/**
 * The radius for UNLIMITED_RANGE mode.
 * @constant
 * @type Number
 */
ssr.LoS.Constant.UNLIMITED_RANGE = -1;

/**
 * The central angle for LIMITED_RANGE_WITH_FULL_ANGLE mode.
 * @constant
 * @type Number
 */
ssr.LoS.Constant.FULL_ANGLE = 360;

/**
 * The iota angle used when generating auxiliary ray.
 * @constant
 * @type Number
 */
ssr.LoS.Constant.IOTA_RADIANS = cc.macro.RAD * 0.01;

/**
 * The iota angle used when generating auxiliary ray (Math.cos).
 * @constant
 * @type Number
 */
ssr.LoS.Constant.IOTA_RADIANS_PLUS_COS = Math.cos(ssr.LoS.Constant.IOTA_RADIANS);

/**
 * The iota angle used when generating auxiliary ray (Math.sin).
 * @constant
 * @type Number
 */
ssr.LoS.Constant.IOTA_RADIANS_PLUS_SIN = Math.sin(ssr.LoS.Constant.IOTA_RADIANS);

/**
 * The iota angle used when generating auxiliary ray (-Math.cos).
 * @constant
 * @type Number
 */
ssr.LoS.Constant.IOTA_RADIANS_MINUS_COS = Math.cos(-ssr.LoS.Constant.IOTA_RADIANS);

/**
 * The iota angle used when generating auxiliary ray (-Math.sin).
 * @constant
 * @type Number
 */
ssr.LoS.Constant.IOTA_RADIANS_MINUS_SIN = Math.sin(-ssr.LoS.Constant.IOTA_RADIANS);

/**
 * How many segments that the arc will be divided into.
 * @constant
 * @type Number
 */
ssr.LoS.Constant.SEGMENT_PER_RADIANS = cc.macro.DEG / 5;

/**
 * A transparent color used when rendering.
 * @constant
 * @type Number
 */
ssr.LoS.Constant.RENDER_TRANSPARENT = cc.color(0, 0, 0, 0);

/**
 * A constant for 0 border width when rendering. <p>
 * The value must not be 0 here since the render will broke when an included angle is very small (eg. 0.00000001).
 * @constant
 * @type Number
 */
ssr.LoS.Constant.RENDER_NO_BORDER = cc.macro.FLT_EPSILON;


/**
 * The connection relationship in between two hit points.
 * enum ssr.LoS.Constant.HIT_POINT_CONNECTION
 * @enum {Number}
 */
ssr.LoS.Constant.HIT_POINT_CONNECTION = {
    /** Hit points connected with segment. */
    "SEGMENT"   : 1,
    /** Hit points connected with arc. */
    "ARC"       : 2
};

/**
 * Point and rectangle position relation test possible result.
 * enum ssr.LoS.Constant.POINT_RECT_TEST
 * @enum {Number}
 */
ssr.LoS.Constant.POINT_RECT_TEST = {
    /** Point inside rectangle. */
    "IN"    : 1,
    /** Point on rectangle. */
    "ON"    : 2,
    /** Point outside rectangle. */
    "OUT"   : 3
};

/**
 * Point and circle position relation test possible result.
 * enum ssr.LoS.Constant.POINT_CIRCLE_TEST
 * @enum {Number}
 */
ssr.LoS.Constant.POINT_CIRCLE_TEST = {
    /** Point in circle. */
    "IN"    : 1,
    /** Point on circle. */
    "ON"    : 2,
    /** Point outside circle. */
    "OUT"   : 3
};

/**
 * Point and sector position relation test possible result.
 * enum ssr.LoS.Constant.POINT_SECTOR_TEST
 * @enum {Number}
 */
ssr.LoS.Constant.POINT_SECTOR_TEST = {
    /** Point inside sector semicircle but outside sector. */
    "FRONT"         : 0,
    /** Point behind sector. */
    "BEHIND"        : 1, 
    /** Point outside bounding circle. */
    "OUT"           : 2,
    /** Point inside sector. */
    "IN"            : 3
};

/**
 * Angle point tyoe.
 * enum ssr.LoS.Constant.ANGLE_POINT_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.ANGLE_POINT_TYPE = {
    /** Angle point is the end point of an edge. */
    "ENDPOINT"      : 1,
    /** Angle point is on the boundary edge. */
    "BOUNDARY"      : 2
};

/**
 * Hit point type.
 * enum ssr.LoS.Constant.HIT_POINT_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.HIT_POINT_TYPE = {
    /** Hit point is the end point of an edge. */
    "ENDPOINT"      : 1,
    /** Hit point is on an edge. */
    "SEGMENT"       : 2,
    /** Hit point is on an boundary edge. */
    "BOUNDARY"      : 3
};

/**
 * Boundary type.
 * enum ssr.LoS.Constant.BOUNDARY_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.BOUNDARY_TYPE = {
    /** No type. */
    "NULL"          : 1,
    /** Rectangle */
    "RECTANGLE"     : 2,
    /** Sector */
    "SECTOR"        : 3,
    /** Circle */
    "CIRCLE"        : 4
};

/**
 * Edge type.
 * enum ssr.LoS.Constant.EDGE_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.EDGE_TYPE = {
    /** The edge belongs to a polygon. */
    "POLYGON"       : 1,
    /** The edge belongs to a polyline. */
    "POLYLINE"      : 2
};

/**
 * Auxiliary angle point type.
 * enum ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.AUXILIARY_ANGLE_POINT_TYPE = {
    /** No need of auxiliary angle point. */
    "NONE"       : 0,
    /** Need one auxiliary angle point (+ ssr.LoS.Constant.IOTA_RADIANS). */
    "PLUS"       : 1,
    /** Need one auxiliary angle point (- ssr.LoS.Constant.IOTA_RADIANS). */
    "MINUS"      : 2,
    /** Need two auxiliary angle point (± ssr.LoS.Constant.IOTA_RADIANS). */
    "BOTH"       : 3
};

/**
 * Boundary edge.
 * enum ssr.LoS.Constant.BOUNDARY_EDGE
 * @enum {Number}
 */
ssr.LoS.Constant.BOUNDARY_EDGE = {
    /** Top edge of boundary. */
    "TOP"           : 1,
    /** Right edge of boundary. */
    "RIGHT"         : 2,
    /** Bottom edge of boundary. */
    "BUTTOM"        : 3,
    /** Right edge of boundary. */
    "RIGHT"         : 4
};

/**
 * Obstacle type.
 * enum ssr.LoS.Constant.OBSTACLE_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.OBSTACLE_TYPE = {
    /** Polygon type obstacle. */
    "POLYGON"       : 1,
    /** Polyline type obstacle. */
    "POLYLINE"      : 2
};

/**
 * Dirty flag (bit operation).
 * enum ssr.LoS.Constant.DIRTY_FLAGS
 * @enum {Number}
 */
ssr.LoS.Constant.DIRTY_FLAGS = {
    /** Not dirty. */
    NOT_DIRTY           : 0,       // 0
    /** Obstacle dirty. */
    OBSTACLE            : 1 << 0,  // 1
    /** Node position dirty. */
    POSITION            : 1 << 1,  // 2
    /** Radius dirty. */
    RADIUS              : 1 << 2,  // 4
    /** Angle dirty. */
    ANGLE               : 1 << 3,  // 8
    /** Mode dirty. */
    MODE                : 1 << 4,  // 16
    /** Culling dirty. */
    CULLING             : 1 << 5,  // 32
    /** Rotation dirty. */
    ROTATION            : 1 << 6,  // 64
    /** Boundary dirty. */
    BOUNDARY            : 1 << 7,  // 128
    /** World Position dirty. */
    /** Dirty flag count. */
    COUNT               : 8,
    /** All flags. */
    ALL                 : (1 << 8) - 1
};

/**
 * LoS log type.
 * enum ssr.LoS.Constant.LOG_TYPE
 * @enum {Number}
 */
ssr.LoS.Constant.LOG_TYPE = {
    /** INFO */
    "INFO"                  : "I",
    /** WARNING */
    "WARNING"               : "W",
    /** ERROR */
    "ERROR"                 : "E",
};

ssr.LoS.Constant.VERSION = "v0.0.1";